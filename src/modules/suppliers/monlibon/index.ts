import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/monlibon-logo.png';
import { packingListMask } from './masks/packingList/packingListMask';

const monlibon: SupplierDTO = {
  id: SupplierId.MONLIBON,
  name: 'Monlibon',
  code: 'MON',
  email: 'noreply@monlibon.by',
  masks: [packingListMask],
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

export default monlibon;
