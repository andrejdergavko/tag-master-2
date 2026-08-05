import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';

import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar/AppSidebar';

const { Content, Footer } = Layout;

export default function AppLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const currentYear = new Date().getFullYear();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              margin: '16px 0',
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
