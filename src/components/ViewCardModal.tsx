'use client';

import React from 'react';
import { Language } from '../types';
import { I18N } from '../lib/constants';

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
  if (!isOpen) return null;

  const t = I18N[language];

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-sm sm:max-w-md w-full rounded-3xl p-5 shadow-2xl space-y-3.5 max-h-[92vh] flex flex-col animate-fade-in">
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
        
        <div className="flex-1 min-h-0 flex items-center justify-center py-1 overflow-hidden">
          <img 
            src={imageUrl} 
            className="max-h-[50vh] sm:max-h-[55vh] w-auto max-w-full object-contain rounded-2xl shadow-md border border-slate-200/80 transition-all" 
            alt="Thiệp 20/10" 
          />
        </div>

        <div className="shrink-0 space-y-2 pt-1">
          <p className="text-[11px] text-center text-slate-400">
            {t.longPressHint}
          </p>
          <div className={onEdit ? "grid grid-cols-2 gap-2" : "w-full"}>
            <a
              href={imageUrl}
              download={downloadFileName}
              className="bg-rose-600 hover:bg-rose-700 text-white text-center font-bold py-2.5 rounded-xl text-xs flex items-center justify-center transition shadow-xs w-full"
            >
              {t.btnDownload}
            </a>
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 transition shadow-xs w-full"
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
