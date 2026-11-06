import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/stab-logo.png';
import { applicationMask } from './masks/application/applicationMask';

const stab: SupplierDTO = {
  id: SupplierId.STAB,
  name: 'Стаб',
  code: 'STAB',
  emails: ['sale@stab.by'],
  masks: [applicationMask],
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

export default stab;
