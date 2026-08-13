import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/amazis-logo.png';
import { ttnVerticalMask } from './masks/ttnVertical/ttnVerticalMask';

const amazis: SupplierDTO = {
  id: SupplierId.AMAZIS,
  name: 'Amazis',
  code: 'AMZ',
  email: 'robot@amazis.by',
  masks: [ttnVerticalMask],
  icon: {
    src: logo,
    style: {
      width: 24,
      height: 20,
      marginLeft: 3,
      marginRight: 2,
    },
  },
};

export default amazis;
