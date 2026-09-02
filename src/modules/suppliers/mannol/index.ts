import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/mannol-logo.png';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';

const mannol: SupplierDTO = {
  id: SupplierId.MANNOL,
  name: 'Маннол',
  code: 'MAN',
  emails: ['support@oem.by'],
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

export default mannol;
