import { TagDataMap } from '../types';
import { TagType } from '../constants';

const get4x25TagLayout = ({ text }: TagDataMap[TagType.FOUR_X_TWO_FIVE]) => {
  return `
    ^XA
    ^FO200,20^A0N,20,20^FD${text}^FS
    ^BCN,100,Y,N,N^FD${text}^FS
    ^XZ
  `;
};

export default get4x25TagLayout;
