import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/forsage-logo.png';
import { applicationMask } from './masks/application/applicationMask';

const forsage: SupplierDTO = {
  id: SupplierId.FORSAGE,
  name: 'Forsage',
  code: 'FORS',
  email: 'opt@th-tool.by',
  icon: {
    src: logo,
    style: {
      width: 26,
      height: 23,
      marginLeft: 2,
      marginRight: 1,
    },
  },
  masks: [applicationMask],
};

export default forsage;
