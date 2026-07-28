import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import { Routes, Pages, pageNames } from '../../constants/routes';

const { Sider } = Layout;

const items: MenuProps['items'] = [
  {
    key: Routes.invoices,
    label: <Link to={Routes.invoices}>{pageNames[Pages.invoices]}</Link>,
  },
];

export default function AppSidebar() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const location = useLocation();

  return (
    <Sider
      width={240}
      style={{
        background: colorBgContainer,
        borderRight: '1px solid rgba(5, 5, 5, 0.06)',
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderInlineEnd: 0 }}
        items={items}
      />
    </Sider>
  );
}
