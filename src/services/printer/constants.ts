export const DEFAULT_PRINTER_NAME = 'ZDesigner GK420t';

export enum TagType {
  FOUR_X_TWO_FIVE = '4x2.5',
  FOUR_THREE_X_TWO_FIVE = '4.3x2.5',
  FIVE_EIGHT_X_THREE = '5.8x3',
}

export const DEFAULT_TAG_TYPE = TagType.FOUR_THREE_X_TWO_FIVE;

export const TAG_TYPE_LABELS: Record<TagType, string> = {
  [TagType.FOUR_X_TWO_FIVE]: '4 × 2,5',
  [TagType.FOUR_THREE_X_TWO_FIVE]: '4,3 × 2,5',
  [TagType.FIVE_EIGHT_X_THREE]: '5,8 × 3',
};
