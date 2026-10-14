import { SupplierDTO, SupplierId } from '../../../shared/types';
import logo from '../../../assets/forward-motors-logo.png';
import { goodsSectionMask } from './masks/goodsSection/goodsSectionMask';

const forwardMotors: SupplierDTO = {
  id: SupplierId.FORWARD_MOTORS,
  name: 'Форвард Моторс',
  code: 'FM',
  emails: ['robot@forward-motors.com'],
  masks: [goodsSectionMask],
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

export default forwardMotors;
