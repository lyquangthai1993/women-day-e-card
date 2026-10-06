import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Loader2 } from 'lucide-react';

import { CardViewClient, CardInitialData } from '../../../components/CardViewClient';
import { RELATIONSHIPS, I18N, isDefaultReceiver, isAnonymousSender } from '../../../lib/constants';
import { getCardFromGoogleSheet } from '../../../lib/googleSheet';
import { Language, RelationshipTheme } from '../../../types';
import { AppConfig } from '../../../lib/AppConfig';

interface PageProps {
  params: { locale: string };
  searchParams: {
    id?: string;
    cardId?: string;
    rel?: string;
    lang?: string;
    l?: string;
    r?: string;
    s?: string;
    m?: string;
    w?: string;
  };
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const currentLocale = (params.locale || AppConfig.defaultLocale) as Language;
  const isVi = (searchParams.lang || searchParams.l || currentLocale) === 'vi';
  const rec = searchParams.r;
  const msg = searchParams.m;
  const id = searchParams.id || searchParams.cardId;

  let sheetData = null;
  if (id) {
    try {
      sheetData = await getCardFromGoogleSheet(id.trim());
    } catch {
      // Ignore error for metadata fallback
    }
  }

  const relId = sheetData?.relationship || searchParams.rel || 'mother';
  const relObj = RELATIONSHIPS.find(
    (item) => item.id === relId || item.nameVi === relId || item.nameEn === relId || (item.id === 'other' && (relId.toLowerCase() === 'others' || relId === 'Khác - Others'))
  ) || RELATIONSHIPS[0];

  const candidateReceiver = sheetData?.receiver || rec || '';
  const finalReceiver = candidateReceiver && !isDefaultReceiver(candidateReceiver, relObj)
    ? candidateReceiver
    : (isVi ? relObj.defaultReceiverVi : relObj.defaultReceiverEn);

  const finalMessage = sheetData?.message || msg || (isVi ? relObj.wishesVi[0] : relObj.wishesEn[0]);

  const title = isVi
    ? `Thiệp 20/10 gửi tặng ${finalReceiver} 🌸`
    : `Happy Women's Day E-Card for ${finalReceiver} 🌸`;
  const description = finalMessage.length > 120 ? `${finalMessage.substring(0, 117)}...` : finalMessage;
  const siteUrl = 'https://women-day-e-card.vercel.app';
  const prefix = isVi ? '/vi' : '';
  const canonicalUrl = `${siteUrl}${prefix}/card?id=${id || ''}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: '20/10 E-Card & Ice Cream Pass',
      locale: isVi ? 'vi_VN' : 'en_US',
      type: 'article',
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          secureUrl: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og-image.jpg`],
    },
  };
}

export default async function CardPage({ params, searchParams }: PageProps) {
  setRequestLocale(params.locale);

  const currentLocale = (params.locale || AppConfig.defaultLocale) as Language;
  const id = searchParams.id || searchParams.cardId;
  const rel = searchParams.rel;
  const urlLang = searchParams.lang || searchParams.l;
  const activeLang: Language = (urlLang === 'vi' || urlLang === 'en')
    ? (urlLang as Language)
    : (currentLocale === 'vi' || currentLocale === 'en' ? currentLocale : AppConfig.defaultLocale);

  // 1. Xác định Relationship ban đầu
  let initialRel: RelationshipTheme = RELATIONSHIPS[0];
  if (rel) {
    const found = RELATIONSHIPS.find(
      (item) => item.id === rel || item.nameVi === rel || item.nameEn === rel || (item.id === 'other' && (rel.toLowerCase() === 'others' || rel === 'Khác - Others'))
    );
    if (found) initialRel = found;
  }

  // 2. Parse dữ liệu truyền từ URL
  let initialReceiver = searchParams.r || '';
  let initialSender = searchParams.s || '';
  let initialMessage = searchParams.m || '';
  let wishIndex: number | null = null;
  if (searchParams.w) {
    const idx = parseInt(searchParams.w, 10);
    if (!isNaN(idx)) {
      wishIndex = idx;
      const wishes = activeLang === 'vi' ? initialRel.wishesVi : initialRel.wishesEn;
      if (wishes[idx]) initialMessage = wishes[idx];
    }
  }

  // 3. Nạp dữ liệu từ Google Sheet với Data Cache ISR (revalidate 300s)
  let sheetData = null;
  if (id) {
    try {
      sheetData = await getCardFromGoogleSheet(id.trim());
    } catch (e) {
      console.warn('Server fetch card error:', e);
    }
  }

  // 4. Ưu tiên dữ liệu Google Sheet làm nguồn chân thực (Single Source of Truth)
  if (sheetData) {
    if (sheetData.relationship) {
      const found = RELATIONSHIPS.find(
        (item) => item.id === sheetData!.relationship || item.nameVi === sheetData!.relationship || item.nameEn === sheetData!.relationship || (item.id === 'other' && (sheetData!.relationship.toLowerCase() === 'others' || sheetData!.relationship === 'Khác - Others'))
      );
      if (found) initialRel = found;
    }

    if (sheetData.message) {
      const viI = initialRel.wishesVi.indexOf(sheetData.message);
      const enI = initialRel.wishesEn.indexOf(sheetData.message);
      if (viI >= 0) {
        wishIndex = viI;
        initialMessage = activeLang === 'vi' ? initialRel.wishesVi[viI] : initialRel.wishesEn[viI];
      } else if (enI >= 0) {
        wishIndex = enI;
        initialMessage = activeLang === 'vi' ? initialRel.wishesVi[enI] : initialRel.wishesEn[enI];
      } else {
        // Lời chúc custom do người dùng tự gõ
        wishIndex = null;
        initialMessage = sheetData.message;
      }
    }

    if (sheetData.receiver) {
      if (isDefaultReceiver(sheetData.receiver, initialRel)) {
        initialReceiver = activeLang === 'vi' ? initialRel.defaultReceiverVi : initialRel.defaultReceiverEn;
      } else {
        initialReceiver = sheetData.receiver;
      }
    }

    if (sheetData.sender) {
      initialSender = isAnonymousSender(sheetData.sender) ? '' : sheetData.sender;
    }
  } else {
    // Nếu chưa có từ sheet hoặc url, thiết lập mặc định theo chủ đề
    if (!initialReceiver || isDefaultReceiver(initialReceiver, initialRel)) {
      initialReceiver = activeLang === 'vi' ? initialRel.defaultReceiverVi : initialRel.defaultReceiverEn;
    }
    if (!initialSender || isAnonymousSender(initialSender)) {
      initialSender = '';
    }
    if (!initialMessage) {
      initialMessage = activeLang === 'vi' ? initialRel.wishesVi[0] : initialRel.wishesEn[0];
      wishIndex = 0;
    }
  }

  // Nếu có ID nhưng chưa fetch được từ sheet và cũng không có nội dung trên URL -> cần hiển thị loading trên client
  const hasInlineData = Boolean(searchParams.rel || searchParams.m || searchParams.w);
  const isLoading = Boolean(id && !sheetData && !hasInlineData);

  const initialData: CardInitialData = {
    cardId: id || null,
    language: activeLang,
    relationship: initialRel,
    receiver: initialReceiver,
    message: initialMessage,
    sender: initialSender,
    wishIndex: wishIndex,
    isLoading: isLoading,
  };

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="flex items-center space-x-2 text-rose-700 font-serif font-bold text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-rose-600" />
            <span>{activeLang === 'vi' ? 'Đang mở tấm thiệp yêu thương...' : 'Opening your heartfelt e-card...'}</span>
          </div>
        </div>
      }
    >
      <CardViewClient initialData={initialData} />
    </Suspense>
  );
}
