import { toPng } from 'html-to-image';

export interface ExportCardOptions {
  relationshipId: string;
  backgroundColor?: string;
  pixelRatio?: number;
}

/**
 * Xuất ảnh thiệp nhanh chóng và tối ưu cho mobile
 * - Bỏ qua 7 template không hoạt động (tiết kiệm ~85% dung lượng xử lý)
 * - skipFonts: true để không quét tải lại webfont từ internet
 * - pixelRatio: 2 cho ảnh sắc nét chuẩn Retina mà không gây quá tải bộ nhớ trên Safari/Chrome mobile
 */
export async function exportCardToPng(
  targetEl: HTMLElement,
  options: ExportCardOptions
): Promise<string> {
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  const { relationshipId, backgroundColor = '#ffffff', pixelRatio = 2 } = options;

  const filter = (node: Node): boolean => {
    if (node instanceof Element) {
      const tag = node.tagName.toLowerCase();
      if (tag === 'image') {
        const active = node.getAttribute('data-active');
        if (active === 'false') return false;

        const href = node.getAttribute('href') || node.getAttribute('xlink:href');
        if (href && href.startsWith('/templates/') && !href.includes(relationshipId)) {
          return false;
        }
      }
    }
    return true;
  };

  return await toPng(targetEl, {
    cacheBust: false,
    skipFonts: true,
    pixelRatio,
    backgroundColor,
    filter,
  });
}
