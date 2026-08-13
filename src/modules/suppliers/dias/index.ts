import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/dias-logo.png';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';

const dias: SupplierDTO = {
  id: SupplierId.DIAS,
  name: 'Dias',
  code: 'DIA',
  email: 'no-reply@dias.by',
  masks: [ttnVerticalMask],
  icon: {
    src: logo,
  },
};

export default dias;
