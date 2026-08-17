import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/shate-m-logo.png';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';

const shateM: SupplierDTO = {
  id: SupplierId.SHATE_M,
  name: 'Шате-М',
  code: 'STM',
  emails: ['webshop@shate-m.com'],
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

export default shateM;
