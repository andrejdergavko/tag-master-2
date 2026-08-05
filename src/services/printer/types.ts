import { TagType } from './constants';

export type TagDataMap = {
  [TagType.FOUR_X_TWO_FIVE]: {
    sku?: string;
    name: string;
    supplierCode: string;
    price: number;
    number: string;
  };
};

export type TagData<T extends TagType> = TagDataMap[T];
