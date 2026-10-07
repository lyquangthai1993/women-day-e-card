'use client';

import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { I18N } from '../lib/constants';

interface IceCreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  visitorId: string;
  isClaimed: boolean;
  onClaim: () => void;
}

export const IceCreamModal: React.FC<IceCreamModalProps> = ({
  isOpen,
  onClose,
  language,
  visitorId,
  isClaimed,
  onClaim,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleTimeString('vi-VN'));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const t = I18N[language];
  const ticketCodeSuffix = visitorId.slice(-4).toUpperCase();
  const ticketCode = `#ICE-2010-${ticketCodeSuffix}`;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl text-center space-y-5 animate-scale-up relative overflow-hidden">
        
        {/* Ice cream celebration icon */}
        <div className="w-16 h-16 bg-[#06214c]/10 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-pulse-slow">
          🍦
        </div>

        <div>
          <span className="inline-block bg-[#06214c]/10 text-[#06214c] text-[11px] font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider border border-[#06214c]/20">
            {t.modalTag}
          </span>
          <h3 className="font-serif font-bold text-2xl text-slate-800">
            {t.modalTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {t.modalDesc}
          </p>
        </div>

        {/* Digital Ice Cream Pass */}
        <div className="bg-gradient-to-br from-amber-50/60 via-slate-50 to-blue-50/40 border-2 border-dashed border-[#06214c]/30 rounded-2xl p-4 text-left space-y-2 relative">
          <div className="flex justify-between items-center border-b border-[#06214c]/15 pb-2">
            <span className="text-[10px] font-bold text-[#06214c] uppercase tracking-widest">ICE CREAM PASS</span>
            <span className="text-[10px] font-mono font-bold text-slate-500">{currentTime}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-[10px] text-slate-400">Mã nhận kem</div>
              <div className="font-mono font-bold text-xl text-[#06214c] tracking-wider">{ticketCode}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400">Trạng thái</div>
              <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isClaimed ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {isClaimed ? '✓ ĐÃ NHẬN KEM' : '● SẴN SÀNG'}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono truncate pt-1 border-t border-[#06214c]/15">
            Device: <span>{visitorId.substring(0, 12)}</span>
          </div>
        </div>

        {/* Action button */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onClaim}
            disabled={isClaimed}
            className={`w-full font-bold py-3 px-4 rounded-xl text-xs tracking-wide transition shadow-sm ${
              isClaimed 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
            }`}
          >
            {isClaimed ? t.btnClaimed : t.btnClaim}
          </button>
          <button
            onClick={onClose}
            className="w-full text-slate-400 hover:text-slate-600 text-xs py-1.5 transition"
          >
            {t.btnClose}
          </button>
        </div>
      </div>
    </div>
  );
};
