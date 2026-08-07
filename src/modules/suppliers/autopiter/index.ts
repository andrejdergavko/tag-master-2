import { SupplierDTO, SupplierId } from '../../../shared/types';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';
import logo from '../../../assets/autopiter-logo.png';

const autopiter: SupplierDTO = {
  id: SupplierId.AUTOPITER,
  name: 'Автопитер',
  code: 'APTR',
  email: 'autopiter@autopiter.ru',
  masks: [ttnVerticalMask],
  icon: {
    src: logo,
    style: {
      width: 30,
      height: 30,
    },
  },
};

export default autopiter;
