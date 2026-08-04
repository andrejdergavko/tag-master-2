import { Layout, theme } from 'antd';
import { useLocation } from 'react-router-dom';

const { Header } = Layout;

export default function AppHeader() {
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header
      style={{
        height: 64,
        padding: '0 24px',
        background: colorBgContainer,
        borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {location.pathname}
    </Header>
  );
}
