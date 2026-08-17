import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/dias-logo.png';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';

const dias: SupplierDTO = {
  id: SupplierId.DIAS,
  name: 'Диас',
  code: 'DIA',
  emails: ['no-reply@dias.by'],
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

export default dias;
