import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  MemoryRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { Routes as RoutesEnum } from './shared/constants/routes';
import DocumentsPage from './pages/DocumentsPage';
import DocumentPage from './pages/DocumentPage';
import PrintTagsPage from './pages/PrintTagsPage/PrintTagsPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import AppLayout from './shared/components/Layout/AppLayout';
import DocumentsLayout from './shared/components/Layout/DocumentsLayout';
import PlainLayout from './shared/components/Layout/PlainLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd/es';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { theme } from './shared/theme';

dayjs.locale('ru');

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme} locale={ruRU}>
        <Router>
          <Routes>
            <Route element={<AppLayout />} path={RoutesEnum.root}>
              <Route
                index
                element={<Navigate to={RoutesEnum.documents} replace />}
              />
              <Route
                path={RoutesEnum.documents}
                element={<DocumentsLayout />}
              >
                <Route index element={<DocumentsPage />} />
                <Route
                  path=":supplierId/:documentId/print-tags"
                  element={<PrintTagsPage />}
                />
                <Route
                  path=":supplierId/:documentId"
                  element={<DocumentPage />}
                />
                <Route path=":supplierId" element={<DocumentsPage />} />
              </Route>
              <Route element={<PlainLayout />}>
                <Route
                  path={RoutesEnum.products}
                  element={<ProductsPage />}
                />
                <Route
                  path={RoutesEnum.settings}
                  element={<SettingsPage />}
                />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

const root = createRoot(document.body);
root.render(<App />);
