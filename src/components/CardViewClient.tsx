'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { Link, useRouter, usePathname } from '../lib/I18nNavigation';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { RelationshipTheme, Language } from '../types';
import { RELATIONSHIPS, I18N, isDefaultReceiver, isAnonymousSender } from '../lib/constants';
import { getCardFromGoogleSheet } from '../lib/googleSheet';
import { CardPreview } from './CardPreview';
import { saveUserLanguage } from '../lib/languageStorage';
import { AppConfig } from '../lib/AppConfig';

export interface CardInitialData {
  cardId: string | null;
  language: Language;
  relationship: RelationshipTheme;
  receiver: string;
  message: string;
  sender: string;
  wishIndex: number | null;
  isLoading: boolean;
}

interface CardViewClientProps {
  initialData: CardInitialData;
}

export function CardViewClient({ initialData }: CardViewClientProps) {
  const currentLocale = (useLocale() || AppConfig.defaultLocale) as Language;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [language, setLanguage] = useState<Language>(initialData.language);
  const [relationship, setRelationship] = useState<RelationshipTheme>(initialData.relationship);
  const [receiver, setReceiver] = useState<string>(initialData.receiver);
  const [message, setMessage] = useState<string>(initialData.message);
  const [sender, setSender] = useState<string>(initialData.sender);
  const [cardId, setCardId] = useState<string | null>(initialData.cardId);

  const [isLoadingCard, setIsLoadingCard] = useState<boolean>(initialData.isLoading);
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const userManuallySwitchedLang = useRef<boolean>(false);
  const wishIndexRef = useRef<number | null>(initialData.wishIndex);
  const relationshipRef = useRef<RelationshipTheme>(initialData.relationship);
  const cardRef = useRef<HTMLDivElement>(null);
  const t = I18N[language];

  // Đồng bộ với currentLocale nếu người dùng chưa bấm nút chuyển đổi thủ công
  useEffect(() => {
    if (!userManuallySwitchedLang.current && currentLocale && (currentLocale === 'en' || currentLocale === 'vi')) {
      setLanguage(currentLocale);
      saveUserLanguage(currentLocale);
    }
  }, [currentLocale]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSelectLanguage = (next: Language) => {
    userManuallySwitchedLang.current = true;
    setLanguage(next);
    saveUserLanguage(next);

    const relObj = relationshipRef.current;
    const wIdx = wishIndexRef.current;
    if (wIdx !== null && wIdx >= 0 && relObj) {
      const wishes = next === 'vi' ? relObj.wishesVi : relObj.wishesEn;
      if (wishes[wIdx]) {
        setMessage(wishes[wIdx]);
      }
    }

    setReceiver((prev) => {
      if (isDefaultReceiver(prev, relObj)) {
        return next === 'vi' ? relObj.defaultReceiverVi : relObj.defaultReceiverEn;
      }
      return prev;
    });

    setSender((prev) => {
      if (isAnonymousSender(prev)) {
        return '';
      }
      return prev;
    });

    if (typeof window !== 'undefined') {
      const prefix = next === 'vi' ? '/vi' : '';
      const params = new URLSearchParams(window.location.search);
      params.set('lang', next);
      const hash = window.location.hash || '';
      const targetUrl = `${prefix}/card?${params.toString()}${hash}`;
      window.history.replaceState(null, '', targetUrl);
      document.documentElement.lang = next;
      document.title = I18N[next].pageTitle;
    }
  };

  useEffect(() => {
    document.title = t.pageTitle;
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [t.pageTitle, language]);

  // Hỗ trợ fallback khi người dùng mở bằng client routing hoặc hash (#id=...) mà server không thấy
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let id = searchParams.get('id') || searchParams.get('cardId');
    let rel = searchParams.get('rel');
    let lang = searchParams.get('lang') || searchParams.get('l');
    let rec = searchParams.get('r');
    let send = searchParams.get('s');
    let msg = searchParams.get('m');
    let wishIdx = searchParams.get('w');

    // Parse URL hash nếu có
    if (window.location.hash) {
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

    // Nếu đã có dữ liệu ban đầu từ server (initialData.isLoading === false) và không có hash mới thì không cần fetch lại
    if (!initialData.isLoading && !window.location.hash) {
      return;
    }

    if (id && (!cardId || initialData.isLoading)) {
      setCardId(id.trim());
      setIsLoadingCard(true);

      getCardFromGoogleSheet(id.trim()).then((data) => {
        if (data) {
          let currentRel = relationshipRef.current || RELATIONSHIPS[0];
          if (data.relationship) {
            const found = RELATIONSHIPS.find(
              (item) => item.id === data.relationship || item.nameVi === data.relationship || item.nameEn === data.relationship || (item.id === 'other' && (data.relationship.toLowerCase() === 'others' || data.relationship === 'Khác - Others'))
            );
            if (found) {
              currentRel = found;
              setRelationship(found);
              relationshipRef.current = found;
            }
          }

          let detectedWishIdx = -1;
          if (data.message) {
            const viI = currentRel.wishesVi.indexOf(data.message);
            const enI = currentRel.wishesEn.indexOf(data.message);
            if (viI >= 0) detectedWishIdx = viI;
            else if (enI >= 0) detectedWishIdx = enI;
          } else if (wishIdx) {
            detectedWishIdx = parseInt(wishIdx, 10);
          }
          wishIndexRef.current = detectedWishIdx >= 0 ? detectedWishIdx : null;

          const activeLang = userManuallySwitchedLang.current ? language : (currentLocale === 'vi' ? 'vi' : (data.language && (data.language === 'vi' || data.language === 'en') ? (data.language as Language) : language));

          if (detectedWishIdx >= 0) {
            const wishes = activeLang === 'vi' ? currentRel.wishesVi : currentRel.wishesEn;
            if (wishes[detectedWishIdx]) {
              setMessage(wishes[detectedWishIdx]);
            } else if (data.message) {
              setMessage(data.message);
            }
          } else if (data.message) {
            setMessage(data.message);
          }

          if (data.receiver) {
            if (isDefaultReceiver(data.receiver, currentRel)) {
              setReceiver(activeLang === 'vi' ? currentRel.defaultReceiverVi : currentRel.defaultReceiverEn);
            } else {
              setReceiver(data.receiver);
            }
          }

          if (data.sender) {
            setSender(isAnonymousSender(data.sender) ? '' : data.sender);
          }

          if (!userManuallySwitchedLang.current && currentLocale !== 'vi') {
            if (data.language && (data.language === 'vi' || data.language === 'en')) {
              setLanguage(data.language as Language);
            }
          }
        }
        setIsLoadingCard(false);
      }).catch(() => {
        setIsLoadingCard(false);
      });
    }
  }, [searchParams, initialData.isLoading]);

  // Tên file tiếng Anh chuẩn cho download
  const getDownloadFileName = () => {
    const rawRec = receiver.trim();
    const slug = rawRec
      ? rawRec.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase()
      : "";
    return slug ? `happy-womens-day-${slug}.png` : "happy-womens-day-card.png";
  };

  // Lưu ảnh thiệp về máy bằng html-to-image
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
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition flex-1 min-w-0 pr-4">
            <span className="text-xl shrink-0">🌸</span>
            <div className="min-w-0">
              <h1 className="font-serif font-bold text-base sm:text-lg text-rose-900 leading-tight truncate">
                20 · 10 E-Card
              </h1>
              <p className="text-[10px] text-rose-700 tracking-wider font-medium truncate">
                {t.subHeader}
              </p>
            </div>
          </Link>

          {/* Segmented Language Switcher: [ VI | EN ] */}
          <div className="shrink-0 ml-auto flex items-center bg-rose-50/90 border border-rose-200/80 p-0.5 rounded-full shadow-2xs">
            <button
              type="button"
              onClick={() => handleSelectLanguage('vi')}
              className={`w-9 h-7 inline-flex items-center justify-center rounded-full text-xs font-bold transition-colors duration-150 select-none ${
                language === 'vi'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700/80 hover:text-rose-900 hover:bg-rose-100/50'
              }`}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => handleSelectLanguage('en')}
              className={`w-9 h-7 inline-flex items-center justify-center rounded-full text-xs font-bold transition-colors duration-150 select-none ${
                language === 'en'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700/80 hover:text-rose-900 hover:bg-rose-100/50'
              }`}
            >
              EN
            </button>
          </div>
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
