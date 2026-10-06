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

export interface CardThemeConfig {
  cardBg: string;
  frameColor: string;
  flowerLayers: [string, string, string, string];
  flowerLayersLight?: [string, string, string, string];
  pistilColor: string;
  leafColor: string;
  salutationColor: string;
  bodyColor: string;
  dividerColor: string;
  senderColor: string;
  dateColor: string;
}

export const CARD_THEMES: Record<string, CardThemeConfig> = {
  mother: {
    // Peony Soft Blush (Mẫu đơn ấm áp & hiền từ)
    cardBg: '#fbf0f2',
    frameColor: 'rgba(196, 130, 146, 0.65)',
    flowerLayers: ['#df758e', '#ea92a5', '#f3b6c3', '#fae1e6'],
    flowerLayersLight: ['#ea92a5', '#f3b6c3', '#fae1e6', '#ffffff'],
    pistilColor: '#e5a93b',
    leafColor: '#9ab69c',
    salutationColor: '#541e2a',
    bodyColor: '#432128',
    dividerColor: '#c48292',
    senderColor: '#541e2a',
    dateColor: '#a86a78',
  },
  sister: {
    // Cherry Blossom (Anh đào tươi trẻ, ngọt ngào - giống hệt mẫu tham khảo)
    cardBg: '#fbf0f2',
    frameColor: 'rgba(196, 130, 146, 0.65)',
    flowerLayers: ['#df758e', '#ea92a5', '#f3b6c3', '#fae1e6'],
    flowerLayersLight: ['#ea92a5', '#f3b6c3', '#fae1e6', '#ffffff'],
    pistilColor: '#e5a93b',
    leafColor: '#9ab69c',
    salutationColor: '#541e2a',
    bodyColor: '#432128',
    dividerColor: '#c48292',
    senderColor: '#541e2a',
    dateColor: '#a86a78',
  },
  wife: {
    // Red Rose (Hoa hồng nhung quyến rũ, nồng thắm)
    cardBg: '#fdf3f4',
    frameColor: 'rgba(184, 93, 110, 0.65)',
    flowerLayers: ['#be123c', '#dc264e', '#e95374', '#fbcfe8'],
    flowerLayersLight: ['#dc264e', '#e95374', '#fbcfe8', '#ffe4e6'],
    pistilColor: '#facc15',
    leafColor: '#86a789',
    salutationColor: '#581021',
    bodyColor: '#461520',
    dividerColor: '#b85d6e',
    senderColor: '#581021',
    dateColor: '#9f4357',
  },
  lover: {
    // Coral Camellia / Ruby (San hô lãng mạn & nồng nàn)
    cardBg: '#fdf2f0',
    frameColor: 'rgba(216, 123, 112, 0.65)',
    flowerLayers: ['#e14958', '#f26a79', '#fa95a2', '#fde0e4'],
    flowerLayersLight: ['#f26a79', '#fa95a2', '#fde0e4', '#ffffff'],
    pistilColor: '#f59e0b',
    leafColor: '#9ab69c',
    salutationColor: '#5c1d24',
    bodyColor: '#4a1e23',
    dividerColor: '#d87b70',
    senderColor: '#5c1d24',
    dateColor: '#b05f69',
  },
  friend: {
    // Daisy Sunshine Cream (Cúc họa mi rạng rỡ, tri kỷ)
    cardBg: '#fefdf5',
    frameColor: 'rgba(203, 178, 105, 0.65)',
    flowerLayers: ['#f59e0b', '#fbbf24', '#fde047', '#fef9c3'],
    flowerLayersLight: ['#fbbf24', '#fde047', '#fef9c3', '#ffffff'],
    pistilColor: '#b45309',
    leafColor: '#8eb084',
    salutationColor: '#524016',
    bodyColor: '#453713',
    dividerColor: '#cbb269',
    senderColor: '#524016',
    dateColor: '#997e3a',
  },
  colleague: {
    // Soft Lavender / Lilac (Hoa tím thanh lịch, tinh tế)
    cardBg: '#fbf8fe',
    frameColor: 'rgba(159, 122, 184, 0.65)',
    flowerLayers: ['#9333ea', '#a855f7', '#c084fc', '#f3e8ff'],
    flowerLayersLight: ['#a855f7', '#c084fc', '#f3e8ff', '#ffffff'],
    pistilColor: '#fbbf24',
    leafColor: '#88a892',
    salutationColor: '#3b1d52',
    bodyColor: '#321a44',
    dividerColor: '#9f7ab8',
    senderColor: '#3b1d52',
    dateColor: '#7e5299',
  },
  memorial: {
    // Pure White Lily (Hoa trắng thanh khiết & hoài niệm an yên)
    cardBg: '#f8fafc',
    frameColor: 'rgba(148, 163, 184, 0.65)',
    flowerLayers: ['#94a3b8', '#cbd5e1', '#e2e8f0', '#ffffff'],
    flowerLayersLight: ['#cbd5e1', '#e2e8f0', '#ffffff', '#ffffff'],
    pistilColor: '#d97706',
    leafColor: '#94a3b8',
    salutationColor: '#1e293b',
    bodyColor: '#334155',
    dividerColor: '#94a3b8',
    senderColor: '#1e293b',
    dateColor: '#64748b',
  },
};

interface LayeredBloomProps {
  layers: [string, string, string, string];
  pistilColor: string;
}

const LayeredBloom: React.FC<LayeredBloomProps> = ({ layers, pistilColor }) => (
  <g className="layered-bloom">
    {/* Vòng cánh ngoài cùng (Layer 1) */}
    <g fill={layers[0]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="30" />
      <circle cx="30" cy="0" r="18" />
      <circle cx="21.21" cy="21.21" r="18" />
      <circle cx="0" cy="30" r="18" />
      <circle cx="-21.21" cy="21.21" r="18" />
      <circle cx="-30" cy="0" r="18" />
      <circle cx="-21.21" cy="-21.21" r="18" />
      <circle cx="0" cy="-30" r="18" />
      <circle cx="21.21" cy="-21.21" r="18" />
    </g>
    {/* Vòng cánh thứ hai (Layer 2) */}
    <g fill={layers[1]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="22" />
      <circle cx="20.32" cy="8.42" r="14" />
      <circle cx="8.42" cy="20.32" r="14" />
      <circle cx="-8.42" cy="20.32" r="14" />
      <circle cx="-20.32" cy="8.42" r="14" />
      <circle cx="-20.32" cy="-8.42" r="14" />
      <circle cx="-8.42" cy="-20.32" r="14" />
      <circle cx="8.42" cy="-20.32" r="14" />
      <circle cx="20.32" cy="-8.42" r="14" />
    </g>
    {/* Vòng cánh thứ ba (Layer 3) */}
    <g fill={layers[2]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="14" />
      <circle cx="14" cy="0" r="11" />
      <circle cx="9.9" cy="9.9" r="11" />
      <circle cx="0" cy="14" r="11" />
      <circle cx="-9.9" cy="9.9" r="11" />
      <circle cx="-14" cy="0" r="11" />
      <circle cx="-9.9" cy="-9.9" r="11" />
      <circle cx="0" cy="-14" r="11" />
      <circle cx="9.9" cy="-9.9" r="11" />
    </g>
    {/* Vòng cánh trong cùng (Layer 4) */}
    <g fill={layers[3]} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5">
      <circle cx="0" cy="0" r="7" />
      <circle cx="6.47" cy="2.68" r="8" />
      <circle cx="2.68" cy="6.47" r="8" />
      <circle cx="-2.68" cy="6.47" r="8" />
      <circle cx="-6.47" cy="2.68" r="8" />
      <circle cx="-6.47" cy="-2.68" r="8" />
      <circle cx="-2.68" cy="-6.47" r="8" />
      <circle cx="2.68" cy="-6.47" r="8" />
      <circle cx="6.47" cy="-2.68" r="8" />
    </g>
    {/* Nhụy hoa vàng ấm áp */}
    <circle cx="0" cy="0" r="7" fill={pistilColor} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
  </g>
);

interface LeavesClusterProps {
  leafColor: string;
}

const LeavesCluster: React.FC<LeavesClusterProps> = ({ leafColor }) => (
  <g>
    <ellipse cx="102" cy="42" rx="17" ry="44" fill={leafColor} opacity="0.8" transform="rotate(48 102 42)" />
    <ellipse cx="124" cy="82" rx="15" ry="42" fill={leafColor} opacity="0.75" transform="rotate(58 124 82)" />
    <ellipse cx="58" cy="106" rx="17" ry="46" fill={leafColor} opacity="0.85" transform="rotate(14 58 106)" />
    <ellipse cx="34" cy="132" rx="15" ry="40" fill={leafColor} opacity="0.85" transform="rotate(-8 34 132)" />
  </g>
);

export const renderFlowerSvgContent = (relId: string) => {
  const theme = CARD_THEMES[relId] || CARD_THEMES.mother;
  return <LayeredBloom layers={theme.flowerLayers} pistilColor={theme.pistilColor} />;
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

  const rawReceiver = receiver.trim() || defaultReceiver;
  const hasSalutation = /^(gửi|kính gửi|thương gửi|thân gửi|tưởng nhớ|dearest|to|dear)\b/i.test(rawReceiver);

  let prefix = language === 'vi' ? 'Gửi ' : 'To ';
  if (language === 'vi') {
    if (relationship.id === 'mother') prefix = 'Kính gửi ';
    else if (relationship.id === 'wife') prefix = 'Thương gửi ';
    else if (relationship.id === 'memorial') prefix = 'Tưởng nhớ ';
  } else {
    if (relationship.id === 'mother' || relationship.id === 'wife') prefix = 'Dearest ';
  }

  const displayTitle = hasSalutation ? rawReceiver : `${prefix}${rawReceiver}`;
  const displayMessage = message.trim() || defaultMessage;

  const rawSender = sender.trim();
  let displaySender = '';
  if (rawSender) {
    displaySender = rawSender.startsWith('—') || rawSender.startsWith('-')
      ? rawSender
      : `— ${rawSender}`;
  } else {
    displaySender = language === 'vi' ? '— Một người thầm trân quý' : '— Someone who cherishes you';
  }

  return (
    <div
      ref={cardRef}
      id="cardCaptureArea"
      style={{ backgroundColor: theme.cardBg }}
      className="relative w-full aspect-[4/5] min-h-[500px] sm:min-h-[540px] rounded-3xl shadow-xl overflow-hidden flex flex-col justify-between select-none transition-all duration-300"
    >
      {/* Khung đôi tinh tế (Double Frame Border) */}
      <div
        className="absolute inset-[20px] pointer-events-none z-[1] rounded-[2px]"
        style={{ border: `1px solid ${theme.frameColor}` }}
      />
      <div
        className="absolute inset-[27px] pointer-events-none z-[1] rounded-[1px]"
        style={{ border: `1px solid ${theme.frameColor}`, opacity: 0.6 }}
      />

      {/* Cụm hoa góc trên bên trái (Top-Left Floral Cluster) */}
      <svg
        className="absolute top-0 left-0 w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] pointer-events-none z-10"
        viewBox="0 0 180 180"
      >
        <LeavesCluster leafColor={theme.leafColor} />
        {/* Bông 1: Trên cùng (Tone sáng nhẹ) */}
        <g transform="translate(44, 40) scale(0.92)">
          <LayeredBloom layers={theme.flowerLayersLight || theme.flowerLayers} pistilColor={theme.pistilColor} />
        </g>
        {/* Bông 2: Bên dưới bên trái */}
        <g transform="translate(38, 116) scale(0.86)">
          <LayeredBloom layers={theme.flowerLayers} pistilColor={theme.pistilColor} />
        </g>
        {/* Bông 3: Nổi bật ở trung tâm cụm */}
        <g transform="translate(104, 98) scale(1.06)">
          <LayeredBloom layers={theme.flowerLayers} pistilColor={theme.pistilColor} />
        </g>
      </svg>

      {/* Cụm hoa góc dưới bên phải (Bottom-Right Floral Cluster - Xoay 180 độ đối xứng hoàn hảo) */}
      <svg
        className="absolute bottom-0 right-0 w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] pointer-events-none z-10 rotate-180"
        viewBox="0 0 180 180"
      >
        <LeavesCluster leafColor={theme.leafColor} />
        <g transform="translate(44, 40) scale(0.92)">
          <LayeredBloom layers={theme.flowerLayersLight || theme.flowerLayers} pistilColor={theme.pistilColor} />
        </g>
        <g transform="translate(38, 116) scale(0.86)">
          <LayeredBloom layers={theme.flowerLayers} pistilColor={theme.pistilColor} />
        </g>
        <g transform="translate(104, 98) scale(1.06)">
          <LayeredBloom layers={theme.flowerLayers} pistilColor={theme.pistilColor} />
        </g>
      </svg>

      {/* Bông hoa đơn góc trên bên phải (Top-Right Single Bloom) */}
      <svg
        className="absolute top-0 right-0 w-[100px] h-[100px] pointer-events-none z-10"
        viewBox="0 0 100 100"
      >
        <g transform="translate(74, 26) scale(0.72)">
          <LayeredBloom layers={theme.flowerLayers} pistilColor={theme.pistilColor} />
        </g>
      </svg>

      {/* Bông hoa đơn góc dưới bên trái (Bottom-Left Single Bloom) */}
      <svg
        className="absolute bottom-0 left-0 w-[100px] h-[100px] pointer-events-none z-10"
        viewBox="0 0 100 100"
      >
        <g transform="translate(26, 74) scale(0.72)">
          <LayeredBloom layers={theme.flowerLayers} pistilColor={theme.pistilColor} />
        </g>
      </svg>

      {/* Nội dung thiệp chính giữa */}
      <div className="relative z-20 flex flex-col justify-between h-full px-8 sm:px-12 pt-28 sm:pt-32 pb-14 sm:pb-16 text-center">
        {/* Người nhận (Title) */}
        <div className="max-w-[85%] mx-auto">
          <h2
            className="font-serif italic font-semibold text-2xl sm:text-3xl tracking-wide px-2 break-words leading-tight"
            style={{ color: theme.salutationColor }}
          >
            {displayTitle}
          </h2>
        </div>

        {/* Lời chúc chân thành (Message Body) */}
        <div className="my-auto py-4 px-2 sm:px-4 flex items-center justify-center">
          <p
            className="font-serif text-base sm:text-[18px] leading-relaxed break-words whitespace-pre-line"
            style={{ color: theme.bodyColor }}
          >
            {displayMessage}
          </p>
        </div>

        {/* Chân thiệp (Footer: Đường kẻ, Người gửi, Ngày tháng) */}
        <div className="flex flex-col items-center">
          <div
            className="w-12 h-[1px] mb-3"
            style={{ backgroundColor: theme.dividerColor, opacity: 0.6 }}
          />
          <p
            className="font-serif italic text-base sm:text-lg tracking-wide"
            style={{ color: theme.senderColor }}
          >
            {displaySender}
          </p>
          <div
            className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase mt-2"
            style={{ color: theme.dateColor }}
          >
            20 . 10
          </div>
        </div>
      </div>
    </div>
  );
};
