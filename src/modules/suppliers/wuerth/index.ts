import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/wuerth-logo.png';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';

const wuerth: SupplierDTO = {
  id: SupplierId.WUERTH,
  name: 'Вюрт',
  code: 'WUR',
  emails: ['erp@wuerth.by'],
  masks: [ttnVerticalMask],
  icon: {
    src: logo,
    style: {
      width: 24,
      height: 24,
      marginLeft: 3,
      marginRight: 2,
    },
  },
};

export default wuerth;
