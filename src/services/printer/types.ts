import { TagType } from './constants';

export type TagDataMap = {
  [TagType.FOUR_X_TWO_FIVE]: {
    name: string;
    price: number;
    supplierCode: string;
    number: string;
    sku?: string;
  };
};

export type TagData<T extends TagType> = TagDataMap[T];
