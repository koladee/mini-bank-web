import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Transfer from './pages/Transfer';
import Exchange from './pages/Exchange';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Loading from './components/Loading';

function Guard({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RootLayout() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-5xl">
        <Outlet />
      </div>
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: (
      <Guard>
        <RootLayout />
      </Guard>
    ),
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/transactions', element: <Transactions /> },
      { path: '/transfer', element: <Transfer /> },
      { path: '/exchange', element: <Exchange /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
]);
