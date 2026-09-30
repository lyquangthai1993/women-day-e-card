'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { toPng } from 'html-to-image';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { RelationshipTheme, Language } from '../../types';
import { RELATIONSHIPS, I18N } from '../../lib/constants';
import { getCardFromGoogleSheet } from '../../lib/googleSheet';
import { CardPreview } from '../../components/CardPreview';
import { saveUserLanguage, getSavedUserLanguage } from '../../lib/languageStorage';

function CardViewContent() {
  const searchParams = useSearchParams();
  const urlLang = searchParams.get('lang') || searchParams.get('l');

  const initialLang = (urlLang === 'en' || urlLang === 'vi')
    ? (urlLang as Language)
    : (getSavedUserLanguage() || 'vi');

  const [language, setLanguage] = useState<Language>(initialLang);
  const [relationship, setRelationship] = useState<RelationshipTheme>(RELATIONSHIPS[0]);
  const [receiver, setReceiver] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [sender, setSender] = useState<string>('');
  const [cardId, setCardId] = useState<string | null>(null);

  const [isLoadingCard, setIsLoadingCard] = useState<boolean>(true);
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const cardRef = useRef<HTMLDivElement>(null);
  const t = I18N[language];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'vi' ? 'en' : 'vi';
      saveUserLanguage(next);
      return next;
    });
  };

  useEffect(() => {
    document.title = t.pageTitle;
  }, [t.pageTitle]);

  useEffect(() => {
    let id = searchParams.get('id') || searchParams.get('cardId');
    let rel = searchParams.get('rel');
    let lang = searchParams.get('lang') || searchParams.get('l');
    let rec = searchParams.get('r');
    let send = searchParams.get('s');
    let msg = searchParams.get('m');
    let wishIdx = searchParams.get('w');

    // Hỗ trợ fallback nếu mở bằng hash #id=...
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashStr = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
      const hashParams = new URLSearchParams(hashStr);
      if (!id) id = hashParams.get('id') || hashParams.get('cardId');
      if (!rel) rel = hashParams.get('rel');
      if (!lang) lang = hashParams.get('lang') || hashParams.get('l');
      if (!rec) rec = hashParams.get('r');
      if (!send) send = hashParams.get('s');
      if (!msg) msg = hashParams.get('m');
      if (!wishIdx) wishIdx = hashParams.get('w');
    }

    if (lang === 'vi' || lang === 'en') {
      setLanguage(lang as Language);
    }

    // Chỉ coi là có dữ liệu inline hoàn chỉnh nếu biết trước chủ đề thiệp (rel) VÀ có lời chúc (msg hoặc wishIdx)
    const hasCompleteInlineData = Boolean(rel && (msg || wishIdx));
    const hasAnyInlineData = Boolean(rel || rec || msg || wishIdx);

    if (id) {
      setCardId(id.trim());
    }

    // 1. Nạp trước dữ liệu inline nếu có
    let initialRel = RELATIONSHIPS[0];
    if (rel) {
      const found = RELATIONSHIPS.find((item) => item.id === rel || item.nameVi === rel);
      if (found) {
        initialRel = found;
        setRelationship(found);
      }
    }
    if (rec) setReceiver(rec);
    if (send) setSender(send);
    if (wishIdx) {
      const idx = parseInt(wishIdx, 10);
      const wishes = (lang || 'vi') === 'vi' ? initialRel.wishesVi : initialRel.wishesEn;
      if (!isNaN(idx) && wishes[idx]) {
        setMessage(wishes[idx]);
      }
    } else if (msg) {
      setMessage(msg);
    }

    // 2. Xử lý trạng thái tải (Loading) & Đồng bộ từ Google Sheet
    if (id) {
      // Nếu chưa có đầy đủ theme và nội dung từ URL, hiển thị skeleton loading để tránh bị đổi màu thiệp đột ngột
      if (!hasCompleteInlineData) {
        setIsLoadingCard(true);
      }

      getCardFromGoogleSheet(id.trim()).then((data) => {
        if (data) {
          if (data.receiver) setReceiver(data.receiver);
          if (data.message) setMessage(data.message);
          if (data.sender) setSender(data.sender);
          if (data.relationship) {
            const found = RELATIONSHIPS.find((item) => item.id === data.relationship || item.nameVi === data.relationship);
            if (found) setRelationship(found);
          }
          if (data.language && (data.language === 'vi' || data.language === 'en')) {
            setLanguage(data.language as Language);
          }
        } else if (!hasAnyInlineData) {
          showToast(t.toastCardNotFound);
        }
        setIsLoadingCard(false);
      }).catch(() => {
        setIsLoadingCard(false);
      });
    } else {
      // Không có ID, mở ngay bằng dữ liệu inline
      setIsLoadingCard(false);
    }
  }, [searchParams]);

  // Tên file tiếng Anh chuẩn cho download
  const getDownloadFileName = () => {
    const rawRec = receiver.trim();
    const slug = rawRec
      ? rawRec.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase()
      : "";
    return slug ? `happy-womens-day-${slug}.png` : "happy-womens-day-card.png";
  };

  // Lưu ảnh thiệp về máy bằng html-to-image (chất lượng cao, không lệch font hay che chữ)
  const handleSaveImage = async () => {
    if (!cardRef.current || isSavingImage || isLoadingCard) return;
    setIsSavingImage(true);
    showToast(t.btnSavingText);

    try {
      if (typeof document !== 'undefined' && document.fonts) {
        await document.fonts.ready;
      }

      const targetEl = (cardRef.current.querySelector('#cardCaptureArea') as HTMLElement) || cardRef.current;

      const imgData = await toPng(targetEl, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: relationship.bgColor || '#ffffff',
      });
      const finalFileName = getDownloadFileName();

      const link = document.createElement('a');
      link.href = imgData;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(t.toastImageSaved);
    } catch (error) {
      console.error('Error rendering image:', error);
      alert(language === 'vi' ? 'Không thể xuất ảnh trực tiếp trên thiết bị này. Bạn có thể chụp ảnh màn hình tấm thiệp nhé!' : 'Could not export image directly. Please take a screenshot!');
    } finally {
      setIsSavingImage(false);
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg z-50 animate-fade-in pointer-events-none">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-2xs">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition min-w-0 pr-2">
            <span className="text-xl shrink-0">🌸</span>
            <div className="min-w-0">
              <h1 className="font-serif font-bold text-base sm:text-lg text-rose-900 leading-tight">
                20 · 10 E-Card
              </h1>
              <p className="text-[10px] text-rose-700 tracking-wider font-medium truncate">
                {t.subHeader}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={toggleLanguage}
            className="shrink-0 flex items-center space-x-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100/80 px-2.5 py-1 rounded-full text-xs font-bold text-rose-800 transition"
          >
            <span>{language === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
            <span>{language === 'vi' ? 'VI / EN' : 'EN / VI'}</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6 space-y-5 animate-fade-in">
        {/* Banner tiêu đề trang xem thiệp */}
        <div className="text-center space-y-1.5 pb-1">
          <div className="inline-flex items-center space-x-1.5 bg-rose-100/80 text-rose-800 text-xs font-semibold px-3.5 py-1 rounded-full border border-rose-200 shadow-2xs">
            <span>{t.viewCardGreetingBadge}</span>
          </div>
          <h2 className="font-serif font-bold text-xl text-slate-800 tracking-wide">
            {t.viewCardHeading}
          </h2>
        </div>

        {/* Khung Thiệp Trực Quan */}
        <div ref={cardRef}>
          {isLoadingCard ? (
            <div className="w-full max-w-sm mx-auto aspect-[3/4] rounded-3xl bg-gradient-to-br from-rose-50/90 via-pink-50/70 to-amber-50/80 border-2 border-dashed border-rose-200 shadow-xl flex flex-col items-center justify-center p-8 text-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-rose-100/90 text-rose-500 flex items-center justify-center text-3xl mb-4 shadow-sm animate-bounce">
                🌸
              </div>
              <div className="flex items-center space-x-2 text-rose-800 font-serif font-bold text-base mb-2">
                <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                <span>{language === 'vi' ? 'Đang mở tấm thiệp yêu thương...' : 'Opening your heartfelt e-card...'}</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {language === 'vi' ? 'Đang tải nội dung thiệp được gửi riêng cho bạn, vui lòng đợi trong giây lát...' : 'Loading your custom e-card, please wait a moment...'}
              </p>
              <div className="w-full mt-6 space-y-2.5 opacity-60">
                <div className="h-3.5 bg-rose-200/60 rounded-full w-2/3 mx-auto"></div>
                <div className="h-3.5 bg-rose-200/50 rounded-full w-4/5 mx-auto"></div>
                <div className="h-3.5 bg-rose-200/40 rounded-full w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : (
            <CardPreview
              relationship={relationship}
              language={language}
              receiver={receiver}
              message={message}
              sender={sender}
            />
          )}
        </div>

        {/* Các nút hành động */}
        <div className="space-y-3 pt-2">
          {/* Nút 1: Tải ảnh về máy */}
          <button
            type="button"
            onClick={handleSaveImage}
            disabled={isSavingImage || isLoadingCard}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold py-3.5 px-5 rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-md shadow-rose-200 active:scale-95 transition"
          >
            {isSavingImage ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
            <span>{isSavingImage ? t.btnSavingText : t.btnDownload}</span>
          </button>

          {/* Nút 2: Lớn quay về Trang chủ tạo thiệp */}
          <Link
            href="/"
            className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:opacity-95 text-white font-bold py-3.5 px-5 rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-rose-200 active:scale-95 transition"
          >
            <span>🌸</span>
            <span>{t.btnCreateOwnCardAction}</span>
          </Link>
        </div>

        {/* Footer */}
        <footer className="pt-4 pb-6 text-center text-[11px] text-slate-400 space-y-1">
          <p>{t.footerMadeWith}</p>
        </footer>
      </main>
    </div>
  );
}

export default function CardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="flex items-center space-x-2 text-rose-700 font-serif font-bold text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-rose-600" />
            <span>Đang tải thiệp...</span>
          </div>
        </div>
      }
    >
      <CardViewContent />
    </Suspense>
  );
}
