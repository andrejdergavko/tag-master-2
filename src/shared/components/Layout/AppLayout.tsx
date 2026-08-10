import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import AppHeader from './AppHeader';

export default function AppLayout() {
  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <AppHeader />
      <Outlet />
    </Layout>
  );
}
