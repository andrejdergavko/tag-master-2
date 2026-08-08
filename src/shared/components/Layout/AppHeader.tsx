import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import {
  BorderOutlined,
  CloseOutlined,
  MinusOutlined,
  SettingOutlined,
  SwitcherOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Routes } from '../../constants/routes';
import './AppHeader.scss';

const { Header } = Layout;

export default function AppHeader() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    void window.electron.window.isMaximized().then(setIsMaximized);
    return window.electron.window.onMaximizedChange(setIsMaximized);
  }, []);

  return (
    <Header className="app-header">
      <div className="app-header-logo">Расценка</div>
      <div className="app-header-actions">
        <Link to={Routes.settings} className="app-header-no-drag">
          <SettingOutlined className="app-header-settings" />
        </Link>
        <div className="app-header-window-controls">
          <button
            type="button"
            className="app-header-window-button"
            aria-label="Свернуть"
            onClick={() => void window.electron.window.minimize()}
          >
            <MinusOutlined />
          </button>
          <button
            type="button"
            className="app-header-window-button"
            aria-label={isMaximized ? 'Восстановить' : 'Развернуть'}
            onClick={() => void window.electron.window.maximize()}
          >
            {isMaximized ? <SwitcherOutlined /> : <BorderOutlined />}
          </button>
          <button
            type="button"
            className="app-header-window-button app-header-window-button-close"
            aria-label="Закрыть"
            onClick={() => void window.electron.window.close()}
          >
            <CloseOutlined />
          </button>
        </div>
      </div>
    </Header>
  );
}
