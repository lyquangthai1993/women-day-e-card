'use client';

import React from 'react';
import { RelationshipTheme, Language } from '../types';
import { I18N } from '../lib/constants';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationship: RelationshipTheme;
  language: Language;
  currentMessage: string;
  onSelectWish: (wish: string) => void;
}

export const SuggestionsModal: React.FC<SuggestionsModalProps> = ({
  isOpen,
  onClose,
  relationship,
  language,
  currentMessage,
  onSelectWish,
}) => {
  if (!isOpen) return null;

  const t = I18N[language];
  const wishes = language === 'vi' ? relationship.wishesVi : relationship.wishesEn;
  const relName = language === 'vi' 
    ? `${relationship.nameVi} (${relationship.flowerVi})` 
    : `${relationship.nameEn} (${relationship.flowerEn})`;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#06214c] via-[#0b3474] to-[#06214c] text-[#f9b31e] flex items-center justify-center text-base shadow-sm border border-[#d4a843]/30">
              ✨
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-800 leading-tight">
                {t.suggestionsModalTitle}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t.suggestionsModalSubtitle}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Tag Category */}
        <div className="flex items-center justify-between bg-[#06214c]/5 px-3.5 py-2 rounded-2xl border border-[#06214c]/15">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{relationship.icon}</span>
            <span className="text-xs font-bold text-[#06214c]">{relName}</span>
          </div>
          <span className="text-[10px] font-bold bg-white text-[#06214c] border border-[#06214c]/20 px-2.5 py-0.5 rounded-full shadow-2xs">
            {wishes.length} {language === 'vi' ? 'gợi ý' : 'wishes'}
          </span>
        </div>

        {/* List of Suggestions */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
          {wishes.map((wish, idx) => {
            const isCurrent = currentMessage.trim() === wish.trim();
            return (
              <div
                key={idx}
                onClick={() => onSelectWish(wish)}
                className={`p-3.5 rounded-2xl border transition text-left cursor-pointer group ${
                  isCurrent 
                    ? 'bg-[#06214c]/5 border-[#06214c] ring-2 ring-[#06214c]/20 shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-[#06214c]/40 hover:bg-slate-50/60 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between space-x-2">
                  <span className="text-[#d4a843] font-serif text-xl leading-none">“</span>
                  <p className="flex-1 text-xs text-slate-700 leading-relaxed font-sans group-hover:text-slate-900">
                    {wish}
                  </p>
                </div>
                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium">Gợi ý #{idx + 1}</span>
                  <button 
                    type="button" 
                    className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#06214c] group-hover:text-white bg-white group-hover:bg-[#06214c] border border-slate-200 group-hover:border-[#06214c] px-2.5 py-0.5 rounded-full transition shadow-2xs"
                  >
                    <span>{isCurrent ? '✓ Đang dùng' : (language === 'vi' ? 'Chọn câu này ↵' : 'Select ↵')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
          >
            {t.btnCloseSuggestions}
          </button>
        </div>
      </div>
    </div>
  );
};
