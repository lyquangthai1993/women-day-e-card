export type Language = 'en' | 'vi';

export interface RelationshipTheme {
  id: string;
  icon: string;
  nameVi: string;
  nameEn: string;
  flowerVi: string;
  flowerEn: string;
  bgClass: string;
  bgColor: string;
  titleColor: string;
  bodyColor: string;
  senderColor: string;
  strokeColor: string;
  petalColor: string;
  defaultReceiverVi: string;
  defaultReceiverEn: string;
  defaultSalutationVi: string;
  defaultSalutationEn: string;
  wishesVi: string[];
  wishesEn: string[];
  gradientClass?: string;
  borderClass?: string;
  dividerSymbol?: string;
  stampBadgeVi?: string;
  stampBadgeEn?: string;
  stampStyle?: 'wax-seal' | 'ruby-ribbon' | 'airmail-stamp' | 'bestie-badge' | 'modern-foil' | 'coral-heart' | 'memorial-halo';
  salutationColor?: string;
}

export interface CardData {
  receiver: string;
  sender: string;
  message: string;
  relationshipId: string;
  language: Language;
}
