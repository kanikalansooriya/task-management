import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful');
      navigate('/');
    } catch {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="page-shell flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="glass-card w-full max-w-md p-8">
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Task flow</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
          <p className="mt-2 text-slate-300">Sign in to continue managing your tasks effortlessly.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
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
          <button className="soft-button w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
