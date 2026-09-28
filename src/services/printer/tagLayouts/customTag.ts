import { TagType } from '../constants';

const PADDING = 10;
const CHAR_WIDTH_RATIO = 0.6;
const FONT_SIZE_LABELS = [
  'Крупный',
  'Большой',
  'Средний',
  'Небольшой',
  'Мелкий',
];

const TAG_METRICS: Record<
  TagType,
  { width: number; height: number; fonts: number[] }
> = {
  [TagType.FOUR_X_TWO_FIVE]: {
    width: 320,
    height: 180,
    fonts: [40, 32, 26, 22, 18],
  },
  [TagType.FOUR_THREE_X_TWO_FIVE]: {
    width: 344,
    height: 180,
    fonts: [40, 32, 26, 22, 18],
  },
  [TagType.FIVE_EIGHT_X_THREE]: {
    width: 464,
    height: 240,
    fonts: [48, 40, 32, 26, 22],
  },
};

export type CustomTagLayout = {
  width: number;
  height: number;
  fontSize: number;
  padding: number;
  maxLines: number;
  fits: boolean;
};

export const getCustomTagFontOptions = (
  tagType: TagType,
): { size: number; label: string }[] => {
  return TAG_METRICS[tagType].fonts.map((size, index) => ({
    size,
    label: FONT_SIZE_LABELS[index] ?? String(size),
  }));
};

export const normalizeCustomTagText = (text: string): string => {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
};

const countLines = (
  text: string,
  fontSize: number,
  usableWidth: number,
): number => {
  const charsPerLine = Math.max(
    1,
    Math.floor(usableWidth / (fontSize * CHAR_WIDTH_RATIO)),
  );

  return text.split('\n').reduce((total, line) => {
    if (line.length === 0) {
      return total + 1;
    }

    return total + Math.ceil(line.length / charsPerLine);
  }, 0);
};

const textFits = (
  text: string,
  fontSize: number,
  usableWidth: number,
  usableHeight: number,
): boolean => {
  if (!text) {
    return true;
  }

  const maxLines = Math.max(1, Math.floor(usableHeight / fontSize));
  return countLines(text, fontSize, usableWidth) <= maxLines;
};

export const getCustomTagLayout = (
  tagType: TagType,
  text: string,
  fontSize?: number,
): CustomTagLayout => {
  const printable = normalizeCustomTagText(text);
  const metrics = TAG_METRICS[tagType];
  const usableWidth = metrics.width - PADDING * 2;
  const usableHeight = metrics.height - PADDING * 2;
  const manualFontSize = metrics.fonts.includes(fontSize ?? -1)
    ? fontSize
    : undefined;
  const chosenFontSize =
    manualFontSize ??
    metrics.fonts.find((size) =>
      textFits(printable, size, usableWidth, usableHeight),
    ) ??
    metrics.fonts[metrics.fonts.length - 1];
  const maxLines = Math.max(1, Math.floor(usableHeight / chosenFontSize));

  return {
    width: metrics.width,
    height: metrics.height,
    fontSize: chosenFontSize,
    padding: PADDING,
    maxLines,
    fits: textFits(printable, chosenFontSize, usableWidth, usableHeight),
  };
};

// ^ ~ \ & — команды принтера. В тексте их убираем, чтобы этикетка не сломалась.
const escapeLine = (line: string): string => {
  return line.replace(/[\^~\\&]/g, '').split('').join('\\');
};

export const getCustomTagZpl = (
  tagType: TagType,
  text: string,
  fontSize?: number,
): string => {
  const printable = normalizeCustomTagText(text);
  const layout = getCustomTagLayout(tagType, printable, fontSize);
  const fieldWidth = layout.width - layout.padding * 2;
  const escaped = printable.split('\n').map(escapeLine).join('\\&');

  return [
    '^XA',
    '^CI28',
    `^PW${layout.width}`,
    `^LL${layout.height}`,
    `^FO${layout.padding},${layout.padding}^A@N,${layout.fontSize},${layout.fontSize},TT0003M_^FB${fieldWidth},${layout.maxLines},0,L,0^FD${escaped}^FS`,
    '~SD25',
    '^XZ',
  ].join('\n');
};
