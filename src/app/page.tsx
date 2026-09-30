'use client';

import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { Sparkles, Share2, Image as ImageIcon } from 'lucide-react';

import { RelationshipTheme, Language } from '../types';
import { RELATIONSHIPS, I18N } from '../lib/constants';
import { getDeviceFingerprint } from '../lib/fingerprint';
import { syncToGoogleSheet, getCardFromGoogleSheet } from '../lib/googleSheet';

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
  const [cardId, setCardId] = useState<string | null>(null);

  // Chế độ xem thiệp chuyên biệt (khi mở từ link chia sẻ / hash)
  const [isViewingMode, setIsViewingMode] = useState<boolean>(false);
  
  const [visitorId, setVisitorId] = useState<string>('fp_loading');
  const [isClaimed, setIsClaimed] = useState<boolean>(false);

  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false);
  const [isIceCreamModalOpen, setIsIceCreamModalOpen] = useState<boolean>(false);
  const [isViewCardModalOpen, setIsViewCardModalOpen] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  const cardRef = useRef<HTMLDivElement>(null);
  const t = I18N[language];

  const generateCardId = () => {
    return 'c_' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36).slice(-4);
  };

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

  useEffect(() => {
    document.title = t.pageTitle;
  }, [t.pageTitle]);

  // Đọc dữ liệu từ URL hash nếu được chia sẻ
  const checkUrlHash = () => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    
    // 1. Kiểm tra Card ID trên Google Sheet (Real-time Cloud Sync)
    let queryStr = hash.startsWith('#') ? hash.substring(1) : hash;
    let params = new URLSearchParams(queryStr);
    if (!params.has('id') && !params.has('cardId') && window.location.search) {
      params = new URLSearchParams(window.location.search);
    }
    const cloudCardId = params.get('id') || params.get('cardId');
    if (cloudCardId) {
      const cleanId = cloudCardId.trim();
      setCardId(cleanId);
      setIsViewingMode(true);
      showToast(t.toastCardLoading);
      getCardFromGoogleSheet(cleanId).then((data) => {
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
          showToast(t.toastCardLoaded);
        } else {
          showToast(t.toastCardNotFound);
        }
      });
      return;
    }

    if (!hash) return;

    // 2. Backward compatibility: #card=...
    if (hash.includes('card=')) {
      try {
        const encoded = hash.split('card=')[1];
        const jsonStr = decodeURIComponent(atob(encoded));
        const data = JSON.parse(jsonStr);

        setIsViewingMode(true);
        if (data.r) setReceiver(data.r);
        if (data.m) setMessage(data.m);
        if (data.s) setSender(data.s);
        if (data.rel) {
          const found = RELATIONSHIPS.find((item) => item.id === data.rel);
          if (found) {
            setRelationship(found);
          }
        }
        if (data.lang) setLanguage(data.lang as Language);
        return;
      } catch (e) {
        console.warn('Invalid URL hash:', e);
      }
    }

    // 3. Compact format: #r=...&s=...&rel=...&w=...&m=... (Luôn < 150 ký tự)
    if (hash.includes('rel=') || hash.includes('r=') || hash.includes('m=')) {
      try {
        setIsViewingMode(true);
        let compactRel = RELATIONSHIPS[0];

        if (params.has('rel')) {
          const found = RELATIONSHIPS.find((item) => item.id === params.get('rel'));
          if (found) {
            compactRel = found;
            setRelationship(found);
          }
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
          const curRel = compactRel;
          const wishes = (params.get('l') || 'vi') === 'vi' ? curRel.wishesVi : curRel.wishesEn;
          if (!isNaN(idx) && wishes[idx]) {
            setMessage(wishes[idx]);
          }
        } else if (params.has('m')) {
          setMessage(params.get('m') || '');
        }
      } catch (e) {
        console.warn('Error parsing compact URL hash:', e);
      }
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

  // Tạo URL chia sẻ với Card ID cố định
  const getCardShareUrl = (activeId: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#id=${activeId}`;
  };

  // Tên file tiếng Anh chuẩn cho download
  const getDownloadFileName = () => {
    const rawRec = receiver.trim();
    const slug = rawRec
      ? rawRec.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase()
      : "";
    return slug ? `happy-womens-day-${slug}.png` : "happy-womens-day-card.png";
  };

  // Chia sẻ thiệp
  const handleShare = async () => {
    let activeCardId = cardId;
    if (!activeCardId) {
      activeCardId = generateCardId();
      setCardId(activeCardId);
    }

    const shareUrl = getCardShareUrl(activeCardId);
    const shareTitle = language === 'vi' ? "Thiệp chúc mừng 20/10 gửi tặng bạn 🌸" : "Happy Vietnamese Women's Day E-Card 🌸";
    const shareText = language === 'vi'
      ? "Mình vừa tạo một tấm thiệp 20/10 gửi tặng bạn. Nhấp vào đây để xem nhé!"
      : "I've created a heartfelt Women's Day e-card for you. Tap to open!";

    window.history.replaceState(null, '', `#id=${activeCardId}`);

    const res = await syncToGoogleSheet({
      action: 'save_card',
      cardId: activeCardId,
      visitorId,
      sender: sender.trim() || 'Ẩn danh',
      receiver: receiver.trim() || (language === 'vi' ? relationship.nameVi : relationship.nameEn),
      relationship: relationship.id,
      message: message.trim() || (language === 'vi' ? relationship.wishesVi[0] : relationship.wishesEn[0]),
      language,
    });

    if (res && res.status === 'success' && res.action === 'updated') {
      showToast(t.toastCardUpdated);
    }

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
        backgroundColor: relationship.bgColor || '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      setGeneratedImageUrl(imgData);

      // Nếu đang trong creator mode thì mở modal xem lại ảnh
      if (!isViewingMode) {
        setIsViewCardModalOpen(true);
      }

      let activeCardId = cardId;
      if (!activeCardId) {
        activeCardId = generateCardId();
        setCardId(activeCardId);
      }

      syncToGoogleSheet({
        action: 'save_card',
        cardId: activeCardId,
        visitorId,
        sender: sender.trim() || 'Ẩn danh',
        receiver: receiver.trim() || (language === 'vi' ? relationship.nameVi : relationship.nameEn),
        relationship: relationship.id,
        message: message.trim() || (language === 'vi' ? relationship.wishesVi[0] : relationship.wishesEn[0]),
        language,
      });

      const finalFileName = getDownloadFileName();

      // Tự động tải về máy
      const link = document.createElement('a');
      link.href = imgData;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(t.toastImageSaved);

      if (!isViewingMode) {
        setTimeout(() => {
          openIceCreamWithConfetti();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      if (!isViewingMode) openIceCreamWithConfetti();
    }
  };

  // Chuyển sang chế độ tạo thiệp mới (Homepage)
  const handleSwitchToCreateMode = () => {
    setIsViewingMode(false);
    setCardId(null);
    window.history.pushState(null, '', window.location.pathname);
    setReceiver('');
    setMessage('');
    setSender('');
    setRelationship(RELATIONSHIPS[0]);
    setIsViewCardModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Chuyển sang chế độ chỉnh sửa thiệp hiện tại
  const handleSwitchToEditMode = () => {
    setIsViewingMode(false);
    setIsViewCardModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {isClaimed && !isViewingMode && (
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
          <div 
            onClick={handleSwitchToCreateMode} 
            className="flex items-center space-x-2 cursor-pointer group select-none"
            title={language === 'vi' ? 'Trang chủ tạo thiệp' : 'Homepage Creator'}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🌸</span>
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

      {/* CHẾ ĐỘ 1: XEM NỘI DUNG THIỆP (KHI MỞ TỪ LINK CHIA SẺ) */}
      {isViewingMode ? (
        <main className="flex-1 max-w-md mx-auto w-full px-4 py-6 space-y-5 animate-fade-in">
          {/* Lời chào thiệp */}
          <div className="text-center space-y-1.5 pb-1">
            <div className="inline-flex items-center space-x-1.5 bg-rose-100/80 text-rose-800 text-xs font-semibold px-3.5 py-1 rounded-full border border-rose-200 shadow-2xs">
              <span>{t.viewCardGreetingBadge}</span>
            </div>
            <h2 className="font-serif font-bold text-xl text-slate-800 tracking-wide">
              {t.viewCardHeading}
            </h2>
          </div>

          {/* Khung Thiệp Trực Quan (Chính giữa trang) */}
          <div ref={cardRef}>
            <CardPreview
              relationship={relationship}
              language={language}
              receiver={receiver}
              message={message}
              sender={sender}
            />
          </div>

          {/* Các nút hành động dành cho người nhận */}
          <div className="space-y-3 pt-2">
            <p className="text-[11px] text-center text-slate-400">
              {t.longPressHint}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleSaveImage}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-rose-200 active:scale-95 transition"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{t.btnDownload}</span>
              </button>

              {cardId ? (
                <button
                  type="button"
                  onClick={handleSwitchToEditMode}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-200 active:scale-95 transition"
                >
                  <span>✏️</span>
                  <span>{t.btnEditCard}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleShare}
                  className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{t.btnShareText}</span>
                </button>
              )}
            </div>

            {/* Nút lớn dẫn về Trang chủ để tạo thiệp */}
            <button
              type="button"
              onClick={handleSwitchToCreateMode}
              className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:opacity-95 text-white font-bold py-3.5 px-5 rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-rose-200 active:scale-95 transition"
            >
              <span>🌸</span>
              <span>{t.btnCreateOwnCardAction}</span>
            </button>
          </div>

          {/* Footer */}
          <footer className="pt-4 pb-6 text-center text-[11px] text-slate-400 space-y-1">
            <p>{t.footerMadeWith}</p>
          </footer>
        </main>
      ) : (
        /* CHẾ ĐỘ 2: TRANG CHỦ TẠO THIỆP (CREATOR MODE) */
        <>
          {/* Privacy Notice */}
          <div className="bg-rose-50/70 border-b border-rose-100 py-1.5 px-4 text-center">
            <p className="text-[11px] text-rose-800" dangerouslySetInnerHTML={{ __html: t.privacyNotice }} />
          </div>

          {/* Main Creator Content */}
          <main className="flex-1 max-w-md mx-auto w-full px-4 py-5 space-y-6">
            
            {/* Banner đang chỉnh sửa thiệp đã lưu */}
            {cardId && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between text-amber-900 shadow-sm animate-fade-in">
                <div className="flex items-center space-x-2.5">
                  <span className="text-lg">✏️</span>
                  <div>
                    <span className="font-bold block text-sm">{t.editingBannerTitle}</span>
                    <span className="text-[11px] text-amber-700/90 block leading-tight mt-0.5">
                      {t.editingBannerSubtitle}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSwitchToCreateMode}
                  className="text-[11px] bg-white border border-amber-200 hover:bg-amber-100 font-bold px-2.5 py-1.5 rounded-xl text-amber-800 transition shadow-2xs"
                >
                  {t.btnCancelEditText}
                </button>
              </div>
            )}

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
                    <span>✨</span>
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
                  <div className="text-[10px] text-slate-400 font-mono">
                    {message.length}/300
                  </div>
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

            {/* Bước 3: Live Preview */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.labelPreview}
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {t.livePreviewHint}
                </span>
              </div>

              <div ref={cardRef}>
                <CardPreview
                  relationship={relationship}
                  language={language}
                  receiver={receiver}
                  message={message}
                  sender={sender}
                />
              </div>
            </section>

            {/* Nút Call To Action */}
            <section className="space-y-2.5 pt-2">
              <button
                onClick={handleShare}
                className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center space-x-2 active:scale-[0.98] transition"
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
        </>
      )}

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
        downloadFileName={getDownloadFileName()}
        onEdit={handleSwitchToEditMode}
        onOpenCreateOwn={handleSwitchToCreateMode}
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
