import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/wurth-logo.png';
import { invoiceMask } from './masks/invoice/invoiceMask';

const wurth: SupplierDTO = {
  id: SupplierId.WURTH,
  name: 'Вюрт',
  code: 'WUR',
  emails: ['a.gilyuk@wuerth.by'],
  masks: [invoiceMask],
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

export default wurth;
