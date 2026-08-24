import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/pilot-logo.png';
import { attachmentMask } from './masks/attachment/ttnVerticalMask';

const pilot: SupplierDTO = {
  id: SupplierId.PILOT,
  name: 'Пилот',
  code: 'PIL',
  emails: ['ekaterina@lampa.by'],
  masks: [attachmentMask],
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

export default pilot;
