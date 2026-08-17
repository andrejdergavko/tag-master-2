import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/armtek-logo.png';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';

const armtek: SupplierDTO = {
  id: SupplierId.ARMTEK,
  name: 'Армтек',
  code: 'ARM',
  emails: ['service_1@armtek.by'],
  masks: [ttnVerticalMask],
  icon: {
    src: logo,
    style: {
      width: 20,
      height: 20,
      marginLeft: 5,
      marginRight: 5,
    },
  },
};

export default armtek;
