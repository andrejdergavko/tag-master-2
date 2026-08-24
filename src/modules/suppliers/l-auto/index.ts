import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/l-auto-logo.png';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';

const lAuto: SupplierDTO = {
  id: SupplierId.L_AUTO,
  name: 'Л-Авто',
  code: 'LAUT',
  emails: ['report@l-auto.by'],
  masks: [ttnVerticalMask],
  icon: {
    src: logo,
    style: {
      width: 20,
      height: 20,
      marginLeft: 4,
      marginRight: 4,
    },
  },
};

export default lAuto;
