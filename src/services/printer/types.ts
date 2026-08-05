import { TagType } from './constants';

export type TagDataMap = {
  [TagType.FOUR_X_TWO_FIVE]: {
    text: string;
  };
};

export type TagData<T extends TagType> = TagDataMap[T];
