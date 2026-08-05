import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { Routes, pageNames, Pages } from '../../constants/routes';
import suppliers from '../../../modules/suppliers';
import './AppHeader.scss';

const { Header } = Layout;

const headerMenuItems = [
  {
    key: 'documents',
    label: (
      <Link to={`${Routes.documents}/${suppliers[0]?.id}`}>
        {pageNames[Pages.documents]}
      </Link>
    ),
  },
];

export default function AppHeader() {
  const { pathname } = useLocation();
  const selectedKey = pathname.startsWith(Routes.documents)
    ? 'documents'
    : undefined;

  return (
    <Header>
      <div className="app-header-logo">Расценка</div>
      {/* <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={selectedKey ? [selectedKey] : []}
        items={headerMenuItems}
        style={{ flex: 1, minWidth: 0 }}
      /> */}
    </Header>
  );
}
