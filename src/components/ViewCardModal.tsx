'use client';

import React, { useState } from 'react';
import { Language } from '../types';
import { I18N } from '../lib/constants';
import { Loader2 } from 'lucide-react';

interface ViewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  imageUrl: string;
  downloadFileName?: string;
  onEdit?: () => void;
  onOpenCreateOwn: () => void;
}

export const ViewCardModal: React.FC<ViewCardModalProps> = ({
  isOpen,
  onClose,
  language,
  imageUrl,
  downloadFileName = 'happy-womens-day-card.png',
  onEdit,
  onOpenCreateOwn,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  if (!isOpen) return null;

  const t = I18N[language];

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Chuyển đổi Data URL sang File để hỗ trợ Web Share API trên iOS/Android
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], downloadFileName, { type: 'image/png' });

      // 2. Trên iOS (iPhone/iPad Chrome & Safari): Dùng Web Share API mở bảng chia sẻ gốc
      // Cho phép người dùng chọn ngay "Lưu hình ảnh" (Save Image) vào Camera Roll Photos
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: language === 'vi' ? 'Thiệp 20/10' : "Women's Day Card",
          });
          setIsProcessing(false);
          return;
        } catch (err: any) {
          if (err.name === 'AbortError') {
            setIsProcessing(false);
            return;
          }
          console.log('Share canceled or failed, using fallback:', err);
        }
      }

      // 3. Kiểm tra nếu là thiết bị iOS nhưng không mở được Share Sheet
      const isIOS = typeof navigator !== 'undefined' && (
        /iPad|iPhone|iPod/.test(navigator.userAgent || '') ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      );

      if (isIOS) {
        // Trên iOS, mở ảnh trực tiếp trong tab mới để người dùng dễ dàng nhấn giữ lưu ảnh
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${downloadFileName}</title>
                <style>
                  body { margin: 0; background: #0b0f19; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 16px; box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; color: #fff; }
                  img { max-width: 100%; max-height: 80vh; object-contain: contain; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                  p { margin-top: 16px; font-size: 14px; opacity: 0.8; text-align: center; }
                </style>
              </head>
              <body>
                <img src="${imageUrl}" alt="Thiệp 20/10">
                <p>📱 Nhấn và giữ vào ảnh để chọn <b>"Lưu vào Ảnh" (Save to Photos)</b></p>
              </body>
            </html>
          `);
        } else {
          window.location.href = imageUrl;
        }
        setIsProcessing(false);
        return;
      }

      // 4. Cho Desktop / Android: Tự động tải file qua thẻ <a> download
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback cuối cùng: mở trực tiếp URL ảnh
      window.open(imageUrl, '_blank');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-sm sm:max-w-md w-full rounded-3xl p-5 shadow-2xl space-y-3 max-h-[92vh] flex flex-col animate-fade-in">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
          <h3 className="font-serif font-bold text-lg text-rose-700">{t.viewModalTitle}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-1 overflow-hidden">
          <img 
            src={imageUrl} 
            className="max-h-[48vh] sm:max-h-[52vh] w-auto max-w-full object-contain rounded-2xl shadow-md border border-slate-200/80 transition-all" 
            alt="Thiệp 20/10" 
          />
          <p className="text-[11px] text-slate-400 mt-2 text-center flex items-center justify-center space-x-1">
            <span>📱</span>
            <span>{language === 'vi' ? 'Chạm giữ vào ảnh để Lưu vào Photos' : 'Long-press image to Save to Photos'}</span>
          </p>
        </div>

        <div className="shrink-0 space-y-2 pt-1">
          <div className={onEdit ? "grid grid-cols-2 gap-2" : "w-full"}>
            <button
              type="button"
              onClick={handleDownloadClick}
              disabled={isProcessing}
              className="bg-rose-600 hover:bg-rose-700 text-white text-center font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-xs w-full active:scale-[0.98]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'vi' ? 'Đang chuẩn bị...' : 'Preparing...'}</span>
                </>
              ) : (
                <>
                  <span>📥</span>
                  <span>{t.btnDownload}</span>
                </>
              )}
            </button>
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 transition shadow-xs w-full active:scale-[0.98]"
              >
                <span>✏️</span>
                <span>{t.btnEditCard}</span>
              </button>
            )}
          </div>
          <button
            onClick={onOpenCreateOwn}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition"
          >
            🌸 {t.btnCreateOwn}
          </button>
        </div>
      </div>
    </div>
  );
};
