'use client';

import React from 'react';
import { Language } from '../types';
import { I18N } from '../lib/constants';

interface ViewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  imageUrl: string;
  onOpenCreateOwn: () => void;
}

export const ViewCardModal: React.FC<ViewCardModalProps> = ({
  isOpen,
  onClose,
  language,
  imageUrl,
  onOpenCreateOwn,
}) => {
  if (!isOpen) return null;

  const t = I18N[language];

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-serif font-bold text-lg text-rose-700">{t.viewModalTitle}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
        </div>
        
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <img src={imageUrl} className="w-full rounded-xl shadow-md border border-slate-200" alt="Thiệp 20/10" />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] text-center text-slate-400">
            {t.longPressHint}
          </p>
          <div className="flex space-x-2">
            <a
              href={imageUrl}
              download="thiep-20-10.png"
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-center font-bold py-2.5 rounded-xl text-xs flex items-center justify-center transition shadow-sm"
            >
              {t.btnDownload}
            </a>
            <button
              onClick={onOpenCreateOwn}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
            >
              {t.btnCreateOwn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
