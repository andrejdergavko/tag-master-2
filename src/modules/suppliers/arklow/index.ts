import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/arklow-logo.png';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';

const arklow: SupplierDTO = {
  id: SupplierId.ARKLOW,
  name: 'Арклов',
  code: 'ARK',
  emails: ['info@ussrauto.by'],
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

export default arklow;
