import { SupplierDTO, SupplierId } from '../../../shared/types';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';
import logo from '../../../assets/almik-logo.jpg';

const almik: SupplierDTO = {
  id: SupplierId.ALMIK,
  name: 'Алмик',
  code: 'ALM',
  emails: ['almikauto@mail.ru'],
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

export default almik;
