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

export interface CardThemeConfig {
  cardBg: string;
  salutationColor: string;
  bodyColor: string;
  senderColor: string;
  accentColor: string;
}

export const CARD_THEMES: Record<string, CardThemeConfig> = {
  mother: {
    cardBg: '#fee6ea',
    salutationColor: '#3d3d3d',
    bodyColor: '#4a4a4a',
    senderColor: '#3d3d3d',
    accentColor: '#f47784',
  },
  wife: {
    cardBg: '#f7f6f2',
    salutationColor: '#383d34',
    bodyColor: '#464b42',
    senderColor: '#383d34',
    accentColor: '#8ea26a',
  },
  sister: {
    cardBg: '#ffe4d3',
    salutationColor: '#42332e',
    bodyColor: '#4f413b',
    senderColor: '#42332e',
    accentColor: '#b20929',
  },
  friend: {
    cardBg: '#fff6f6',
    salutationColor: '#423633',
    bodyColor: '#4e4340',
    senderColor: '#423633',
    accentColor: '#b8604e',
  },
  colleague: {
    cardBg: '#eaebf5',
    salutationColor: '#323042',
    bodyColor: '#434055',
    senderColor: '#323042',
    accentColor: '#7055aa',
  },
  lover: {
    cardBg: '#fef0f4',
    salutationColor: '#3e3135',
    bodyColor: '#4c3f43',
    senderColor: '#3e3135',
    accentColor: '#f47784',
  },
  memorial: {
    cardBg: '#f8f8f8',
    salutationColor: '#1f242e',
    bodyColor: '#333842',
    senderColor: '#1f242e',
    accentColor: '#151a35',
  },
  other: {
    cardBg: '#faf9f5',
    salutationColor: '#353242',
    bodyColor: '#444152',
    senderColor: '#353242',
    accentColor: '#7055aa',
  },
};

export const renderFlowerSvgContent = (_relId: string) => null;

/**
 * Tự động ngắt dòng thông minh cho văn bản trong thẻ SVG <text>
 */
function wrapSvgText(text: string, maxCharsPerLine: number): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;
    let currentLine = '';
    for (const word of words) {
      if (!currentLine) {
        currentLine = word;
      } else if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines.length > 0 ? lines : [''];
}

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

  // Format Salutation ("Dearest mother,")
  const fullSalutation = hasSalutation ? rawReceiver : `${prefix}${rawReceiver}`;
  const displayTitle = fullSalutation.replace(/[,，]?$/, ',');
  const displayMessage = message.trim() || defaultMessage;

  // Format Sender ("- From someone who cherish you -")
  const rawSender = sender.trim();
  let displaySender = '';
  if (isAnonymousSender(rawSender)) {
    displaySender = language === 'vi' ? '- Một người thầm trân quý -' : '- From someone who cherish you -';
  } else {
    const clean = rawSender.replace(/^[-—\s]+|[-—\s]+$/g, '');
    displaySender = `- ${clean} -`;
  }

  // File SVG template tương ứng trong /public/templates/
  const templateSrc = `/templates/${relationship.id}.svg`;
  const isMemorial = relationship.id === 'memorial';

  // Tự động ngắt dòng thông minh cho Người nhận nếu danh xưng/tên dài (đặc biệt là 'Tưởng nhớ Người Phụ Nữ Trong Tim Tôi,')
  // Giúp chữ luôn nằm gọn gàng bên trong khung viền
  const maxTitleChars = isMemorial ? 22 : 26;
  const titleLines = wrapSvgText(displayTitle, maxTitleChars);
  const titleFontSize = titleLines.length > 1
    ? (displayTitle.length > 30 ? 10.5 : 11.5)
    : (displayTitle.length > 22 ? 11.8 : 13);
  const titleLineHeight = 14;
  const titleStartY = titleLines.length > 1
    ? (202 - ((titleLines.length - 1) * titleLineHeight) / 2)
    : 202;

  // Tính toán typography và ngắt dòng động theo độ dài lời chúc (viewBox scale: 297.75 x 419.25)
  const msgLen = displayMessage.length;
  let fontSize = 11.5;
  let lineHeight = 17;
  let maxChars = isMemorial ? 30 : 34;

  if (msgLen <= 80) {
    fontSize = isMemorial ? 11.5 : 12.5;
    lineHeight = isMemorial ? 17 : 18;
    maxChars = isMemorial ? 28 : 32;
  } else if (msgLen <= 140) {
    fontSize = isMemorial ? 10.5 : 11;
    lineHeight = isMemorial ? 15.5 : 16;
    maxChars = isMemorial ? 34 : 38;
  } else if (msgLen <= 220) {
    fontSize = isMemorial ? 9.2 : 9.8;
    lineHeight = isMemorial ? 13.8 : 14.5;
    maxChars = isMemorial ? 38 : 43;
  } else {
    fontSize = isMemorial ? 8.2 : 8.6;
    lineHeight = isMemorial ? 12.2 : 12.8;
    maxChars = isMemorial ? 42 : 48;
  }

  const messageLines = wrapSvgText(displayMessage, maxChars);

  // Căn giữa trục Y hoàn hảo cho vùng tin nhắn (giữa Salutation y=202 và Sender y=345)
  // Tâm vùng giữa = 273.5
  const totalMessageHeight = (messageLines.length - 1) * lineHeight;
  const messageStartY = 273.5 - totalMessageHeight / 2;

  return (
    <div
      ref={cardRef}
      id="cardCaptureArea"
      style={{ backgroundColor: theme.cardBg }}
      className="relative w-full aspect-[298/419] max-w-[500px] mx-auto rounded-2xl shadow-2xl overflow-hidden select-none transition-all duration-300"
    >
      <svg
        viewBox="0 0 297.75 419.25"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {/* 1. Nền SVG Template nghệ thuật của Designer (Hoa văn, viền, Happy Women's day & Trái tim) */}
        <image
          href={templateSrc}
          x="0"
          y="0"
          width="297.75"
          height="419.25"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* 2. Người nhận: Đặt chính xác tại y = 202 theo toạ độ thiết kế gốc (dưới trái tim), hỗ trợ ngắt dòng nếu dài */}
        <text
          x="148.875"
          y={titleStartY}
          textAnchor="middle"
          fill={theme.salutationColor}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          fontSize={titleFontSize}
          letterSpacing="0.2"
        >
          {titleLines.map((line, idx) => (
            <tspan
              key={idx}
              x="148.875"
              dy={idx === 0 ? 0 : titleLineHeight}
            >
              {line}
            </tspan>
          ))}
        </text>

        {/* 3. Lời chúc chân thành: Căn giữa hoàn hảo bằng toạ độ vector SVG */}
        <text
          x="148.875"
          y={messageStartY}
          textAnchor="middle"
          fill={theme.bodyColor}
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize={fontSize}
        >
          {messageLines.map((line, idx) => (
            <tspan
              key={idx}
              x="148.875"
              dy={idx === 0 ? 0 : lineHeight}
            >
              {line}
            </tspan>
          ))}
        </text>

        {/* 4. Người gửi: Đặt chính xác tại y = 345 theo toạ độ thiết kế gốc (phía trên thảm hoa chân thiệp) */}
        <text
          x="148.875"
          y="345"
          textAnchor="middle"
          fill={theme.senderColor}
          fontFamily="'Playfair Display', Georgia, serif"
          fontStyle="italic"
          fontWeight="700"
          fontSize="10"
          letterSpacing="0.3"
        >
          {displaySender}
        </text>
      </svg>
    </div>
  );
};

export default CardPreview;
