export type Language = 'vi' | 'en';

export interface RelationshipTheme {
  id: string;
  icon: string;
  nameVi: string;
  nameEn: string;
  flowerVi: string;
  flowerEn: string;
  bgClass: string;
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
}

export interface CardData {
  receiver: string;
  sender: string;
  message: string;
  relationshipId: string;
  language: Language;
}
