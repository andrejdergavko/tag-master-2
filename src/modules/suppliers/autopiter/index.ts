import { SupplierDTO, SupplierId } from '../../../shared/types';
import { tnVerticalMask } from './masks/tnVertical/tnVerticalMask';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';
import autopiterLogo from '../../../assets/autopiter-logo.png';

const autopiter: SupplierDTO = {
  id: SupplierId.AUTOPITER,
  name: 'Автопитер',
  code: 'APTR',
  email: 'dergavko@mail.ru',
  masks: [tnVerticalMask, ttnVerticalMask],
  icon: autopiterLogo,
};

export default autopiter;
