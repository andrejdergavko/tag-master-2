import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/motex-logo.png';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';

const motex: SupplierDTO = {
  id: SupplierId.MOTEX,
  name: 'Мотекс',
  code: 'MOT',
  emails: ['tbelenik@motex.by', 'echernyavskaya@motex.by'],
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

export default motex;
