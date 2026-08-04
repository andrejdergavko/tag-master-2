import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Routes as RoutesEnum } from './shared/constants/routes';
import DocumentsPage from './pages/DocumentsPage';
import DocumentPage from './pages/DocumentPage';
import AppLayout from './shared/components/Layout/AppLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<AppLayout />} path={RoutesEnum.root}>
            <Route
              path={`${RoutesEnum.documents}/:supplierId/:documentId`}
              element={<DocumentPage />}
            />
            <Route
              path={`${RoutesEnum.documents}/:supplierId`}
              element={<DocumentsPage />}
            />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

const root = createRoot(document.body);
root.render(<App />);
