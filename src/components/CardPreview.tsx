'use client';

import React from 'react';
import { RelationshipTheme, Language } from '../types';
import { isDefaultReceiver, isAnonymousSender } from '../lib/constants';

interface CardPreviewProps {
  relationship: RelationshipTheme;
  receiver: string;
  sender: string;
  message: string;
  language: Language;
  cardRef?: React.RefObject<HTMLDivElement>;
}

export type FlowerType =
  | 'peony'       // Mẹ: mẫu đơn vương giả
  | 'rose'        // Vợ: hồng nhung hoàng gia
  | 'sakura'      // Chị / Em gái: anh đào sân trường Wimbledon
  | 'daisy'       // Bạn thân: cúc họa mi ánh kim
  | 'lilac'       // Đồng nghiệp: hoa tím lilac học thuật
  | 'ranunculus'  // Người yêu: mao lương san hô & lụa hoàng gia
  | 'white-lily'  // Người tôi muốn nhớ về: hoa bách hợp trắng thanh khiết
  | 'lisianthus'; // Khác: cát tường vinh hoa hoàng gia

export interface CardThemeConfig {
  flowerType: FlowerType;
  cardBg: string;
  frameColor: string;
  innerFrameColor?: string;
  cornerStyle: string;
  flowerLayers: [string, string, string, string];
  flowerLayersLight?: [string, string, string, string];
  accentColor: string;
  pistilColor: string;
  leafColor: string;
  brandTagColor: string;
  stampBadgeVi: string;
  stampBadgeEn: string;
  salutationColor: string;
  bodyColor: string;
  dividerColor: string;
  senderColor: string;
  dateColor: string;
}

export const CARD_THEMES: Record<string, CardThemeConfig> = {
  mother: {
    // 1. MẸ: Mẫu đơn vương giả (Royal Peony & Gold Filigree)
    flowerType: 'peony',
    cardBg: '#faf9f6',
    frameColor: '#d4a843',
    innerFrameColor: '#06214c',
    cornerStyle: 'peony-filigree',
    flowerLayers: ['#06214c', '#1b3a6b', '#f9d2de', '#fdf3dc'],
    flowerLayersLight: ['#1b3a6b', '#f9d2de', '#fdf3dc', '#ffffff'],
    accentColor: '#d4a843',
    pistilColor: '#f9b31e',
    leafColor: '#4a6750',
    brandTagColor: '#06214c',
    stampBadgeVi: 'MẪU TỬ TRI ÂN · DÀNH TẶNG MẸ KÍNH YÊU',
    stampBadgeEn: 'LOVE & GRATITUDE · DEAREST MOTHER',
    salutationColor: '#06214c',
    bodyColor: '#1b2a47',
    dividerColor: '#d4a843',
    senderColor: '#06214c',
    dateColor: '#06214c',
  },
  wife: {
    // 2. VỢ: Hoa hồng nhung hoàng gia (King\'s Velvet Rose & Crown)
    flowerType: 'rose',
    cardBg: '#faf6f7',
    frameColor: '#d4a843',
    innerFrameColor: '#881337',
    cornerStyle: 'royal-crown',
    flowerLayers: ['#06214c', '#881337', '#be123c', '#fecdd3'],
    flowerLayersLight: ['#881337', '#be123c', '#fecdd3', '#ffffff'],
    accentColor: '#be123c',
    pistilColor: '#facc15',
    leafColor: '#2d503b',
    brandTagColor: '#06214c',
    stampBadgeVi: 'TRỌN VẸN YÊU THƯƠNG · GỬI VỢ YÊU',
    stampBadgeEn: 'FOREVER YOURS · DEAREST WIFE',
    salutationColor: '#7f1d3a',
    bodyColor: '#0f2240',
    dividerColor: '#d4a843',
    senderColor: '#06214c',
    dateColor: '#881337',
  },
  sister: {
    // 3. CHỊ / EM GÁI: Anh đào Wimbledon (Wimbledon Cherry Blossom)
    flowerType: 'sakura',
    cardBg: '#f4f8fb',
    frameColor: '#d4a843',
    innerFrameColor: '#3b6998',
    cornerStyle: 'wimbledon-branch',
    flowerLayers: ['#234b82', '#4b77ad', '#f9a8d4', '#fdf2f8'],
    flowerLayersLight: ['#4b77ad', '#f9a8d4', '#fdf2f8', '#ffffff'],
    accentColor: '#d4a843',
    pistilColor: '#f59e0b',
    leafColor: '#6b9474',
    brandTagColor: '#06214c',
    stampBadgeVi: 'RẠNG RỠ TỎA SÁNG · CHỊ EM THÂN THƯƠNG',
    stampBadgeEn: 'SWEET & SHINING · DEAREST SISTER',
    salutationColor: '#0d3674',
    bodyColor: '#1e293b',
    dividerColor: '#d4a843',
    senderColor: '#06214c',
    dateColor: '#234b82',
  },
  friend: {
    // 4. BẠN THÂN: Cúc họa mi ánh kim (Sunlit Daisy of Companionship)
    flowerType: 'daisy',
    cardBg: '#fcfaf2',
    frameColor: '#d4a843',
    innerFrameColor: '#f9b31e',
    cornerStyle: 'octagram-star',
    flowerLayers: ['#06214c', '#f1f5f9', '#ffffff', '#ffffff'],
    flowerLayersLight: ['#1e3a68', '#f8fafc', '#ffffff', '#ffffff'],
    accentColor: '#f9b31e',
    pistilColor: '#d4a843',
    leafColor: '#5b7e52',
    brandTagColor: '#06214c',
    stampBadgeVi: 'TRI KỶ BỀN LÂU · TÌNH BẠN DIỆU KỲ',
    stampBadgeEn: 'BESTIE FOREVER · CHERISHED FRIENDSHIP',
    salutationColor: '#78350f',
    bodyColor: '#0a1f44',
    dividerColor: '#d4a843',
    senderColor: '#06214c',
    dateColor: '#b45309',
  },
  colleague: {
    // 5. ĐỒNG NGHIỆP: Lilac tri thức & học thuật (Academic Lilac & Crest)
    flowerType: 'lilac',
    cardBg: '#f3f6fa',
    frameColor: '#d4a843',
    innerFrameColor: '#06214c',
    cornerStyle: 'academic-deco',
    flowerLayers: ['#06214c', '#581c87', '#7c3aed', '#c4b5fd'],
    flowerLayersLight: ['#581c87', '#7c3aed', '#c4b5fd', '#ede9fe'],
    accentColor: '#7c3aed',
    pistilColor: '#f9b31e',
    leafColor: '#5e7568',
    brandTagColor: '#06214c',
    stampBadgeVi: 'TRÂN TRỌNG HỢP TÁC · ĐỒNG NGHIỆP TUYỆT VỜI',
    stampBadgeEn: 'VALUED COLLEAGUE · INSPIRING PARTNERSHIP',
    salutationColor: '#1e1b4b',
    bodyColor: '#1e293b',
    dividerColor: '#d4a843',
    senderColor: '#06214c',
    dateColor: '#581c87',
  },
  lover: {
    // 6. NGƯỜI YÊU: Mao lương san hô & lụa hoàng gia (Coral Ranunculus & Royal Silk)
    flowerType: 'ranunculus',
    cardBg: '#faf5f2',
    frameColor: '#d4a843',
    innerFrameColor: '#ea580c',
    cornerStyle: 'romantic-ribbon',
    flowerLayers: ['#06214c', '#ea580c', '#fb923c', '#fed7aa'],
    flowerLayersLight: ['#ea580c', '#fb923c', '#fed7aa', '#fff1e6'],
    accentColor: '#ea580c',
    pistilColor: '#d97706',
    leafColor: '#60856d',
    brandTagColor: '#06214c',
    stampBadgeVi: 'TRÁI TIM CHO EM · NGỌT NGÀO YÊU THƯƠNG',
    stampBadgeEn: 'MY SWEETHEART · WITH ALL MY HEART',
    salutationColor: '#7c2d12',
    bodyColor: '#0d2347',
    dividerColor: '#d4a843',
    senderColor: '#06214c',
    dateColor: '#ea580c',
  },
  memorial: {
    // 7. NGƯỜI TÔI MUỐN NHỚ VỀ: Bách hợp trắng thanh khiết (Sovereign White Lily)
    flowerType: 'white-lily',
    cardBg: '#f0f4f8',
    frameColor: '#94a3b8',
    innerFrameColor: '#06214c',
    cornerStyle: 'laurel-peace',
    flowerLayers: ['#06214c', '#64748b', '#cbd5e1', '#ffffff'],
    flowerLayersLight: ['#64748b', '#cbd5e1', '#ffffff', '#ffffff'],
    accentColor: '#94a3b8',
    pistilColor: '#d97706',
    leafColor: '#64748b',
    brandTagColor: '#06214c',
    stampBadgeVi: 'SỐNG MÃI TRONG TIM · NỖI NHỚ KHÔN NGUÔI',
    stampBadgeEn: 'FOREVER IN MEMORY · SACRED PEACE',
    salutationColor: '#0f172a',
    bodyColor: '#334155',
    dividerColor: '#94a3b8',
    senderColor: '#06214c',
    dateColor: '#64748b',
  },
  other: {
    // 8. KHÁC: Cát tường vinh hoa hoàng gia (The King\'s Crest Lisianthus)
    flowerType: 'lisianthus',
    cardBg: '#faf9f6',
    frameColor: '#d4a843',
    innerFrameColor: '#06214c',
    cornerStyle: 'kings-crest',
    flowerLayers: ['#06214c', '#d97706', '#f59e0b', '#fef08a'],
    flowerLayersLight: ['#d97706', '#f59e0b', '#fef08a', '#ffffff'],
    accentColor: '#d4a843',
    pistilColor: '#78350f',
    leafColor: '#4d6b53',
    brandTagColor: '#06214c',
    stampBadgeVi: 'TÔN VINH PHÁI ĐẸP · RẠNG NGỜI & HẠNH PHÚC',
    stampBadgeEn: 'CELEBRATING WOMEN · RADIANT & CHERISHED',
    salutationColor: '#06214c',
    bodyColor: '#1c283d',
    dividerColor: '#d4a843',
    senderColor: '#06214c',
    dateColor: '#d4a843',
  },
};

// 1. HOA MẪU ĐƠN VƯƠNG GIẢ (Mẹ)
const PeonyBloom: React.FC<{ layers: [string, string, string, string]; pistilColor: string }> = ({
  layers,
  pistilColor,
}) => (
  <g className="peony-bloom">
    <g fill={layers[0]} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="32" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <circle
            key={`p1-${i}`}
            cx={Number((26 * Math.cos(a)).toFixed(2))}
            cy={Number((26 * Math.sin(a)).toFixed(2))}
            r="16"
          />
        );
      })}
    </g>
    <g fill={layers[1]} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="22" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = ((i * 36 + 18) * Math.PI) / 180;
        return (
          <circle
            key={`p2-${i}`}
            cx={Number((18 * Math.cos(a)).toFixed(2))}
            cy={Number((18 * Math.sin(a)).toFixed(2))}
            r="13"
          />
        );
      })}
    </g>
    <g fill={layers[2]} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="14" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return (
          <circle
            key={`p3-${i}`}
            cx={Number((11 * Math.cos(a)).toFixed(2))}
            cy={Number((11 * Math.sin(a)).toFixed(2))}
            r="9"
          />
        );
      })}
    </g>
    <g fill={layers[3]} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="8" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = ((i * 60 + 30) * Math.PI) / 180;
        return (
          <circle
            key={`p4-${i}`}
            cx={Number((5 * Math.cos(a)).toFixed(2))}
            cy={Number((5 * Math.sin(a)).toFixed(2))}
            r="6"
          />
        );
      })}
    </g>
    <circle cx="0" cy="0" r="7.5" fill={pistilColor} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
    <circle cx="0" cy="0" r="4.5" fill="#fef08a" opacity="0.75" />
  </g>
);

// 2. HOA HỒNG NHUNG HOÀNG GIA (Vợ)
const RoseBloom: React.FC<{ layers: [string, string, string, string]; pistilColor: string }> = ({
  layers,
  pistilColor,
}) => (
  <g className="rose-bloom">
    <g fill={layers[0]} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="30" />
      <ellipse cx="-12" cy="-14" rx="20" ry="15" transform="rotate(-15 -12 -14)" />
      <ellipse cx="14" cy="-12" rx="19" ry="16" transform="rotate(25 14 -12)" />
      <ellipse cx="16" cy="12" rx="20" ry="15" transform="rotate(75 16 12)" />
      <ellipse cx="-6" cy="18" rx="21" ry="14" transform="rotate(-20 -6 18)" />
      <ellipse cx="-18" cy="2" rx="19" ry="15" transform="rotate(45 -18 2)" />
    </g>
    <g fill={layers[1]} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5">
      <ellipse cx="-8" cy="-6" rx="15" ry="11" transform="rotate(10 -8 -6)" />
      <ellipse cx="8" cy="-5" rx="14" ry="12" transform="rotate(-25 8 -5)" />
      <ellipse cx="9" cy="8" rx="14" ry="11" transform="rotate(35 9 8)" />
      <ellipse cx="-5" cy="10" rx="15" ry="10" transform="rotate(-15 -5 10)" />
    </g>
    <g fill={layers[2]} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5">
      <ellipse cx="-3" cy="-3" rx="10" ry="8" transform="rotate(-30 -3 -3)" />
      <ellipse cx="4" cy="-2" rx="9" ry="8" transform="rotate(30 4 -2)" />
      <ellipse cx="2" cy="4" rx="9" ry="7" transform="rotate(60 2 4)" />
      <ellipse cx="-3" cy="3" rx="8" ry="7" transform="rotate(-40 -3 3)" />
    </g>
    <g fill={layers[3]}>
      <circle cx="0" cy="0" r="5" />
      <ellipse cx="0.5" cy="-0.5" rx="3.5" ry="2.5" transform="rotate(45 0.5 -0.5)" />
    </g>
    <circle cx="0" cy="0" r="2.5" fill={pistilColor} />
  </g>
);

// 3. ANH ĐÀO WIMBLEDON (Chị / Em gái)
const SakuraBloom: React.FC<{ layers: [string, string, string, string]; pistilColor: string }> = ({
  layers,
  pistilColor,
}) => (
  <g className="sakura-bloom">
    <g fill={layers[0]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.4">
      {Array.from({ length: 5 }).map((_, i) => (
        <path
          key={`sakura-out-${i}`}
          d="M 0,0 C -12,-18 -16,-34 -6,-39 C -1,-36 -0.5,-36 0,-34 C 0.5,-36 1,-36 6,-39 C 16,-34 12,-18 0,0 Z"
          transform={`rotate(${i * 72})`}
        />
      ))}
    </g>
    <g fill={layers[1]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.4">
      {Array.from({ length: 5 }).map((_, i) => (
        <path
          key={`sakura-mid-${i}`}
          d="M 0,0 C -8,-12 -12,-24 -4,-28 C 0,-25 0,-25 0,-24 C 0,-25 0,-25 4,-28 C 12,-24 8,-12 0,0 Z"
          transform={`rotate(${i * 72 + 36})`}
        />
      ))}
    </g>
    <circle cx="0" cy="0" r="8" fill={layers[2]} />
    {Array.from({ length: 10 }).map((_, i) => {
      const a = (i * 36 * Math.PI) / 180;
      const x = Number((11 * Math.cos(a)).toFixed(2));
      const y = Number((11 * Math.sin(a)).toFixed(2));
      return (
        <g key={`sakura-stamen-${i}`}>
          <line x1="0" y1="0" x2={x} y2={y} stroke={pistilColor} strokeWidth="0.8" opacity="0.8" />
          <circle cx={x} cy={y} r="1.3" fill={pistilColor} />
        </g>
      );
    })}
    <circle cx="0" cy="0" r="4.5" fill={layers[3]} />
  </g>
);

// 4. CÚC HỌA MI ÁNH KIM (Bạn thân)
const DaisyBloom: React.FC<{ isLight?: boolean }> = ({ isLight }) => (
  <g className="daisy-bloom">
    <g fill="#06214c" opacity="0.12">
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse key={`d-bg-${i}`} cx="0" cy="27" rx="6" ry="17" transform={`rotate(${i * 22.5})`} />
      ))}
    </g>
    <g fill={isLight ? '#ffffff' : '#f8fafc'} stroke="rgba(0,0,0,0.06)" strokeWidth="0.4">
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse key={`d-out-${i}`} cx="0" cy="25" rx="5" ry="16" transform={`rotate(${i * 22.5})`} />
      ))}
    </g>
    <g fill="#ffffff" stroke="rgba(0,0,0,0.05)" strokeWidth="0.4">
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse key={`d-in-${i}`} cx="0" cy="20" rx="4.2" ry="13" transform={`rotate(${i * 22.5 + 11.25})`} />
      ))}
    </g>
    <circle cx="0" cy="0" r="14" fill="#d4a843" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
    <circle cx="0" cy="0" r="11" fill="#f9b31e" />
    <circle cx="0" cy="0" r="7" fill="#fef08a" opacity="0.75" />
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      return (
        <circle
          key={`d-dot-${i}`}
          cx={Number((5.5 * Math.cos(angle)).toFixed(2))}
          cy={Number((5.5 * Math.sin(angle)).toFixed(2))}
          r="1.2"
          fill="#92400e"
        />
      );
    })}
  </g>
);

// 5. LILAC TRI THỨC & HỌC THUẬT (Đồng nghiệp)
const LilacBloom: React.FC<{ layers: [string, string, string, string]; pistilColor: string }> = ({
  layers,
  pistilColor,
}) => (
  <g className="lilac-bloom">
    {[
      { x: 0, y: 0, s: 1 },
      { x: -16, y: -12, s: 0.8 },
      { x: 16, y: -12, s: 0.8 },
      { x: -20, y: 12, s: 0.75 },
      { x: 20, y: 12, s: 0.75 },
      { x: 0, y: 22, s: 0.82 },
      { x: 0, y: -24, s: 0.72 },
    ].map((f, fi) => (
      <g key={`lilac-f-${fi}`} transform={`translate(${f.x}, ${f.y}) scale(${f.s})`}>
        <g fill={fi % 2 === 0 ? layers[0] : layers[1]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.4">
          <ellipse cx="0" cy="-9" rx="5" ry="8" />
          <ellipse cx="9" cy="0" rx="8" ry="5" />
          <ellipse cx="0" cy="9" rx="5" ry="8" />
          <ellipse cx="-9" cy="0" rx="8" ry="5" />
        </g>
        <g fill={layers[2]}>
          <circle cx="0" cy="-4" r="3.5" />
          <circle cx="4" cy="0" r="3.5" />
          <circle cx="0" cy="4" r="3.5" />
          <circle cx="-4" cy="0" r="3.5" />
        </g>
        <circle cx="0" cy="0" r="2.5" fill={pistilColor} />
      </g>
    ))}
  </g>
);

// 6. MAO LƯƠNG SAN HÔ & LỤA HOÀNG GIA (Người yêu)
const RanunculusBloom: React.FC<{ layers: [string, string, string, string]; pistilColor: string }> = ({
  layers,
  pistilColor,
}) => (
  <g className="ranunculus-bloom">
    <g fill={layers[0]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="32" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <circle
            key={`r1-${i}`}
            cx={Number((30 * Math.cos(a)).toFixed(2))}
            cy={Number((30 * Math.sin(a)).toFixed(2))}
            r="16"
          />
        );
      })}
    </g>
    <g fill={layers[1]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="24" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = ((i * 30 + 15) * Math.PI) / 180;
        return (
          <circle
            key={`r2-${i}`}
            cx={Number((23 * Math.cos(a)).toFixed(2))}
            cy={Number((23 * Math.sin(a)).toFixed(2))}
            r="13"
          />
        );
      })}
    </g>
    <g fill={layers[2]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="16" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i * 36 * Math.PI) / 180;
        return (
          <circle
            key={`r3-${i}`}
            cx={Number((15 * Math.cos(a)).toFixed(2))}
            cy={Number((15 * Math.sin(a)).toFixed(2))}
            r="10"
          />
        );
      })}
    </g>
    <g fill={layers[3]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="8" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = ((i * 45 + 22.5) * Math.PI) / 180;
        return (
          <circle
            key={`r4-${i}`}
            cx={Number((8 * Math.cos(a)).toFixed(2))}
            cy={Number((8 * Math.sin(a)).toFixed(2))}
            r="7"
          />
        );
      })}
    </g>
    <circle cx="0" cy="0" r="6" fill={pistilColor} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
  </g>
);

// 7. BÁCH HỢP TRẮNG THANH KHIẾT (Người tôi muốn nhớ về)
const LilyBloom: React.FC<{ layers: [string, string, string, string]; pistilColor: string }> = ({
  layers,
  pistilColor,
}) => (
  <g className="lily-bloom">
    <g fill={layers[0]} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={`lily-out-${i}`}
          d="M 0,0 C -9,-15 -14,-32 0,-44 C 14,-32 9,-15 0,0 Z"
          transform={`rotate(${i * 60})`}
        />
      ))}
    </g>
    <g fill={layers[1]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.4">
      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={`lily-in-${i}`}
          d="M 0,0 C -6,-12 -10,-24 0,-34 C 10,-24 6,-12 0,0 Z"
          transform={`rotate(${i * 60 + 30})`}
        />
      ))}
    </g>
    <circle cx="0" cy="0" r="8" fill={layers[2]} />
    {Array.from({ length: 6 }).map((_, i) => {
      const a = ((i * 60 + 15) * Math.PI) / 180;
      const x = Number((18 * Math.cos(a)).toFixed(2));
      const y = Number((18 * Math.sin(a)).toFixed(2));
      return (
        <g key={`lily-stamen-${i}`}>
          <line x1="0" y1="0" x2={x} y2={y} stroke="#94a3b8" strokeWidth="0.9" />
          <ellipse cx={x} cy={y} rx="2.5" ry="1.2" transform={`rotate(${i * 60} ${x} ${y})`} fill={pistilColor} />
        </g>
      );
    })}
    <circle cx="0" cy="0" r="4.5" fill={layers[3]} />
  </g>
);

// 8. CÁT TƯỜNG VINH HOA HOÀNG GIA (Khác)
const LisianthusBloom: React.FC<{ layers: [string, string, string, string]; pistilColor: string }> = ({
  layers,
  pistilColor,
}) => (
  <g className="lisianthus-bloom">
    <g fill={layers[0]} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="32" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return (
          <ellipse
            key={`lis-out-${i}`}
            cx={Number((22 * Math.cos(a)).toFixed(2))}
            cy={Number((22 * Math.sin(a)).toFixed(2))}
            rx="17"
            ry="14"
            transform={`rotate(${i * 45})`}
          />
        );
      })}
    </g>
    <g fill={layers[1]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="22" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = ((i * 45 + 22.5) * Math.PI) / 180;
        return (
          <ellipse
            key={`lis-mid-${i}`}
            cx={Number((15 * Math.cos(a)).toFixed(2))}
            cy={Number((15 * Math.sin(a)).toFixed(2))}
            rx="13"
            ry="11"
            transform={`rotate(${i * 45 + 22.5})`}
          />
        );
      })}
    </g>
    <g fill={layers[2]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="14" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * 60 * Math.PI) / 180;
        return (
          <circle
            key={`lis-in-${i}`}
            cx={Number((8 * Math.cos(a)).toFixed(2))}
            cy={Number((8 * Math.sin(a)).toFixed(2))}
            r="8"
          />
        );
      })}
    </g>
    <circle cx="0" cy="0" r="7.5" fill={layers[3]} />
    <circle cx="0" cy="0" r="4.5" fill={pistilColor} />
  </g>
);

// HỌA TIẾT GÓC ĐẶC TRƯNG CHO TỪNG LOẠI THIỆP (Corner Ornaments)
const CornerOrnament: React.FC<{ style: string; color: string; accentColor: string }> = ({
  style,
  color,
  accentColor,
}) => {
  switch (style) {
    case 'peony-filigree':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 pointer-events-none">
          <path d="M 4,4 L 28,4 C 20,10 14,14 10,22 C 6,28 4,32 4,32 Z" fill="none" stroke={color} strokeWidth="1.2" />
          <path d="M 7,7 Q 16,10 21,21 Q 10,16 7,7 Z" fill={accentColor} opacity="0.35" />
          <circle cx="10" cy="10" r="2" fill={color} />
          <circle cx="18" cy="7" r="1.2" fill={accentColor} />
          <circle cx="7" cy="18" r="1.2" fill={accentColor} />
        </svg>
      );
    case 'royal-crown':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 pointer-events-none">
          <path d="M 4,4 L 26,4 M 4,4 L 4,26" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 8,14 L 10,19 L 14,12 L 18,19 L 20,14 L 20,21 L 8,21 Z" fill={color} />
          <circle cx="8" cy="12" r="1" fill={accentColor} />
          <circle cx="14" cy="10" r="1.2" fill={accentColor} />
          <circle cx="20" cy="12" r="1" fill={accentColor} />
          <rect x="8" y="22" width="12" height="1.5" rx="0.5" fill={accentColor} />
        </svg>
      );
    case 'wimbledon-branch':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 pointer-events-none">
          <path d="M 4,4 Q 15,7 24,24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <ellipse cx="13" cy="7" rx="3.5" ry="1.8" transform="rotate(-25 13 7)" fill={accentColor} opacity="0.8" />
          <ellipse cx="7" cy="13" rx="3.5" ry="1.8" transform="rotate(65 7 13)" fill={accentColor} opacity="0.8" />
          <circle cx="24" cy="24" r="1.8" fill={color} />
          <circle cx="18" cy="16" r="1.3" fill={color} />
        </svg>
      );
    case 'octagram-star':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 pointer-events-none">
          <path d="M 4,4 L 26,4 M 4,4 L 4,26" stroke={color} strokeWidth="1.1" />
          <g transform="translate(13, 13)">
            <path d="M 0,-7 L 2,-2 L 7,0 L 2,2 L 0,7 L -2,2 L -7,0 L -2,-2 Z" fill={color} />
            <path
              d="M -3.5,-3.5 L 0,-1.5 L 3.5,-3.5 L 1.5,0 L 3.5,3.5 L 0,1.5 L -3.5,3.5 L -1.5,0 Z"
              fill={accentColor}
              opacity="0.8"
            />
            <circle cx="0" cy="0" r="1.3" fill="#ffffff" />
          </g>
        </svg>
      );
    case 'academic-deco':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 pointer-events-none">
          <path d="M 4,26 L 4,11 L 11,11 L 11,4 L 26,4" fill="none" stroke={color} strokeWidth="1.2" />
          <path d="M 7,22 L 7,14 L 14,14 L 14,7 L 22,7" fill="none" stroke={accentColor} strokeWidth="0.8" opacity="0.7" />
          <polygon points="11,11 15,7 19,11 15,15" fill={color} />
          <circle cx="15" cy="11" r="1" fill="#ffffff" />
        </svg>
      );
    case 'romantic-ribbon':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 pointer-events-none">
          <path d="M 4,4 C 16,4 26,14 26,26" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 4,4 C 4,16 14,26 26,26" fill="none" stroke={accentColor} strokeWidth="0.8" opacity="0.6" />
          <path d="M 6,9 C 11,11 15,15 17,20 C 13,16 9,13 6,9 Z" fill={color} opacity="0.75" />
          <circle cx="15" cy="15" r="2" fill={accentColor} />
        </svg>
      );
    case 'laurel-peace':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 pointer-events-none">
          <path d="M 5,5 Q 15,9 22,22" fill="none" stroke={color} strokeWidth="1" />
          <ellipse cx="9" cy="6" rx="3.2" ry="1.6" transform="rotate(-30 9 6)" fill={color} opacity="0.8" />
          <ellipse cx="6" cy="11" rx="3.2" ry="1.6" transform="rotate(60 6 11)" fill={color} opacity="0.8" />
          <ellipse cx="15" cy="11" rx="3.2" ry="1.6" transform="rotate(-30 15 11)" fill={accentColor} opacity="0.7" />
          <ellipse cx="11" cy="17" rx="3.2" ry="1.6" transform="rotate(60 11 17)" fill={accentColor} opacity="0.7" />
          <circle cx="22" cy="22" r="1.3" fill={color} />
        </svg>
      );
    case 'kings-crest':
    default:
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 pointer-events-none">
          <path d="M 4,4 L 26,4 M 4,4 L 4,26" stroke={color} strokeWidth="1.2" />
          <path
            d="M 13,7 C 13,11 11,14 8,16 C 12,16 14,14 15,12 C 16,14 18,16 22,16 C 19,14 17,11 17,7 C 16,5 14,5 13,7 Z"
            fill={color}
          />
          <path d="M 15,7 L 15,19 M 11,17 L 19,17" stroke={accentColor} strokeWidth="0.9" />
          <circle cx="15" cy="20" r="1" fill={accentColor} />
        </svg>
      );
  }
};

const LeavesCluster: React.FC<{ leafColor: string }> = ({ leafColor }) => (
  <g>
    <ellipse cx="102" cy="42" rx="17" ry="44" fill={leafColor} opacity="0.8" transform="rotate(48 102 42)" />
    <ellipse cx="124" cy="82" rx="15" ry="42" fill={leafColor} opacity="0.75" transform="rotate(58 124 82)" />
    <ellipse cx="58" cy="106" rx="17" ry="46" fill={leafColor} opacity="0.85" transform="rotate(14 58 106)" />
    <ellipse cx="34" cy="132" rx="15" ry="40" fill={leafColor} opacity="0.85" transform="rotate(-8 34 132)" />
  </g>
);

const renderThemeFlower = (theme: CardThemeConfig, isLight = false) => {
  const layers = isLight && theme.flowerLayersLight ? theme.flowerLayersLight : theme.flowerLayers;

  switch (theme.flowerType) {
    case 'peony':
      return <PeonyBloom layers={layers} pistilColor={theme.pistilColor} />;
    case 'rose':
      return <RoseBloom layers={layers} pistilColor={theme.pistilColor} />;
    case 'sakura':
      return <SakuraBloom layers={layers} pistilColor={theme.pistilColor} />;
    case 'daisy':
      return <DaisyBloom isLight={isLight} />;
    case 'lilac':
      return <LilacBloom layers={layers} pistilColor={theme.pistilColor} />;
    case 'ranunculus':
      return <RanunculusBloom layers={layers} pistilColor={theme.pistilColor} />;
    case 'white-lily':
      return <LilyBloom layers={layers} pistilColor={theme.pistilColor} />;
    case 'lisianthus':
    default:
      return <LisianthusBloom layers={layers} pistilColor={theme.pistilColor} />;
  }
};

export const renderFlowerSvgContent = (relId: string) => {
  const theme = CARD_THEMES[relId] || CARD_THEMES.mother;
  return renderThemeFlower(theme, false);
};

export const CardPreview: React.FC<CardPreviewProps> = ({
  relationship,
  receiver,
  sender,
  message,
  language,
  cardRef,
}) => {
  const theme = CARD_THEMES[relationship.id] || CARD_THEMES.mother;

  const defaultReceiver = language === 'vi' ? relationship.defaultReceiverVi : relationship.defaultReceiverEn;
  const defaultMessage = language === 'vi' ? relationship.wishesVi[0] : relationship.wishesEn[0];

  const rawReceiver = isDefaultReceiver(receiver, relationship) ? defaultReceiver : receiver.trim();
  const hasSalutation = /^(gửi|kính gửi|thương gửi|thân gửi|tưởng nhớ|dearest|to|dear)\b/i.test(rawReceiver);

  let prefix = language === 'vi' ? 'Gửi ' : 'To ';
  if (language === 'vi') {
    if (relationship.id === 'mother') prefix = 'Kính gửi ';
    else if (relationship.id === 'wife') prefix = 'Thương gửi ';
    else if (relationship.id === 'memorial') prefix = 'Tưởng nhớ ';
    else if (relationship.id === 'other') prefix = 'Thân gửi ';
  } else {
    if (relationship.id === 'mother' || relationship.id === 'wife') prefix = 'Dearest ';
    else if (relationship.id === 'other') prefix = 'To ';
  }

  const displayTitle = hasSalutation ? rawReceiver : `${prefix}${rawReceiver}`;
  const displayMessage = message.trim() || defaultMessage;

  const rawSender = sender.trim();
  let displaySender = '';
  if (isAnonymousSender(rawSender)) {
    displaySender = language === 'vi' ? '— Một người thầm trân quý' : '— Someone who cherishes you';
  } else {
    displaySender = rawSender.startsWith('—') || rawSender.startsWith('-')
      ? rawSender
      : `— ${rawSender}`;
  }

  return (
    <div
      ref={cardRef}
      id="cardCaptureArea"
      style={{ backgroundColor: theme.cardBg }}
      className="relative w-full aspect-[4/5] min-h-[510px] sm:min-h-[550px] rounded-3xl shadow-xl overflow-hidden flex flex-col justify-between select-none transition-all duration-300"
    >
      {/* Khung đôi viền vàng kim hoàng gia & Navy (Royal British Double Frame) */}
      <div
        className="absolute inset-[18px] pointer-events-none z-[3] rounded-2xl"
        style={{ border: `1.5px solid ${theme.frameColor}` }}
      />
      <div
        className="absolute inset-[24px] pointer-events-none z-[3] rounded-xl"
        style={{ border: `1px solid ${theme.innerFrameColor || '#06214c'}`, opacity: 0.35 }}
      />

      {/* 4 Góc cách điệu riêng biệt cho từng loại thiệp (Unique Themed Corner Ornaments) */}
      <div className="absolute top-[22px] left-[22px] z-[4] pointer-events-none">
        <CornerOrnament style={theme.cornerStyle} color={theme.frameColor} accentColor={theme.accentColor} />
      </div>
      <div className="absolute top-[22px] right-[22px] z-[4] pointer-events-none scale-x-[-1]">
        <CornerOrnament style={theme.cornerStyle} color={theme.frameColor} accentColor={theme.accentColor} />
      </div>
      <div className="absolute bottom-[22px] left-[22px] z-[4] pointer-events-none scale-y-[-1]">
        <CornerOrnament style={theme.cornerStyle} color={theme.frameColor} accentColor={theme.accentColor} />
      </div>
      <div className="absolute bottom-[22px] right-[22px] z-[4] pointer-events-none -scale-100">
        <CornerOrnament style={theme.cornerStyle} color={theme.frameColor} accentColor={theme.accentColor} />
      </div>

      {/* Subtle Botanical Texture Background Accent */}

      {/* Cụm hoa góc trên bên trái (Top-Left Floral Cluster) */}
      <svg
        className="absolute top-0 left-0 w-[155px] h-[155px] sm:w-[175px] sm:h-[175px] pointer-events-none z-10"
        viewBox="0 0 180 180"
      >
        <LeavesCluster leafColor={theme.leafColor} />
        <g transform="translate(42, 38) scale(0.92)">
          {renderThemeFlower(theme, true)}
        </g>
        <g transform="translate(36, 112) scale(0.86)">
          {renderThemeFlower(theme, false)}
        </g>
        <g transform="translate(94, 88) scale(0.96)">
          {renderThemeFlower(theme, false)}
        </g>
      </svg>

      {/* Cụm hoa góc dưới bên phải (Bottom-Right Floral Cluster - Xoay 180 độ đối xứng hoàn hảo) */}
      <svg
        className="absolute bottom-0 right-0 w-[145px] h-[145px] sm:w-[165px] sm:h-[165px] pointer-events-none z-10 rotate-180"
        viewBox="0 0 180 180"
      >
        <LeavesCluster leafColor={theme.leafColor} />
        <g transform="translate(42, 38) scale(0.92)">
          {renderThemeFlower(theme, true)}
        </g>
        <g transform="translate(36, 112) scale(0.86)">
          {renderThemeFlower(theme, false)}
        </g>
        <g transform="translate(94, 88) scale(0.96)">
          {renderThemeFlower(theme, false)}
        </g>
      </svg>

      {/* Bông hoa đơn góc trên bên phải (Top-Right Single Bloom) */}
      <svg
        className="absolute top-0 right-0 w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] pointer-events-none z-10"
        viewBox="0 0 100 100"
      >
        <g transform="translate(74, 26) scale(0.72)">
          {renderThemeFlower(theme, false)}
        </g>
      </svg>

      {/* Bông hoa đơn góc dưới bên trái (Bottom-Left Single Bloom) */}
      <svg
        className="absolute bottom-0 left-0 w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] pointer-events-none z-10"
        viewBox="0 0 100 100"
      >
        <g transform="translate(26, 74) scale(0.72)">
          {renderThemeFlower(theme, false)}
        </g>
      </svg>

      {/* Nội dung thiệp chính giữa */}
      <div className="relative z-20 flex flex-col justify-between h-full px-6 sm:px-12 pt-[124px] sm:pt-[136px] pb-8 sm:pb-10 text-center">
        {/* Người nhận (Title) */}
        <div className="max-w-[88%] mx-auto">
          <h2
            className="font-serif italic font-semibold text-2xl sm:text-3xl tracking-wide px-2 break-words leading-tight"
            style={{ color: theme.salutationColor }}
          >
            {displayTitle}
          </h2>
        </div>

        {/* Lời chúc chân thành (Message Body) */}
        <div className="my-auto py-3 px-2 sm:px-4 flex items-center justify-center">
          <p
            className="font-serif text-base sm:text-[17.5px] leading-relaxed break-words whitespace-pre-line"
            style={{ color: theme.bodyColor }}
          >
            {displayMessage}
          </p>
        </div>

        {/* Chân thiệp (Footer: Đường kẻ, Người gửi, Ngày tháng) */}
        <div className="flex flex-col items-center max-w-[85%] mx-auto space-y-1">
          <div
            className="w-14 h-[1px] mb-1.5"
            style={{ backgroundColor: theme.dividerColor, opacity: 0.65 }}
          />
          <p
            className="font-serif italic text-base sm:text-lg tracking-wide"
            style={{ color: theme.senderColor }}
          >
            {displaySender}
          </p>
          <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.18em] uppercase mt-1">
            <span style={{ color: theme.dateColor }}>20 · 10</span>
            <span style={{ color: theme.dividerColor, opacity: 0.5 }}>•</span>
            <span className="font-semibold" style={{ color: '#d4a843' }}>
              {language === 'vi' ? 'NGÀY PHỤ NỮ VIỆT NAM' : 'HAPPY WOMEN\'S DAY'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
