import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold text-[#4287f5]">KoladeBank</Link>
          {user && (
            <div className="hidden gap-3 text-sm md:flex">
              <Link to="/" className="hover:underline">Dashboard</Link>
              <Link to="/transfer" className="hover:underline">Transfer</Link>
              <Link to="/exchange" className="hover:underline">Exchange</Link>
              <Link to="/transactions" className="hover:underline">Transactions</Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {!user ? (
            <>
              <Link to="/login" className="underline">Login</Link>
              <Link to="/register" className="underline">Register</Link>
            </>
          ) : (
            <>
              <span className="hidden md:inline text-gray-600">{user.email}</span>
              <button
                onClick={() => { logout(); nav('/login'); }}
                className="rounded bg-[#4287f5] px-3 py-1.5 text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
