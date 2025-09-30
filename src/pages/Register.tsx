import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ErrorBanner from '../components/ErrorBanner';
import Loading from '../components/Loading';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [err, setErr] = useState<string>();
  const [busy, setBusy] = useState(false);

  const [fieldErr, setFieldErr] = useState<{email?: string; password?: string; confirm?: string}>({});
  const [touched, setTouched] = useState<{email?: boolean; password?: boolean; confirm?: boolean}>({});

  const nav = useNavigate();

  const validate = () => {
    const fe: typeof fieldErr = {};

    if (!email) fe.email = 'Email is required';
    else if (!isEmail(email)) fe.email = 'Enter a valid email address';

    if (!password) fe.password = 'Password is required';
    else if (password.length < 6) fe.password = 'Minimum of 6 characters';

    if (!confirm) fe.confirm = 'Confirm your password';
    else if (password !== confirm) fe.confirm = 'Passwords do not match';

    setFieldErr(fe);
    return Object.keys(fe).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(undefined);
    setTouched({ email: true, password: true, confirm: true });

    if (!validate()) return;

    setBusy(true);
    try {
      await register(email, password);
      nav('/');
    } catch (e: any) {
      setErr(e?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#4287f5]">Create account</h1>

        {err && <ErrorBanner message={err} />}

        <form onSubmit={submit} className="mt-4 space-y-4" noValidate>
          <div>
            <input
              name="email"
              autoComplete="email"
              className={`w-full rounded-md border p-2 focus:outline-none focus:ring-1 ${
                touched.email && fieldErr.email
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-[#4287f5] focus:border-[#4287f5]'
              }`}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              onBlur={()=> setTouched(t => ({...t, email: true}))}
              aria-invalid={!!(touched.email && fieldErr.email)}
              aria-describedby="reg-email-error"
            />
            {touched.email && fieldErr.email && (
              <p id="reg-email-error" className="mt-1 text-xs text-red-600">{fieldErr.email}</p>
            )}
          </div>

          <div>
            <input
              name="new-password"
              autoComplete="new-password"
              className={`w-full rounded-md border p-2 focus:outline-none focus:ring-1 ${
                touched.password && fieldErr.password
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-[#4287f5] focus:border-[#4287f5]'
              }`}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              onBlur={()=> setTouched(t => ({...t, password: true}))}
              aria-invalid={!!(touched.password && fieldErr.password)}
              aria-describedby="reg-password-error"
            />
            {touched.password && fieldErr.password && (
              <p id="reg-password-error" className="mt-1 text-xs text-red-600">{fieldErr.password}</p>
            )}
          </div>

          <div>
            <input
              name="confirm-password"
              autoComplete="new-password"
              className={`w-full rounded-md border p-2 focus:outline-none focus:ring-1 ${
                touched.confirm && fieldErr.confirm
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-[#4287f5] focus:border-[#4287f5]'
              }`}
              placeholder="Confirm Password"
              type="password"
              value={confirm}
              onChange={(e)=>setConfirm(e.target.value)}
              onBlur={()=> setTouched(t => ({...t, confirm: true}))}
              aria-invalid={!!(touched.confirm && fieldErr.confirm)}
              aria-describedby="reg-confirm-error"
            />
            {touched.confirm && fieldErr.confirm && (
              <p id="reg-confirm-error" className="mt-1 text-xs text-red-600">{fieldErr.confirm}</p>
            )}
          </div>

          <button
            className="w-full rounded-md bg-[#4287f5] px-4 py-2 font-medium text-white shadow hover:bg-[#3270d1] disabled:opacity-50"
            disabled={busy}
          >
            {busy ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#4287f5] hover:underline">Login</Link>
        </div>

        {busy && <Loading />}
      </div>
    </div>
  );
}
