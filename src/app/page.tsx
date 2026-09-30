'use client';

import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { Sparkles, Share2, Image as ImageIcon, Globe, Lock } from 'lucide-react';

import { RelationshipTheme, Language } from '../types';
import { RELATIONSHIPS, I18N } from '../lib/constants';
import { getDeviceFingerprint } from '../lib/fingerprint';
import { syncToGoogleSheet } from '../lib/googleSheet';

import { CardPreview } from '../components/CardPreview';
import { SuggestionsModal } from '../components/SuggestionsModal';
import { IceCreamModal } from '../components/IceCreamModal';
import { ViewCardModal } from '../components/ViewCardModal';

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('vi');
  const [relationship, setRelationship] = useState<RelationshipTheme>(RELATIONSHIPS[0]);
  const [receiver, setReceiver] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [sender, setSender] = useState<string>('');
  
  const [visitorId, setVisitorId] = useState<string>('fp_loading');
  const [isClaimed, setIsClaimed] = useState<boolean>(false);

  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false);
  const [isIceCreamModalOpen, setIsIceCreamModalOpen] = useState<boolean>(false);
  const [isViewCardModalOpen, setIsViewCardModalOpen] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  const cardRef = useRef<HTMLDivElement>(null);
  const t = I18N[language];

  // Khởi tạo FingerprintJS và kiểm tra trạng thái vé kem
  useEffect(() => {
    async function init() {
      const id = await getDeviceFingerprint();
      setVisitorId(id);
      
      const claimedKey = 'icecream_claimed_' + id;
      if (localStorage.getItem(claimedKey) === 'true') {
        setIsClaimed(true);
      }
    }
    init();
    checkUrlHash();
  }, []);

  // Đọc dữ liệu từ URL hash nếu được chia sẻ
  const checkUrlHash = () => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash) return;

    // 1. Backward compatibility: #card=...
    if (hash.includes('card=')) {
      try {
        const encoded = hash.split('card=')[1];
        const jsonStr = decodeURIComponent(atob(encoded));
        const data = JSON.parse(jsonStr);

        if (data.r) setReceiver(data.r);
        if (data.m) setMessage(data.m);
        if (data.s) setSender(data.s);
        if (data.rel) {
          const found = RELATIONSHIPS.find((item) => item.id === data.rel);
          if (found) setRelationship(found);
        }
        if (data.lang) setLanguage(data.lang as Language);

        setTimeout(async () => {
          if (cardRef.current) {
            const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: null });
            setGeneratedImageUrl(canvas.toDataURL('image/png'));
            setIsViewCardModalOpen(true);
          }
        }, 600);
        return;
      } catch (e) {
        console.warn('Invalid URL hash:', e);
      }
    }

    // 2. Compact format: #r=...&s=...&rel=...&w=...&m=... (Luôn < 150 ký tự)
    try {
      const queryStr = hash.startsWith('#') ? hash.substring(1) : hash;
      const params = new URLSearchParams(queryStr);

      if (params.has('rel')) {
        const found = RELATIONSHIPS.find((item) => item.id === params.get('rel'));
        if (found) setRelationship(found);
      }
      if (params.has('l')) {
        setLanguage(params.get('l') as Language);
      }
      if (params.has('r')) {
        setReceiver(params.get('r') || '');
      }
      if (params.has('s')) {
        setSender(params.get('s') || '');
      }
      if (params.has('w')) {
        const idx = parseInt(params.get('w') || '0', 10);
        const curRel = RELATIONSHIPS.find((item) => item.id === (params.get('rel') || 'mother')) || RELATIONSHIPS[0];
        const wishes = (params.get('l') || 'vi') === 'vi' ? curRel.wishesVi : curRel.wishesEn;
        if (!isNaN(idx) && wishes[idx]) {
          setMessage(wishes[idx]);
        }
      } else if (params.has('m')) {
        setMessage(params.get('m') || '');
      }

      setTimeout(async () => {
        if (cardRef.current) {
          const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: null });
          setGeneratedImageUrl(canvas.toDataURL('image/png'));
          setIsViewCardModalOpen(true);
        }
      }, 600);
    } catch (e) {
      console.warn('Error parsing compact URL hash:', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const handleSelectRelationship = (rel: RelationshipTheme) => {
    setRelationship(rel);
  };

  const handleSelectWish = (selectedWish: string) => {
    setMessage(selectedWish);
    showToast(t.toastWishSelected);
  };

  // Tạo URL chia sẻ siêu ngắn (Luôn < 150 ký tự, tránh lỗi QR code > 400 chars)
  const getCardShareUrl = () => {
    const wishes = language === 'vi' ? relationship.wishesVi : relationship.wishesEn;
    const wishIdx = wishes.findIndex((w) => w.trim() === message.trim());

    const params = new URLSearchParams();
    if (receiver.trim()) params.set('r', receiver.trim());
    if (sender.trim()) params.set('s', sender.trim());
    params.set('rel', relationship.id);
    if (language !== 'vi') params.set('l', language);

    if (wishIdx >= 0) {
      params.set('w', wishIdx.toString());
    } else if (message.trim()) {
      params.set('m', message.trim());
    }

    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#${params.toString()}`;
  };

  // Chia sẻ thiệp
  const handleShare = async () => {
    const shareUrl = getCardShareUrl();
    const shareTitle = "Thiệp chúc mừng 20/10 gửi tặng bạn 🌸";
    const shareText = "Mình vừa tạo một tấm thiệp 20/10 gửi tặng bạn. Nhấp vào đây để xem nhé!";

    syncToGoogleSheet({
      action: 'create_card',
      visitorId,
      sender: sender.trim() || 'Ẩn danh',
      receiver: receiver.trim() || relationship.nameVi,
      relationship: relationship.nameVi,
      message: message.trim() || relationship.wishesVi[0],
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        showToast(t.toastCopied);
        openIceCreamWithConfetti();
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.log('Share canceled/fallback');
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast(t.toastCopied);
    } catch {
      prompt("Copy đường link thiệp bên dưới để gửi qua Zalo/Messenger:", shareUrl);
    }

    openIceCreamWithConfetti();
  };

  // Lưu ảnh thiệp bằng html2canvas
  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    showToast("Đang kết xuất ảnh thiệp...");

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      setGeneratedImageUrl(imgData);
      setIsViewCardModalOpen(true);

      syncToGoogleSheet({
        action: 'create_card',
        visitorId,
        sender: sender.trim() || 'Ẩn danh',
        receiver: receiver.trim() || relationship.nameVi,
        relationship: relationship.nameVi,
        message: message.trim() || relationship.wishesVi[0],
      });

      // Tự động tải về nếu trình duyệt hỗ trợ
      const link = document.createElement('a');
      link.href = imgData;
      const recName = receiver.trim() || 'nguoi-thuong';
      link.download = `thiep-20-10-${recName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(t.toastImageSaved);

      setTimeout(() => {
        openIceCreamWithConfetti();
      }, 1200);
    } catch (err) {
      console.error(err);
      openIceCreamWithConfetti();
    }
  };

  const openIceCreamWithConfetti = () => {
    setIsIceCreamModalOpen(true);
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleClaimIceCream = () => {
    setIsClaimed(true);
    localStorage.setItem('icecream_claimed_' + visitorId, 'true');
    showToast(t.toastClaimed);

    syncToGoogleSheet({
      action: 'claim_icecream',
      visitorId,
      sender: sender.trim() || 'Ẩn danh',
    });

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  return (
    <>
      {/* Banner nhận kem sticky */}
      {isClaimed && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white text-xs font-semibold py-2 px-4 shadow-sm flex items-center justify-between z-30 sticky top-0">
          <div className="flex items-center space-x-2">
            <span className="text-base">🍦</span>
            <span>{t.claimedBannerText}</span>
          </div>
          <button
            onClick={() => setIsIceCreamModalOpen(true)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-[11px] font-bold tracking-wide transition"
          >
            Xem vé
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌸</span>
            <div>
              <h1 className="font-serif font-bold text-lg text-rose-700 leading-tight">20 · 10 E-Card</h1>
              <p className="text-[10px] text-slate-400 font-medium leading-none">{t.subHeader}</p>
            </div>
          </div>

          {/* Toggle VI/EN */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold px-2.5 py-1.5 rounded-full transition"
          >
            <span>{language === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
            <span>{language === 'vi' ? 'VI / EN' : 'EN / VI'}</span>
          </button>
        </div>
      </header>

      {/* Privacy Notice */}
      <div className="bg-rose-50/70 border-b border-rose-100 py-1.5 px-4 text-center">
        <p className="text-[11px] text-rose-800" dangerouslySetInnerHTML={{ __html: t.privacyNotice }} />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-5 space-y-6">
        
        {/* Bước 1: Chọn đối tượng */}
        <section>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            {t.labelRelationship}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {RELATIONSHIPS.map((rel) => {
              const isSelected = rel.id === relationship.id;
              const name = language === 'vi' ? rel.nameVi : rel.nameEn;
              return (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => handleSelectRelationship(rel)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                    isSelected 
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-rose-200 text-slate-600'
                  }`}
                >
                  <span className="text-xl mb-1">{rel.icon}</span>
                  <span className={`text-[11px] font-bold leading-tight ${isSelected ? 'text-rose-700' : 'text-slate-700'}`}>
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Bước 2: Nhập thông tin & Lời chúc */}
        <section className="space-y-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              {t.labelReceiverName}
            </label>
            <input
              type="text"
              maxLength={40}
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder={t.receiverPlaceholder}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition bg-slate-50/50"
            />
          </div>

          {/* Lời nhắn & Nút mở Popup gợi ý */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-600">
                {t.labelMessage}
              </label>
              <button
                type="button"
                onClick={() => setIsSuggestionsOpen(true)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-full active:scale-95 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.btnOpenSuggestions}</span>
              </button>
            </div>

            <textarea
              rows={3}
              maxLength={300}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition bg-slate-50/50 resize-none"
            />
            
            <div className="flex items-center justify-between mt-1">
              <button
                type="button"
                onClick={() => setIsSuggestionsOpen(true)}
                className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold inline-flex items-center space-x-1.5 group transition"
              >
                <span className="text-xs group-hover:rotate-12 transition-transform">💡</span>
                <span className="underline decoration-rose-300 underline-offset-2">{t.quickOpenPrompt}</span>
              </button>
              <div className="text-[10px] text-slate-400 font-mono">{message.length}/300</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              {t.labelSenderName}
            </label>
            <input
              type="text"
              maxLength={35}
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder={t.senderPlaceholder}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition bg-slate-50/50"
            />
          </div>
        </section>

        {/* Bước 3: Xem trước thiệp */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.labelPreview}
            </label>
            <span className="text-[11px] text-slate-400">{t.livePreviewHint}</span>
          </div>

          <CardPreview
            cardRef={cardRef}
            relationship={relationship}
            receiver={receiver}
            sender={sender}
            message={message}
            language={language}
          />
        </section>

        {/* Bước 4: 2 Nút hành động chính */}
        <section className="space-y-2.5 pt-2">
          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center space-x-2 active:scale-[0.98] transition"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm tracking-wide">{t.btnShareText}</span>
          </button>

          <button
            onClick={handleSaveImage}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center space-x-2 active:scale-[0.98] transition"
          >
            <ImageIcon className="w-5 h-5 text-rose-500" />
            <span className="text-sm tracking-wide">{t.btnSaveImgText}</span>
          </button>
        </section>

        {/* Footer */}
        <footer className="pt-4 pb-6 text-center text-[11px] text-slate-400 space-y-1">
          <p>{t.footerMadeWith}</p>
          <p className="font-mono text-[10px] text-slate-300">Device ID: {visitorId.substring(0, 10)}...</p>
        </footer>
      </main>

      {/* Modals */}
      <SuggestionsModal
        isOpen={isSuggestionsOpen}
        onClose={() => setIsSuggestionsOpen(false)}
        relationship={relationship}
        language={language}
        currentMessage={message}
        onSelectWish={handleSelectWish}
      />

      <IceCreamModal
        isOpen={isIceCreamModalOpen}
        onClose={() => setIsIceCreamModalOpen(false)}
        language={language}
        visitorId={visitorId}
        isClaimed={isClaimed}
        onClaim={handleClaimIceCream}
      />

      <ViewCardModal
        isOpen={isViewCardModalOpen}
        onClose={() => setIsViewCardModalOpen(false)}
        language={language}
        imageUrl={generatedImageUrl}
        onOpenCreateOwn={() => {
          setIsViewCardModalOpen(false);
          window.location.hash = '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg transition-all duration-300 z-50">
          {toastMessage}
        </div>
      )}
    </>
  );
}
