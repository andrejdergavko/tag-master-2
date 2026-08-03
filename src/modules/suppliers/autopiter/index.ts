import { SupplierDTO, SupplierId } from '../../../shared/types';
import { tnVerticalMask } from './masks/tnVertical/tnVerticalMask';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';

const autopiter: SupplierDTO = {
  id: SupplierId.AUTOPITER,
  name: 'Автопитер',
  email: 'dergavko@mail.ru',
  masks: [tnVerticalMask, ttnVerticalMask],
};

export default autopiter;
