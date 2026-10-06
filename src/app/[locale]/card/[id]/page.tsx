import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Loader2 } from 'lucide-react';

import { CardViewClient, CardInitialData } from '../../../../components/CardViewClient';
import { RELATIONSHIPS, isDefaultReceiver, isAnonymousSender } from '../../../../lib/constants';
import { getCardFromGoogleSheet } from '../../../../lib/googleSheet';
import { Language, RelationshipTheme } from '../../../../types';
import { AppConfig } from '../../../../lib/AppConfig';

export const revalidate = 60; // ISR page revalidation: 60 giây
export const dynamicParams = true; // Hỗ trợ tạo trang tĩnh On-Demand (ISR) cho mọi cardId mới

interface PageProps {
  params: { locale: string; id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const currentLocale = (params.locale || AppConfig.defaultLocale) as Language;
  const isVi = currentLocale === 'vi';
  const id = params.id;

  let sheetData = null;
  if (id) {
    try {
      sheetData = await getCardFromGoogleSheet(id.trim());
    } catch {
      // Ignore
    }
  }

  const relId = sheetData?.relationship || 'mother';
  const relObj = RELATIONSHIPS.find(
    (item) => item.id === relId || item.nameVi === relId || item.nameEn === relId || (item.id === 'other' && (relId.toLowerCase() === 'others' || relId === 'Khác - Others'))
  ) || RELATIONSHIPS[0];

  const candidateReceiver = sheetData?.receiver || '';
  const finalReceiver = candidateReceiver && !isDefaultReceiver(candidateReceiver, relObj)
    ? candidateReceiver
    : (isVi ? relObj.defaultReceiverVi : relObj.defaultReceiverEn);

  const finalMessage = sheetData?.message || (isVi ? relObj.wishesVi[0] : relObj.wishesEn[0]);

  const title = isVi
    ? `Thiệp 20/10 gửi tặng ${finalReceiver} 🌸`
    : `Happy Women's Day E-Card for ${finalReceiver} 🌸`;
  const description = finalMessage.length > 120 ? `${finalMessage.substring(0, 117)}...` : finalMessage;
  const siteUrl = 'https://women-day-e-card.vercel.app';
  const prefix = isVi ? '/vi' : '';
  const canonicalUrl = `${siteUrl}${prefix}/card/${id}`;

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

export default async function CardIdPage({ params }: PageProps) {
  setRequestLocale(params.locale);

  const currentLocale = (params.locale || AppConfig.defaultLocale) as Language;
  const id = params.id;
  const activeLang: Language = currentLocale === 'vi' || currentLocale === 'en' ? currentLocale : AppConfig.defaultLocale;

  let initialRel: RelationshipTheme = RELATIONSHIPS[0];
  let initialReceiver = '';
  let initialSender = '';
  let initialMessage = '';
  let wishIndex: number | null = null;

  let sheetData = null;
  if (id) {
    try {
      sheetData = await getCardFromGoogleSheet(id.trim());
    } catch (e) {
      console.warn('Server fetch card error:', e);
    }
  }

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
    initialReceiver = activeLang === 'vi' ? initialRel.defaultReceiverVi : initialRel.defaultReceiverEn;
    initialSender = '';
    initialMessage = activeLang === 'vi' ? initialRel.wishesVi[0] : initialRel.wishesEn[0];
    wishIndex = 0;
  }

  const initialData: CardInitialData = {
    cardId: id || null,
    language: activeLang,
    relationship: initialRel,
    receiver: initialReceiver,
    message: initialMessage,
    sender: initialSender,
    wishIndex: wishIndex,
    isLoading: !sheetData,
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
