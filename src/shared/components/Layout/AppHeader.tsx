import { Layout, theme } from 'antd';

const { Header } = Layout;

export default function AppHeader() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header
      style={{
        height: 64,
        padding: 0,
        background: colorBgContainer,
        borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
      }}
    />
  );
}
