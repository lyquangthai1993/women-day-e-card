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

export type FlowerType =
  | 'peony'       // Mẹ: mẫu đơn hồng
  | 'rose'        // Vợ: hồng đỏ thẫm
  | 'sakura'      // Chị / Em gái: anh đào hồng phấn
  | 'daisy'       // Bạn thân: cúc họa mi, nền vàng kem
  | 'lilac'       // Đồng nghiệp: hoa tím lilac
  | 'ranunculus'  // Người yêu: mao lương (ranunculus) màu san hô
  | 'white-lily'; // Người tôi muốn nhớ về: hoa trắng thanh khiết, nền xám xanh nhẹ

export interface CardThemeConfig {
  flowerType: FlowerType;
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
    // Mẹ: mẫu đơn hồng (Peony - hồng phấn ngọt ngào, hiền từ)
    flowerType: 'peony',
    cardBg: '#fcf1f4',
    frameColor: 'rgba(205, 130, 148, 0.65)',
    flowerLayers: ['#d95b7c', '#ea7a98', '#f29bb1', '#fce2e8'],
    flowerLayersLight: ['#ea7a98', '#f29bb1', '#fce2e8', '#ffffff'],
    pistilColor: '#e5a93b',
    leafColor: '#8fae92',
    salutationColor: '#4e1723',
    bodyColor: '#431e26',
    dividerColor: '#cd8294',
    senderColor: '#4e1723',
    dateColor: '#a36474',
  },
  wife: {
    // Vợ: hồng đỏ thẫm (Deep Red Rose - đỏ nhung nồng thắm, quyến rũ)
    flowerType: 'rose',
    cardBg: '#fdf5f5',
    frameColor: 'rgba(168, 50, 72, 0.65)',
    flowerLayers: ['#881337', '#9f1239', '#be123c', '#e11d48'],
    flowerLayersLight: ['#9f1239', '#be123c', '#e11d48', '#fecdd3'],
    pistilColor: '#facc15',
    leafColor: '#5e8062',
    salutationColor: '#450a18',
    bodyColor: '#3d141e',
    dividerColor: '#a83248',
    senderColor: '#450a18',
    dateColor: '#943447',
  },
  sister: {
    // Chị / Em gái: anh đào hồng phấn (Cherry Blossom / Sakura - pastel tươi trẻ, thanh nhã)
    flowerType: 'sakura',
    cardBg: '#fdf2f5',
    frameColor: 'rgba(220, 140, 160, 0.65)',
    flowerLayers: ['#e87a98', '#f09cb2', '#f8b8c8', '#fde8ee'],
    flowerLayersLight: ['#f09cb2', '#f8b8c8', '#fde8ee', '#ffffff'],
    pistilColor: '#e5a93b',
    leafColor: '#9dc09f',
    salutationColor: '#521c28',
    bodyColor: '#451d26',
    dividerColor: '#dc8ca0',
    senderColor: '#521c28',
    dateColor: '#ab6679',
  },
  friend: {
    // Bạn thân: cúc họa mi, nền vàng kem (Daisy - cánh trắng tinh khôi, nhụy vàng ấm trên nền vàng kem)
    flowerType: 'daisy',
    cardBg: '#fefce8',
    frameColor: 'rgba(217, 180, 74, 0.65)',
    flowerLayers: ['#f1f5f9', '#f8fafc', '#ffffff', '#ffffff'],
    pistilColor: '#eab308',
    leafColor: '#7da672',
    salutationColor: '#4a3810',
    bodyColor: '#3d2f0d',
    dividerColor: '#d9b44a',
    senderColor: '#4a3810',
    dateColor: '#927228',
  },
  colleague: {
    // Đồng nghiệp: hoa tím lilac (Lilac / Soft Lavender - tím lilac tinh tế, nhã nhặn)
    flowerType: 'lilac',
    cardBg: '#fbf6fe',
    frameColor: 'rgba(165, 125, 195, 0.65)',
    flowerLayers: ['#7c3aed', '#9333ea', '#a855f7', '#c4b5fd'],
    flowerLayersLight: ['#9333ea', '#a855f7', '#c4b5fd', '#ede9fe'],
    pistilColor: '#fbbf24',
    leafColor: '#7d9d86',
    salutationColor: '#32144d',
    bodyColor: '#2b153f',
    dividerColor: '#a57dc3',
    senderColor: '#32144d',
    dateColor: '#7c5496',
  },
  lover: {
    // Người yêu: mao lương (ranunculus) màu san hô (Coral Ranunculus - san hô nồng nàn & lãng mạn)
    flowerType: 'ranunculus',
    cardBg: '#fff5f2',
    frameColor: 'rgba(225, 115, 100, 0.65)',
    flowerLayers: ['#ea580c', '#f97316', '#fb923c', '#fecba6'],
    flowerLayersLight: ['#f97316', '#fb923c', '#fecba6', '#fff1e6'],
    pistilColor: '#d97706',
    leafColor: '#8ea889',
    salutationColor: '#541920',
    bodyColor: '#45171d',
    dividerColor: '#e17364',
    senderColor: '#541920',
    dateColor: '#a85245',
  },
  memorial: {
    // Người tôi muốn nhớ về: hoa trắng thanh khiết, nền xám xanh nhẹ (Pure White - hoa trắng thanh thoát trên nền xám xanh)
    flowerType: 'white-lily',
    cardBg: '#f0f4f8',
    frameColor: 'rgba(148, 163, 184, 0.65)',
    flowerLayers: ['#cbd5e1', '#e2e8f0', '#f1f5f9', '#ffffff'],
    flowerLayersLight: ['#e2e8f0', '#f1f5f9', '#ffffff', '#ffffff'],
    pistilColor: '#d97706',
    leafColor: '#8fa0a8',
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

// Hoa xếp lớp đồng tâm chuẩn phong cách paper-bloom (Dành cho Mẫu đơn, Hoa hồng, Anh đào, Lilac, Hoa trắng)
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
    {/* Nhụy hoa ấm áp */}
    <circle cx="0" cy="0" r="7" fill={pistilColor} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
  </g>
);

// Cúc Họa Mi đặc trưng (Cánh trắng thon dài tỏa đều quanh nhụy vàng)
const DaisyBloom: React.FC<{ isLight?: boolean }> = ({ isLight }) => (
  <g className="daisy-bloom">
    {/* Vòng cánh dài ngoài (16 cánh) */}
    <g fill={isLight ? '#ffffff' : '#f1f5f9'} stroke="rgba(0,0,0,0.05)" strokeWidth="0.4">
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse
          key={`d-out-${i}`}
          cx="0"
          cy="25"
          rx="5"
          ry="16"
          transform={`rotate(${i * 22.5})`}
        />
      ))}
    </g>
    {/* Vòng cánh trong xen kẽ (16 cánh trắng tinh khôi) */}
    <g fill="#ffffff" stroke="rgba(0,0,0,0.05)" strokeWidth="0.4">
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse
          key={`d-in-${i}`}
          cx="0"
          cy="20"
          rx="4.2"
          ry="13"
          transform={`rotate(${i * 22.5 + 11.25})`}
        />
      ))}
    </g>
    {/* Nhụy vàng rực rỡ đặc trưng của Cúc Họa Mi */}
    <circle cx="0" cy="0" r="14" fill="#eab308" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
    <circle cx="0" cy="0" r="11" fill="#facc15" />
    <circle cx="0" cy="0" r="7" fill="#fef08a" opacity="0.6" />
    {/* Hạt nhụy li ti */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      return (
        <circle
          key={`d-dot-${i}`}
          cx={Number((5.5 * Math.cos(angle)).toFixed(2))}
          cy={Number((5.5 * Math.sin(angle)).toFixed(2))}
          r="1.1"
          fill="#ca8a04"
        />
      );
    })}
  </g>
);

// Mao Lương (Ranunculus) màu san hô (Cánh tròn khum dày tầng, xòe tròn như quả cầu hoa)
const RanunculusBloom: React.FC<{ layers: [string, string, string, string]; pistilColor: string }> = ({
  layers,
  pistilColor,
}) => (
  <g className="ranunculus-bloom">
    {/* Tầng 1: 12 cánh ngoài */}
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
    {/* Tầng 2: 12 cánh giữa */}
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
    {/* Tầng 3: 10 cánh khum tròn */}
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
    {/* Tầng 4: 8 cánh trong cùng ôm lấy nhụy */}
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

  if (theme.flowerType === 'daisy') {
    return <DaisyBloom isLight={isLight} />;
  }
  if (theme.flowerType === 'ranunculus') {
    return <RanunculusBloom layers={layers} pistilColor={theme.pistilColor} />;
  }
  return <LayeredBloom layers={layers} pistilColor={theme.pistilColor} />;
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
        className="absolute top-0 left-0 w-[155px] h-[155px] sm:w-[175px] sm:h-[175px] pointer-events-none z-10"
        viewBox="0 0 180 180"
      >
        <LeavesCluster leafColor={theme.leafColor} />
        {/* Bông 1: Trên cùng (Tone sáng nhẹ) */}
        <g transform="translate(42, 38) scale(0.92)">
          {renderThemeFlower(theme, true)}
        </g>
        {/* Bông 2: Bên dưới bên trái */}
        <g transform="translate(36, 112) scale(0.86)">
          {renderThemeFlower(theme, false)}
        </g>
        {/* Bông 3: Nổi bật ở trung tâm cụm */}
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
      <div className="relative z-20 flex flex-col justify-between h-full px-6 sm:px-12 pt-[144px] sm:pt-[160px] pb-10 sm:pb-14 text-center">
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
        <div className="flex flex-col items-center max-w-[80%] mx-auto">
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
