import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/auto1-logo.png';
import { applicationMask } from './masks/application/applicationMask';

const auto1: SupplierDTO = {
  id: SupplierId.AUTO1,
  name: 'Авто1',
  code: 'A1',
  emails: ['zakaz@autospace.by'],
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

export default auto1;
