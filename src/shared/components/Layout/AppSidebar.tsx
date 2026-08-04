import { Link, useParams } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { Routes } from '../../constants/routes';
import suppliers from '../../../modules/suppliers';

const { Sider } = Layout;

export default function AppSidebar() {
  const { supplierId } = useParams();

  const menuItems = suppliers.map((supplier) => ({
    key: supplier.id,
    label: (
      <Link to={`${Routes.documents}/${supplier.id}`}>{supplier.name}</Link>
    ),
  }));

  return (
    <Sider width={200}>
      <Menu
        mode="inline"
        selectedKeys={supplierId ? [supplierId] : []}
        style={{ height: '100%', borderInlineEnd: 0 }}
        items={menuItems}
      />
    </Sider>
  );
}
