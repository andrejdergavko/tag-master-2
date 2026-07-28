import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Routes as RoutesEnum } from './shared/constants/routes';
import InvoicesPage from './pages/InvoicesPage';
import AppLayout from './shared/components/Layout/AppLayout';

const root = createRoot(document.body);
root.render(
  <Router>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={RoutesEnum.invoices} element={<InvoicesPage />} />
      </Route>
    </Routes>
  </Router>,
);
