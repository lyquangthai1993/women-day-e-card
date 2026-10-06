'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Sparkles, Share2, Image as ImageIcon, Loader2, RefreshCw, PlusCircle } from 'lucide-react';

import { RelationshipTheme, Language } from '../../types';
import { RELATIONSHIPS, I18N, getIceCreamClaimStorageKey } from '../../lib/constants';
import { getDeviceFingerprint } from '../../lib/fingerprint';
import { syncToGoogleSheet, getCardFromGoogleSheet } from '../../lib/googleSheet';
import { recordCardOwnership, isCardOwnedLocally, canEditCard } from '../../lib/cardOwnership';

import { CardPreview } from '../../components/CardPreview';
import { SuggestionsModal } from '../../components/SuggestionsModal';
import { IceCreamModal } from '../../components/IceCreamModal';
import { ViewCardModal } from '../../components/ViewCardModal';
import { saveUserLanguage, getInitialLocale } from '../../lib/languageStorage';
import { AppConfig } from '../../lib/AppConfig';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../lib/I18nNavigation';

export default function HomePage() {
  const currentLocale = (useLocale() || AppConfig.defaultLocale) as Language;
  const [language, setLanguage] = useState<Language>(currentLocale);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (currentLocale && (currentLocale === 'en' || currentLocale === 'vi')) {
      setLanguage(currentLocale);
      saveUserLanguage(currentLocale);
    }
  }, [currentLocale]);
  const [relationship, setRelationship] = useState<RelationshipTheme>(RELATIONSHIPS[0]);
  const [receiver, setReceiver] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [sender, setSender] = useState<string>('');
  const [cardId, setCardId] = useState<string | null>(null);

  // Chế độ xem thiệp chuyên biệt (khi mở từ link chia sẻ / hash)
  const [isViewingMode, setIsViewingMode] = useState<boolean>(false);
  const [isLoadingCard, setIsLoadingCard] = useState<boolean>(false);
  
  // Trạng thái loading spinner khi bấm nút
  const [sharingAction, setSharingAction] = useState<'update' | 'new' | 'default' | null>(null);
  const isSharing = sharingAction !== null;
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);

  const [visitorId, setVisitorId] = useState<string>('fp_loading');
  const [isClaimed, setIsClaimed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('icecream_claimed') && localStorage.getItem(k) === 'true') {
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

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
      
      const claimedKey = getIceCreamClaimStorageKey(id);
      if (localStorage.getItem(claimedKey) === 'true') {
        setIsClaimed(true);
      }
    }
    init();
    checkUrlHash();
  }, []);

  useEffect(() => {
    document.title = t.pageTitle;
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [t.pageTitle, language]);

  // Đọc dữ liệu từ URL hash nếu được chia sẻ
  // Đọc dữ liệu từ URL nếu được mở từ liên kết
  const checkUrlHash = () => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    
    let queryStr = hash.startsWith('#') ? hash.substring(1) : hash;
    let params = new URLSearchParams(queryStr);
    if (!params.has('id') && !params.has('cardId') && !params.has('edit') && window.location.search) {
      params = new URLSearchParams(window.location.search);
    }

    // 1. Chế độ chỉnh sửa thiệp (khi được chuyển từ trang /card về trang chủ hoặc mở qua ?edit=)
    if (params.has('edit')) {
      const editId = params.get('edit')!.trim();
      setIsViewingMode(false);

      if (params.has('rel')) {
        const found = RELATIONSHIPS.find((item) => item.id === params.get('rel'));
        if (found) setRelationship(found);
      }
      const editLang = params.get('lang') || params.get('l');
      if (editLang === 'vi' || editLang === 'en') setLanguage(editLang as Language);
      if (params.has('r')) setReceiver(params.get('r') || '');
      if (params.has('s')) setSender(params.get('s') || '');
      if (params.has('m')) setMessage(params.get('m') || '');

      // Kiểm tra nhanh quyền sở hữu trên thiết bị qua localStorage
      const hasLocalOwnership = isCardOwnedLocally(editId);
      if (hasLocalOwnership) {
        setCardId(editId);
      }

      getCardFromGoogleSheet(editId).then(async (data) => {
        if (data) {
          if (data.receiver) setReceiver(data.receiver);
          if (data.message) setMessage(data.message);
          if (data.sender) setSender(data.sender);
          if (data.relationship) {
            const found = RELATIONSHIPS.find(
              (item) => item.id === data.relationship || item.nameVi === data.relationship || item.nameEn === data.relationship || (item.id === 'other' && (data.relationship.toLowerCase() === 'others' || data.relationship === 'Khác - Others'))
            );
            if (found) setRelationship(found);
          }

          // Kiểm tra quyền sở hữu đối chiếu với Google Sheet
          const currentFp = await getDeviceFingerprint();
          const isOwner = canEditCard(editId, currentFp, data.visitorId);

          if (isOwner) {
            setCardId(editId);
            recordCardOwnership(editId);
          } else {
            // Người truy cập không phải chủ sở hữu tấm thiệp:
            // Chuyển sang chế độ tạo thiệp mới (Clone/Fork mẫu), không cho ghi đè thiệp gốc
            setCardId(null);
            if (typeof window !== 'undefined') {
              const cleanUrl = window.location.pathname;
              window.history.replaceState(null, '', cleanUrl);
            }
            showToast(t.unauthorizedEditNotice);
          }
        } else if (!hasLocalOwnership) {
          setCardId(null);
        }
      });
      return;
    }

    // 2. Nếu người dùng mở link xem thiệp cũ (có id) ở trang chủ, tự động chuyển sang trang con /card
    const cloudCardId = params.get('id') || params.get('cardId');
    if (cloudCardId) {
      const localePrefix = language === 'vi' ? '/vi' : '';
      window.location.replace(`${localePrefix}/card?${params.toString()}`);
      return;
    }

    if (!hash) return;

    // 3. Backward compatibility: #card=...
    if (hash.includes('card=')) {
      const localePrefix = language === 'vi' ? '/vi' : '';
      window.location.replace(`${localePrefix}/card${hash}`);
      return;
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleLanguage = () => {
    const next = language === 'vi' ? 'en' : 'vi';
    handleSelectLanguage(next);
  };

  const handleSelectLanguage = (next: Language) => {
    if (language !== next) {
      setLanguage(next);
      saveUserLanguage(next);
      if (typeof window !== 'undefined') {
        const targetUrl = next === 'vi' ? '/vi' : '/';
        window.history.replaceState(null, '', targetUrl);
        document.documentElement.lang = next;
        document.title = I18N[next].pageTitle;
      }
    }
  };

  const handleSelectRelationship = (rel: RelationshipTheme) => {
    setRelationship(rel);
  };

  const handleSelectWish = (selectedWish: string) => {
    setMessage(selectedWish);
    showToast(t.toastWishSelected);
  };

  // Tạo URL chia sẻ hướng về trang con /card?id=... (Luôn định nghĩa sẵn ngôn ngữ vi/en trên URL)
  const getCardShareUrl = (activeId: string) => {
    const localePrefix = language === 'vi' ? '/vi' : '';
    const baseUrl = `${window.location.origin}${localePrefix}/card`;
    const p = new URLSearchParams();
    p.set('id', activeId);
    p.set('lang', language);
    p.set('rel', relationship.id);
    if (receiver.trim()) p.set('r', receiver.trim());
    if (sender.trim()) p.set('s', sender.trim());

    const wishes = language === 'vi' ? relationship.wishesVi : relationship.wishesEn;
    const wishIdx = wishes.indexOf(message);
    if (wishIdx >= 0) {
      p.set('w', wishIdx.toString());
    } else if (message.trim()) {
      p.set('m', message.trim());
    }
    return `${baseUrl}?${p.toString()}`;
  };

  // Tên file tiếng Anh chuẩn cho download
  const getDownloadFileName = () => {
    const rawRec = receiver.trim();
    const slug = rawRec
      ? rawRec.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase()
      : "";
    return slug ? `happy-womens-day-${slug}.png` : "happy-womens-day-card.png";
  };

  // Cơ chế Tự động Kích hoạt ISR & Edge Cache Warm-up ngầm (Pre-warm Background Ping)
  const prewarmCardCache = (cId: string, sUrl: string, includeCleanRoutes = false, isUpdate = false) => {
    if (typeof window === 'undefined') return;
    try {
      const origin = window.location.origin;
      const targets: string[] = [sUrl];
      if (includeCleanRoutes) {
        targets.push(
          `${origin}/vi/card/${cId}`,
          `${origin}/card/${cId}`,
          `${origin}/vi/card?id=${cId}`,
          `${origin}/card?id=${cId}&lang=en`,
          `${origin}/api/warm?id=${cId}${isUpdate ? '&revalidate=true' : ''}`
        );
      }
      targets.forEach((url) => {
        fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          cache: isUpdate ? 'no-store' : 'reload',
        }).catch(() => {});
      });
    } catch {
      // Bỏ qua lỗi ngầm
    }
  };

  // Chia sẻ thiệp kèm hiệu ứng loading spinner (hỗ trợ tạo mới và cập nhật thiệp)
  const handleShare = async () => {
    if (isSharing) return;
    const isNewCard = !cardId;
    const actionType = cardId ? 'update' : 'default';
    setSharingAction(actionType);

    try {
      let activeCardId = cardId;
      if (!activeCardId) {
        activeCardId = generateCardId();
        setCardId(activeCardId);
        recordCardOwnership(activeCardId);
      }

      const shareUrl = getCardShareUrl(activeCardId);
      const shareTitle = language === 'vi' ? "Thiệp chúc mừng 20/10 gửi tặng bạn 🌸" : "Happy Vietnamese Women's Day E-Card 🌸";
      const shareText = language === 'vi'
        ? "Mình vừa tạo một tấm thiệp 20/10 gửi tặng bạn. Nhấp vào đây để xem nhé!"
        : "I've created a heartfelt Women's Day e-card for you. Tap to open!";

      window.history.replaceState(null, '', `#id=${activeCardId}`);

      // 1. Pre-warm tức thì với các tham số inline của shareUrl (nếu cập nhật thì kèm cờ revalidate)
      prewarmCardCache(activeCardId, shareUrl, false, !isNewCard);

      // 2. Đồng bộ ngầm lên Google Sheet (Optimistic UI - không bắt người dùng đợi mạng)
      syncToGoogleSheet({
        action: 'save_card',
        cardId: activeCardId,
        cardUrl: shareUrl,
        visitorId,
        sender: sender.trim() || '',
        receiver: receiver.trim() || (language === 'vi' ? relationship.defaultReceiverVi : relationship.defaultReceiverEn),
        relationship: relationship.id,
        message: message.trim() || (language === 'vi' ? relationship.wishesVi[0] : relationship.wishesEn[0]),
        language,
      }).then((res) => {
        if (res && res.status === 'error') {
          showToast(t.toastPermissionDenied || 'Bạn không có quyền chỉnh sửa thiệp này!');
          setCardId(null);
          return;
        }
        // 3. Khi Google Sheet đã ghi xong, kích hoạt purge cache cũ và nạp mới ISR
        prewarmCardCache(activeCardId, shareUrl, true, !isNewCard);
        if (!isNewCard && res && res.status === 'success' && res.action === 'updated') {
          showToast(t.toastCardUpdated);
        }
      });

      if (!isNewCard) {
        showToast(t.toastCardUpdated);
      }

      const isMobile = /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent || '');
      if (isMobile && navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl,
          });
          showToast(t.toastCopied);
          if (isNewCard && !isClaimed) {
            openIceCreamWithConfetti();
          } else {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          }
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

      if (isNewCard && !isClaimed) {
        openIceCreamWithConfetti();
      } else {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error("Error sharing card:", err);
    } finally {
      setSharingAction(null);
    }
  };

  // Lưu ảnh thiệp bằng html-to-image (chất lượng cao, không lệch font hay che chữ)
  const handleSaveImage = async () => {
    if (!cardRef.current || isSavingImage) return;
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
      setGeneratedImageUrl(imgData);

      // Nếu đang trong creator mode thì mở modal xem lại ảnh
      if (!isViewingMode) {
        setIsViewCardModalOpen(true);
      }

      const isNew = !cardId;
      let activeCardId = cardId;
      if (!activeCardId) {
        activeCardId = generateCardId();
        setCardId(activeCardId);
        recordCardOwnership(activeCardId);
      }

      const saveShareUrl = getCardShareUrl(activeCardId);
      prewarmCardCache(activeCardId, saveShareUrl, false, !isNew);

      syncToGoogleSheet({
        action: 'save_card',
        cardId: activeCardId,
        cardUrl: saveShareUrl,
        visitorId,
        sender: sender.trim() || '',
        receiver: receiver.trim() || (language === 'vi' ? relationship.defaultReceiverVi : relationship.defaultReceiverEn),
        relationship: relationship.id,
        message: message.trim() || (language === 'vi' ? relationship.wishesVi[0] : relationship.wishesEn[0]),
        language,
      }).then(() => {
        prewarmCardCache(activeCardId, saveShareUrl, true, !isNew);
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
    } finally {
      setIsSavingImage(false);
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

  // Bắt đầu tạo thiệp mới gửi người khác (Phương án A: Làm mới người nhận & lời chúc, giữ lại tên người gửi)
  const handleCreateNewForOther = () => {
    setCardId(null);
    window.history.pushState(null, '', window.location.pathname);
    setReceiver('');
    setMessage('');
    setRelationship(RELATIONSHIPS[0]);
    showToast(language === 'vi' ? 'Sẵn sàng tạo thiệp mới gửi người khác! 🌸' : 'Ready to create a new card for someone else! 🌸');
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
    localStorage.setItem(getIceCreamClaimStorageKey(visitorId), 'true');
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
      {/* Floating Ice Cream Pass Button ở góc dưới bên trái */}
      {isClaimed && !isViewingMode && (
        <aside aria-label="Ice Cream Ticket" className="fixed bottom-5 left-4 sm:left-6 z-40">
          <button
            type="button"
            onClick={openIceCreamWithConfetti}
            className="group flex items-center space-x-2.5 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white pl-2.5 pr-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/70 backdrop-blur-xs select-none cursor-pointer"
            title={language === 'vi' ? 'Nhấn để xem vé nhận kem 🍦' : 'Tap to view your Ice Cream Pass 🍦'}
          >
            <span className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center text-lg shadow-inner group-hover:rotate-12 transition-transform">
              🍦
            </span>
            <div className="text-left leading-tight">
              <p className="text-[10px] font-semibold text-amber-100 uppercase tracking-wider">
                {language === 'vi' ? 'Vé nhận kem' : 'Ice Cream Pass'}
              </p>
              <p className="text-xs font-bold tracking-tight">
                {t.btnViewTicket}
              </p>
            </div>
          </button>
        </aside>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-20">
        <div className="max-w-md lg:max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div 
            onClick={handleSwitchToCreateMode} 
            className="flex items-center space-x-2 cursor-pointer group select-none flex-1 min-w-0 pr-4"
            title={language === 'vi' ? 'Trang chủ tạo thiệp' : 'Homepage Creator'}
          >
            <span className="text-xl group-hover:scale-110 transition-transform shrink-0">🌸</span>
            <div className="min-w-0">
              <h1 className="font-serif font-bold text-lg text-rose-700 leading-tight truncate">20 · 10 E-Card</h1>
              <p className="text-[10px] text-slate-400 font-medium leading-none truncate">{t.subHeader}</p>
            </div>
          </div>

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

          {/* Các nút hành động dành cho người nhận */}
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
          <main className="flex-1 max-w-md lg:max-w-5xl mx-auto w-full px-4 py-5 lg:py-8 space-y-6">
            
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

            {/* Grid 2 cột trên Desktop (lg:), 1 cột trên Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* CỘT TRÁI (Desktop): Bước 1 - Chọn đối tượng & Nhập nội dung */}
              <div className="lg:col-span-6 space-y-5">
                {/* Bước 1: Chọn đối tượng */}
                <section>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    {t.labelRelationship}
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
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

                {/* Bước 1 tiếp tục: Nhập thông tin & Lời chúc */}
                <section className="space-y-3 bg-white p-4 lg:p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {relationship.id === 'other'
                        ? (language === 'vi' ? 'Tên hoặc danh xưng người nhận (bạn muốn ghi cho ai cũng được):' : 'Recipient\'s name or title (any special person):')
                        : t.labelReceiverName}
                    </label>
                    <input
                      type="text"
                      maxLength={40}
                      value={receiver}
                      onChange={(e) => setReceiver(e.target.value)}
                      placeholder={
                        relationship.id === 'other'
                          ? (language === 'vi' ? 'Ví dụ: Cô giáo, Dì Út, Con gái, Bạn, Khách hàng, Bé Thảo...' : 'E.g. Teacher, Aunt, Daughter, Client, Friend...')
                          : t.receiverPlaceholder
                      }
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
              </div>

              {/* CỘT PHẢI (Desktop): Bước 2 - Xem trước thiệp & Nút thao tác */}
              <div className="lg:col-span-6 space-y-5 lg:sticky lg:top-20">
                {/* Bước 2: Live Preview */}
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
                <section className="space-y-2.5 pt-1">
                  {cardId ? (
                    <>
                      {/* Nút 1: Cập nhật thiệp hiện tại */}
                      <button
                        type="button"
                        onClick={() => handleShare()}
                        disabled={isSharing || isSavingImage}
                        className={`w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center space-x-2 active:scale-[0.98] transition ${isSharing ? 'opacity-80 cursor-wait' : ''}`}
                      >
                        {sharingAction === 'update' ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm tracking-wide">{t.btnSharingText}</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            <span className="text-sm tracking-wide">{t.btnUpdateCurrentCard}</span>
                          </>
                        )}
                      </button>

                      {/* Nút 2: Bắt đầu tạo thiệp mới gửi người khác (Phương án A) */}
                      <button
                        type="button"
                        onClick={handleCreateNewForOther}
                        disabled={isSharing || isSavingImage}
                        className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2 active:scale-[0.98] transition"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span className="text-sm tracking-wide">{t.btnCreateAsNewCard}</span>
                      </button>
                    </>
                  ) : (
                    /* Nút mặc định khi chưa có cardId */
                    <button
                      type="button"
                      onClick={() => handleShare()}
                      disabled={isSharing || isSavingImage}
                      className={`w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center space-x-2 active:scale-[0.98] transition ${isSharing ? 'opacity-80 cursor-wait' : ''}`}
                    >
                      {sharingAction === 'default' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-sm tracking-wide">{t.btnSharingText}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm tracking-wide">{t.btnShareText}</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Nút 3: Lưu ảnh về máy */}
                  <button
                    type="button"
                    onClick={handleSaveImage}
                    disabled={isSavingImage || isSharing}
                    className={`w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center space-x-2 active:scale-[0.98] transition ${isSavingImage ? 'opacity-80 cursor-wait' : ''}`}
                  >
                    {isSavingImage ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-rose-500" />
                        <span className="text-sm tracking-wide">{t.btnSavingText}</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5 text-rose-500" />
                        <span className="text-sm tracking-wide">{t.btnSaveImgText}</span>
                      </>
                    )}
                  </button>
                </section>
              </div>
            </div>

            {/* Footer */}
            <footer className="pt-6 pb-6 text-center text-[11px] text-slate-400 space-y-1">
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
