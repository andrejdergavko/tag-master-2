import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { Routes } from '../../../constants/routes';
import suppliers from '../../../../modules/suppliers';

const { Sider } = Layout;

export default function AppSidebar() {
  const { supplierId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = [...suppliers, ...suppliers].map((supplier) => ({
    key: supplier.id,
    icon: supplier.icon ? (
      <img src={supplier.icon} alt="" width={26} height={26} />
    ) : undefined,
    label: (
      <Link to={`${Routes.documents}/${supplier.id}`}>{supplier.name}</Link>
    ),
  }));

  return (
    <Sider
      width={200}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
    >
      <Menu
        mode="inline"
        selectedKeys={supplierId ? [supplierId] : []}
        style={{ height: '100%', borderInlineEnd: 0 }}
        items={menuItems}
      />
    </Sider>
  );
}
