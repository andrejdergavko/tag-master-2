import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { Routes } from '../../../constants/routes';
import suppliers from '../../../../modules/suppliers';

const { Sider } = Layout;

const ALL_KEY = 'all';

export default function AppSidebar() {
  const { supplierId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = [
    {
      key: ALL_KEY,
      label: <Link to={Routes.documents}>Все</Link>,
    },
    ...suppliers.map((supplier) => ({
      key: supplier.id,
      icon: supplier.icon ? (
        <img src={supplier.icon.src} style={supplier.icon.style} />
      ) : undefined,
      label: (
        <Link to={`${Routes.documents}/${supplier.id}`}>{supplier.name}</Link>
      ),
    })),
  ];

  return (
    <Sider
      width={200}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
      collapsedWidth={70}
    >
      <Menu
        mode="inline"
        selectedKeys={[supplierId ?? ALL_KEY]}
        style={{ height: '100%', borderInlineEnd: 0 }}
        items={menuItems}
      />
    </Sider>
  );
}
