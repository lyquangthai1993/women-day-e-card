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

export const renderFlowerSvgContent = (relId: string) => {
  switch (relId) {
    case 'mother':
      // Peony (Hoa Mẫu Đơn Hồng)
      return (
        <>
          <path d="M12,85 Q26,52 42,32" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
          <path d="M24,58 C14,48 18,34 32,38 C34,50 28,60 24,58 Z" fill="#86efac" opacity="0.8" />
          <path d="M24,58 Q25,48 29,40" stroke="#22c55e" strokeWidth="0.8" />
          <path d="M36,40 C46,30 42,22 34,26 C30,34 34,40 36,40 Z" fill="#bbf7d0" opacity="0.8" />
          <ellipse cx="46" cy="44" rx="26" ry="24" fill="#fbcfe8" opacity="0.85" />
          <path d="M26,38 C20,24 34,16 48,20 C62,15 72,26 68,40 C73,54 62,68 48,66 C32,68 22,54 26,38 Z" fill="#f9a8d4" opacity="0.9" />
          <path d="M32,36 C30,26 40,22 48,26 C56,22 64,30 60,42 C64,52 54,60 46,58 C34,59 29,48 32,36 Z" fill="#f472b6" />
          <path d="M36,42 C33,34 42,30 48,34 C54,30 60,37 56,46 C58,52 50,56 44,54 C38,55 35,48 36,42 Z" fill="#ec4899" opacity="0.95" />
          <path d="M40,42 C40,36 46,34 50,38 C53,43 49,48 44,48 C41,47 39,44 40,42 Z" fill="#db2777" />
          <circle cx="46" cy="42" r="3.2" fill="#fbbf24" />
          <circle cx="48" cy="40.5" r="1.3" fill="#f59e0b" />
          <circle cx="44" cy="41" r="1.3" fill="#f59e0b" />
          <circle cx="46" cy="43.5" r="1.2" fill="#d97706" />
        </>
      );
    case 'wife':
      // Red Rose (Hoa Hồng Đỏ Thẫm)
      return (
        <>
          <path d="M10,86 Q22,52 38,36" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
          <path d="M22,64 L18,66" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M20,58 C10,48 14,35 28,40 C30,52 24,60 20,58 Z" fill="#15803d" opacity="0.85" />
          <path d="M20,58 Q22,48 26,40" stroke="#166534" strokeWidth="0.8" />
          <path d="M36,36 C45,24 56,26 50,38 C43,43 38,40 36,36 Z" fill="#166534" opacity="0.8" />
          <path d="M24,46 C18,30 34,18 50,20 C66,18 74,34 70,50 C66,66 48,70 34,66 C20,62 18,48 24,46 Z" fill="#991b1b" opacity="0.95" />
          <path d="M28,42 C32,28 46,26 58,30 C66,40 62,56 52,58 C38,60 29,52 28,42 Z" fill="#be123c" />
          <path d="M34,40 C37,32 50,32 54,38 C57,47 48,53 42,51 C35,49 33,43 34,40 Z" fill="#e11d48" />
          <path d="M39,42 C41,36 48,37 50,41 C50,46 45,48 42,46 C39,44 39,42 39,42 Z" fill="#881337" />
          <path d="M42,42 C44,39 48,40 47,43 C46,45 43,45 42,42 Z" fill="#fda4af" opacity="0.9" />
          <circle cx="58" cy="36" r="1.8" fill="#ffffff" opacity="0.7" />
          <circle cx="34" cy="56" r="1.4" fill="#ffffff" opacity="0.6" />
        </>
      );
    case 'sister':
      // Cherry Blossom (Hoa Anh Đào Hồng Phấn)
      return (
        <>
          <path d="M8,90 Q24,58 40,44 Q60,30 88,22" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <path d="M40,44 Q50,60 62,64" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M38,36 C34,24 40,14 46,18 C49,15 54,19 52,26 C50,32 44,38 38,36 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
          <path d="M44,38 C54,33 64,36 63,44 C67,47 64,53 57,51 C50,49 44,43 44,38 Z" fill="#fce7f3" stroke="#f472b6" strokeWidth="0.8" />
          <path d="M42,44 C46,53 49,63 42,66 C38,69 34,65 36,58 C37,52 40,44 42,44 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
          <path d="M37,42 C27,47 18,46 17,39 C15,35 22,31 27,36 C33,40 37,42 37,42 Z" fill="#fce7f3" stroke="#f472b6" strokeWidth="0.8" />
          <path d="M37,38 C31,30 25,24 32,20 C36,18 41,25 39,31 C38,35 37,38 37,38 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
          <circle cx="42" cy="41" r="3" fill="#f43f5e" />
          <line x1="42" y1="41" x2="37" y2="33" stroke="#e11d48" strokeWidth="0.7" /><circle cx="37" cy="33" r="1.1" fill="#f59e0b" />
          <line x1="42" y1="41" x2="48" y2="33" stroke="#e11d48" strokeWidth="0.7" /><circle cx="48" cy="33" r="1.1" fill="#f59e0b" />
          <line x1="42" y1="41" x2="49" y2="47" stroke="#e11d48" strokeWidth="0.7" /><circle cx="49" cy="47" r="1.1" fill="#f59e0b" />
          <line x1="42" y1="41" x2="35" y2="46" stroke="#e11d48" strokeWidth="0.7" /><circle cx="35" cy="46" r="1.1" fill="#f59e0b" />
          <ellipse cx="70" cy="26" rx="4" ry="6.5" fill="#f472b6" transform="rotate(35 70 26)" />
          <path d="M66,30 Q70,24 73,32" fill="#15803d" opacity="0.85" />
          <path d="M60,68 C58,64 64,62 66,66 C65,70 60,71 60,68 Z" fill="#fbcfe8" opacity="0.8" transform="rotate(20 62 67)" />
        </>
      );
    case 'friend':
      // Daisy (Cúc Họa Mi, Nền Vàng Kem)
      return (
        <>
          <path d="M12,88 Q24,55 44,45" stroke="#65a30d" strokeWidth="2" strokeLinecap="round" />
          <path d="M20,68 C12,54 18,44 28,50 C26,62 22,68 20,68 Z" fill="#84cc16" opacity="0.85" />
          <path d="M34,54 C44,46 48,36 38,40 C34,48 34,54 34,54 Z" fill="#a3e635" opacity="0.75" />
          <g fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.6">
            <ellipse cx="45" cy="21" rx="3.8" ry="14" />
            <ellipse cx="45" cy="69" rx="3.8" ry="14" />
            <ellipse cx="21" cy="45" rx="14" ry="3.8" />
            <ellipse cx="69" cy="45" rx="14" ry="3.8" />
            <g transform="rotate(22.5 45 45)"><ellipse cx="45" cy="21" rx="3.8" ry="14" fill="#fefce8" /><ellipse cx="45" cy="69" rx="3.8" ry="14" /></g>
            <g transform="rotate(45 45 45)"><ellipse cx="45" cy="21" rx="3.8" ry="14" /><ellipse cx="45" cy="69" rx="3.8" ry="14" fill="#fefce8" /></g>
            <g transform="rotate(67.5 45 45)"><ellipse cx="45" cy="21" rx="3.8" ry="14" fill="#fefce8" /><ellipse cx="45" cy="69" rx="3.8" ry="14" /></g>
            <g transform="rotate(112.5 45 45)"><ellipse cx="45" cy="21" rx="3.8" ry="14" /><ellipse cx="45" cy="69" rx="3.8" ry="14" fill="#fefce8" /></g>
            <g transform="rotate(135 45 45)"><ellipse cx="45" cy="21" rx="3.8" ry="14" fill="#fefce8" /><ellipse cx="45" cy="69" rx="3.8" ry="14" /></g>
            <g transform="rotate(157.5 45 45)"><ellipse cx="45" cy="21" rx="3.8" ry="14" /><ellipse cx="45" cy="69" rx="3.8" ry="14" fill="#fefce8" /></g>
          </g>
          <circle cx="45" cy="45" r="10" fill="#eab308" />
          <circle cx="45" cy="45" r="8.5" fill="#facc15" />
          <circle cx="45" cy="45" r="4.5" fill="#fef08a" />
          <circle cx="42" cy="43" r="1.3" fill="#ca8a04" />
          <circle cx="47" cy="44" r="1.3" fill="#ca8a04" />
          <circle cx="44" cy="47" r="1.2" fill="#ca8a04" />
          <circle cx="47" cy="48" r="1.1" fill="#ca8a04" />
          <circle cx="42" cy="47" r="1.1" fill="#ca8a04" />
        </>
      );
    case 'colleague':
      // Lilac (Hoa Tím Lilac)
      return (
        <>
          <path d="M10,88 Q26,56 46,36" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M26,62 Q42,54 58,52" stroke="#15803d" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M18,66 C8,54 14,40 26,46 C28,58 24,66 18,66 Z" fill="#86efac" opacity="0.85" />
          <path d="M38,58 C46,48 54,48 50,58 C46,64 40,62 38,58 Z" fill="#4ade80" opacity="0.75" />
          <g transform="translate(38, 38)">
            <circle cx="-5" cy="0" r="4.5" fill="#a855f7" /><circle cx="5" cy="0" r="4.5" fill="#a855f7" /><circle cx="0" cy="-5" r="4.5" fill="#a855f7" /><circle cx="0" cy="5" r="4.5" fill="#a855f7" />
            <circle cx="0" cy="0" r="2.2" fill="#fef08a" />
          </g>
          <g transform="translate(52, 26)">
            <circle cx="-4" cy="0" r="3.8" fill="#c084fc" /><circle cx="4" cy="0" r="3.8" fill="#c084fc" /><circle cx="0" cy="-4" r="3.8" fill="#c084fc" /><circle cx="0" cy="4" r="3.8" fill="#c084fc" />
            <circle cx="0" cy="0" r="1.8" fill="#fef08a" />
          </g>
          <g transform="translate(58, 44)">
            <circle cx="-4" cy="0" r="3.6" fill="#d8b4fe" /><circle cx="4" cy="0" r="3.6" fill="#d8b4fe" /><circle cx="0" cy="-4" r="3.6" fill="#d8b4fe" /><circle cx="0" cy="4" r="3.6" fill="#d8b4fe" />
            <circle cx="0" cy="0" r="1.6" fill="#fef08a" />
          </g>
          <g transform="translate(42, 54)">
            <circle cx="-3.5" cy="0" r="3.2" fill="#c084fc" /><circle cx="3.5" cy="0" r="3.2" fill="#c084fc" /><circle cx="0" cy="-3.5" r="3.2" fill="#c084fc" /><circle cx="0" cy="3.5" r="3.2" fill="#c084fc" />
            <circle cx="0" cy="0" r="1.4" fill="#fef08a" />
          </g>
          <circle cx="66" cy="28" r="2.4" fill="#e9d5ff" />
          <circle cx="60" cy="20" r="2" fill="#c084fc" />
        </>
      );
    case 'lover':
      // Coral Ranunculus (Mao Lương San Hô)
      return (
        <>
          <path d="M12,88 Q24,52 40,36" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
          <path d="M22,64 C12,52 18,40 30,46 C32,58 26,64 22,64 Z" fill="#4ade80" opacity="0.85" />
          <circle cx="46" cy="44" r="26" fill="#fed7aa" opacity="0.85" />
          <circle cx="46" cy="44" r="23" fill="#fda4af" opacity="0.9" />
          <path d="M26,44 C26,33 35,24 46,24 C57,24 66,33 66,44 C66,55 57,64 46,64 C35,64 26,55 26,44 Z" fill="#fb923c" opacity="0.75" />
          <path d="M30,43 C30,35 37,28 46,28 C55,28 62,35 62,43 C62,52 55,59 46,59 C37,59 30,52 30,43 Z" fill="#fb7185" opacity="0.88" />
          <path d="M34,42 C34,36 39,31 46,31 C53,31 58,36 58,42 C58,49 53,54 46,54 C39,54 34,49 34,42 Z" fill="#f43f5e" opacity="0.95" />
          <path d="M38,42 C38,38 41,35 46,35 C51,35 54,38 54,42 C54,46 51,49 46,49 C41,49 38,46 38,42 Z" fill="#e11d48" />
          <circle cx="46" cy="42" r="3.5" fill="#881337" />
          <circle cx="46" cy="42" r="1.6" fill="#fef08a" />
          <circle cx="58" cy="34" r="1.6" fill="#ffffff" opacity="0.75" />
        </>
      );
    case 'memorial':
    default:
      // Pure White Lily (Hoa Trắng Thanh Khiết)
      return (
        <>
          <path d="M12,88 Q26,52 42,40" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <path d="M20,68 C12,52 20,40 30,46 C28,58 24,68 20,68 Z" fill="#94a3b8" opacity="0.65" />
          <path d="M36,54 C46,44 54,42 46,54 C42,60 38,58 36,54 Z" fill="#cbd5e1" opacity="0.75" />
          <path d="M44,44 Q30,22 34,12 Q44,22 44,44" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
          <path d="M44,44 Q62,22 70,20 Q60,32 44,44" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
          <path d="M44,44 Q64,56 72,64 Q54,58 44,44" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
          <path d="M44,44 Q22,40 12,48 Q28,54 44,44" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.9" />
          <path d="M44,44 Q34,68 40,74 Q48,62 44,44" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.9" />
          <path d="M44,44 Q52,32 56,22 Q46,30 44,44" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.9" />
          <path d="M44,44 Q54,44 62,40" stroke="#16a34a" strokeWidth="1.3" fill="none" />
          <circle cx="62" cy="40" r="1.8" fill="#15803d" />
          <line x1="44" y1="44" x2="56" y2="32" stroke="#f59e0b" strokeWidth="1.1" /><ellipse cx="56" cy="32" rx="2.5" ry="1.2" fill="#b45309" transform="rotate(25 56 32)" />
          <line x1="44" y1="44" x2="60" y2="50" stroke="#f59e0b" strokeWidth="1.1" /><ellipse cx="60" cy="50" rx="2.5" ry="1.2" fill="#b45309" transform="rotate(-30 60 50)" />
          <line x1="44" y1="44" x2="49" y2="54" stroke="#f59e0b" strokeWidth="1.1" /><ellipse cx="49" cy="54" rx="2.2" ry="1.2" fill="#b45309" transform="rotate(45 49 54)" />
        </>
      );
  }
};

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
      className={`relative w-full aspect-[4/5] min-h-[480px] rounded-2xl shadow-xl overflow-hidden p-6 flex flex-col justify-between transition-colors duration-500 card-border-gold ${relationship.bgClass}`}
    >
      {/* 4 Corner Botanical Ornaments */}
      <svg className="corner-decor top-2 left-2" viewBox="0 0 100 100" fill="none">
        <g>{renderFlowerSvgContent(relationship.id)}</g>
      </svg>

      <svg className="corner-decor top-2 right-2" viewBox="0 0 100 100" fill="none">
        <g transform="translate(100, 0) scale(-1, 1)">
          {renderFlowerSvgContent(relationship.id)}
        </g>
      </svg>

      <svg className="corner-decor bottom-2 left-2" viewBox="0 0 100 100" fill="none">
        <g transform="translate(0, 100) scale(1, -1)">
          {renderFlowerSvgContent(relationship.id)}
        </g>
      </svg>

      <svg className="corner-decor bottom-2 right-2" viewBox="0 0 100 100" fill="none">
        <g transform="translate(100, 100) scale(-1, -1)">
          {renderFlowerSvgContent(relationship.id)}
        </g>
      </svg>

      {/* Salutation & Recipient */}
      <div className="relative z-10 text-center pt-2">
        <p className="font-script text-2xl sm:text-3xl text-rose-700/80 mb-1 tracking-wide leading-normal">{defaultSalutation}</p>
        <h2 className={`font-serif font-bold text-2xl sm:text-3xl tracking-wide px-4 break-words leading-normal pb-1 ${relationship.titleColor}`}>
          {displayReceiver}
        </h2>
        <div className="w-12 h-[1.5px] bg-amber-400/70 mx-auto mt-2 mb-1"></div>
      </div>

      {/* Heartfelt Message */}
      <div className="relative z-10 px-5 py-3 my-auto text-center flex items-center justify-center flex-1">
        <p className={`font-serif text-base sm:text-lg leading-relaxed italic break-words line-clamp-6 select-none ${relationship.bodyColor}`}>
          {displayMessage}
        </p>
      </div>

      {/* Sender & Event Date */}
      <div className="relative z-10 text-center pt-2 pb-2">
        <div className="w-12 h-[1.5px] bg-amber-400/70 mx-auto mb-3"></div>
        <p className={`text-xs uppercase tracking-widest font-sans font-semibold mb-3 ${relationship.senderColor}`}>
          {displaySender}
        </p>
        <div className="inline-flex items-center justify-center space-x-2 px-4 py-1 rounded-full bg-white/90 border border-amber-300/80 shadow-xs">
          <span className="text-[10px] text-amber-600">✦</span>
          <span className="font-serif font-bold text-xs tracking-widest text-amber-950 uppercase">
            20 · 10 · 2026
          </span>
          <span className="text-[10px] text-amber-600">✦</span>
        </div>
      </div>
    </div>
  );
};
