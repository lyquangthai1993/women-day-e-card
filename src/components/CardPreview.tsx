'use client';

import React from 'react';
import { RelationshipTheme, Language } from '../types';

interface CardPreviewProps {
  relationship: RelationshipTheme;
  receiver: string;
  sender: string;
  message: string;
  language: Language;
  cardRef?: React.RefObject<HTMLDivElement>;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  relationship,
  receiver,
  sender,
  message,
  language,
  cardRef,
}) => {
  const defaultReceiver = language === 'vi' ? relationship.defaultReceiverVi : relationship.defaultReceiverEn;
  const defaultSalutation = language === 'vi' ? relationship.defaultSalutationVi : relationship.defaultSalutationEn;
  const defaultMessage = language === 'vi' ? relationship.wishesVi[0] : relationship.wishesEn[0];
  const defaultSender = language === 'vi' ? "Từ: Một người thầm trân quý" : "From: Someone who cherishes you";

  const displayReceiver = receiver.trim() || defaultReceiver;
  const displayMessage = message.trim() ? `"${message.trim()}"` : `"${defaultMessage}"`;
  const displaySender = sender.trim() ? (language === 'vi' ? `Từ: ${sender.trim()}` : `From: ${sender.trim()}`) : defaultSender;

  return (
    <div
      ref={cardRef}
      id="cardCaptureArea"
      style={{ backgroundColor: relationship.bgColor }}
      className={`relative w-full aspect-[4/5] rounded-2xl shadow-xl overflow-hidden p-6 flex flex-col justify-between transition-colors duration-500 card-border-gold ${relationship.bgClass}`}
    >
      {/* 4 Corner Botanical Ornaments */}
      <svg className="corner-decor top-2 left-2" viewBox="0 0 100 100" fill="none">
        <path d="M10,80 Q20,30 80,10 M20,60 Q35,35 60,20 M15,40 Q40,40 40,15" stroke={relationship.strokeColor} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="20" cy="30" r="10" fill={relationship.petalColor} opacity="0.6"/>
        <circle cx="35" cy="18" r="8" fill={relationship.petalColor} opacity="0.5"/>
        <circle cx="45" cy="35" r="9" fill={relationship.petalColor} opacity="0.7"/>
        <circle cx="30" cy="25" r="5" fill="#fef08a" opacity="0.9"/>
      </svg>

      <svg className="corner-decor top-2 right-2 transform scale-x-[-1]" viewBox="0 0 100 100" fill="none">
        <path d="M10,80 Q20,30 80,10 M20,60 Q35,35 60,20 M15,40 Q40,40 40,15" stroke={relationship.strokeColor} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="20" cy="30" r="10" fill={relationship.petalColor} opacity="0.6"/>
        <circle cx="35" cy="18" r="8" fill={relationship.petalColor} opacity="0.5"/>
        <circle cx="45" cy="35" r="9" fill={relationship.petalColor} opacity="0.7"/>
        <circle cx="30" cy="25" r="5" fill="#fef08a" opacity="0.9"/>
      </svg>

      <svg className="corner-decor bottom-2 left-2 transform scale-y-[-1]" viewBox="0 0 100 100" fill="none">
        <path d="M10,80 Q20,30 80,10 M20,60 Q35,35 60,20 M15,40 Q40,40 40,15" stroke={relationship.strokeColor} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="20" cy="30" r="10" fill={relationship.petalColor} opacity="0.6"/>
        <circle cx="35" cy="18" r="8" fill={relationship.petalColor} opacity="0.5"/>
        <circle cx="45" cy="35" r="9" fill={relationship.petalColor} opacity="0.7"/>
        <circle cx="30" cy="25" r="5" fill="#fef08a" opacity="0.9"/>
      </svg>

      <svg className="corner-decor bottom-2 right-2 transform scale-[-1]" viewBox="0 0 100 100" fill="none">
        <path d="M10,80 Q20,30 80,10 M20,60 Q35,35 60,20 M15,40 Q40,40 40,15" stroke={relationship.strokeColor} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="20" cy="30" r="10" fill={relationship.petalColor} opacity="0.6"/>
        <circle cx="35" cy="18" r="8" fill={relationship.petalColor} opacity="0.5"/>
        <circle cx="45" cy="35" r="9" fill={relationship.petalColor} opacity="0.7"/>
        <circle cx="30" cy="25" r="5" fill="#fef08a" opacity="0.9"/>
      </svg>

      {/* Salutation & Recipient */}
      <div className="relative z-10 text-center pt-3">
        <p className="font-script text-2xl text-rose-700/80 mb-0.5 tracking-wide">{defaultSalutation}</p>
        <h2 className={`font-serif font-bold text-2xl tracking-wide px-4 break-words leading-tight ${relationship.titleColor}`}>
          {displayReceiver}
        </h2>
        <div className="w-12 h-[1px] bg-amber-400/60 mx-auto mt-2.5"></div>
      </div>

      {/* Heartfelt Message */}
      <div className="relative z-10 px-4 py-3 my-auto text-center flex items-center justify-center">
        <p className={`font-serif text-lg leading-relaxed italic break-words line-clamp-6 ${relationship.bodyColor}`}>
          {displayMessage}
        </p>
      </div>

      {/* Sender & Event Date */}
      <div className="relative z-10 text-center pb-2">
        <div className="w-12 h-[1px] bg-amber-400/60 mx-auto mb-2"></div>
        <p className={`text-xs uppercase tracking-widest font-sans font-semibold ${relationship.senderColor}`}>
          {displaySender}
        </p>
        <p className="font-serif text-sm tracking-[0.25em] text-slate-400 mt-1">
          20 · 10 · 2026
        </p>
      </div>
    </div>
  );
};
