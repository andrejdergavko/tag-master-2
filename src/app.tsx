import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Routes as RoutesEnum } from './shared/constants/routes';
import DocumentsPage from './pages/DocumentsPage';
import DocumentPage from './pages/DocumentPage';
import PrintTagsPage from './pages/PrintTagsPage/PrintTagsPage';
import SettingsPage from './pages/SettingsPage';
import AppLayout from './shared/components/Layout/AppLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd/es';
import { theme } from './shared/theme';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <Router>
          <Routes>
            <Route element={<AppLayout />} path={RoutesEnum.root}>
              <Route
                path={`${RoutesEnum.documents}/:supplierId/:documentId/print-tags`}
                element={<PrintTagsPage />}
              />
              <Route
                path={`${RoutesEnum.documents}/:supplierId/:documentId`}
                element={<DocumentPage />}
              />
              <Route
                path={`${RoutesEnum.documents}/:supplierId`}
                element={<DocumentsPage />}
              />
              <Route path={RoutesEnum.settings} element={<SettingsPage />} />
            </Route>
          </Routes>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

const root = createRoot(document.body);
root.render(<App />);
