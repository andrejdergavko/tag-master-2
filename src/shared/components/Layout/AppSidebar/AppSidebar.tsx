import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { Routes } from '../../../constants/routes';
import suppliers from '../../../../modules/suppliers';
import './AppSidebar.scss';

const { Sider } = Layout;

export default function AppSidebar() {
  const { supplierId } = useParams();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = suppliers.map((supplier) => ({
    key: supplier.id,
    label: (
      <Link to={`${Routes.documents}/${supplier.id}`}>{supplier.name}</Link>
    ),
  }));

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="app-sidebar-title">Расценка</div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={supplierId ? [supplierId] : []}
        items={menuItems}
      />
    </Sider>
  );
}
