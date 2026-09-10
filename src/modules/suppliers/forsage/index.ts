import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/forsage-logo.png';
import { applicationMask } from './masks/application/applicationMask';
import { applicationBigMask } from './masks/applicationBig/applicationBigMask';
import { applicationKingMask } from './masks/applicationKing/applicationKingMask';

const forsage: SupplierDTO = {
  id: SupplierId.FORSAGE,
  name: 'Форсаж',
  code: 'FORS',
  emails: ['opt@th-tool.by'],
  icon: {
    src: logo,
    style: {
      width: 26,
      height: 23,
      marginLeft: 2,
      marginRight: 1,
    },
  },
  masks: [applicationBigMask, applicationKingMask, applicationMask],
};

export default forsage;
