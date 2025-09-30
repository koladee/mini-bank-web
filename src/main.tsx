import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { AccountsProvider } from './context/AccountsContext';
import { TransactionsProvider } from './context/TransactionsContext';
import { MetaProvider } from './context/MetaContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AccountsProvider>
        <TransactionsProvider>
          <MetaProvider>
            <RouterProvider router={router} />
          </MetaProvider>
        </TransactionsProvider>
      </AccountsProvider>
    </AuthProvider>
  </React.StrictMode>
);
