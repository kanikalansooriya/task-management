import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { setAuth, isAuthenticated } from '../auth';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      setAuth(response.data.token, response.data.user);
      toast.success('Login successful');
      navigate('/');
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message || 'Invalid email or password');
      } else {
        setError('Server unavailable. Please try again later.');
      }
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell flex items-center justify-center p-2 sm:p-4">
      <Toaster position="top-right" />
      <div className="glass-card w-full max-w-md p-6 sm:p-8">
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Task flow</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">Sign in to continue managing your tasks effortlessly.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="rounded-2xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">{error}</p>}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">Email</label>
            <input
              className="input-shell"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">Password</label>
            <input
              className="input-shell"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="soft-button w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
