import { Layout, theme } from 'antd';
import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
// import { TagType } from '../../../services/printer/constants';

const { Header } = Layout;

export default function AppHeader() {
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // const handlePrint = () => {
  //   window.electron.printer.printTags(TagType.FOUR_X_TWO_FIVE, [
  //     {
  //       sku: '3302-234234234',
  //       name: 'Муфта синхронизатора 5 передачи КПП, страна происхождения - РОССИЯ',
  //       price: 33.4,
  //       supplierCode: 'APTR',
  //       number: '334',
  //     },
  //   ]);
  // };

  // useEffect(() => {
  //   handlePrint();
  // }, []);

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
      {/* {location.pathname} */}
    </Header>
  );
}
