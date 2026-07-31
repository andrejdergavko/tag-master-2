import { ISupplier, SupplierId } from '../../../shared/types';
import masks from './masks';

const autopiter: ISupplier = {
  id: SupplierId.AUTOPITER,
  name: 'Автопитер',
  email: 'dergavko@mail.ru',
  masks,
};

export default autopiter;
