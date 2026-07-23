import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const handleLogin = async (e) => {
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
        }
        catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Invalid email or password');
            }
            else {
                setError('Server unavailable. Please try again later.');
            }
            toast.error(error.response?.data?.message || 'Login failed');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "page-shell flex items-center justify-center p-2 sm:p-4", children: [_jsx(Toaster, { position: "top-right" }), _jsxs("div", { className: "glass-card w-full max-w-md p-6 sm:p-8", children: [_jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "mb-2 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300", children: "Task flow" }), _jsx("h1", { className: "text-3xl font-semibold tracking-tight text-white", children: "Welcome back" }), _jsx("p", { className: "mt-2 text-sm leading-6 text-slate-300", children: "Sign in to continue managing your tasks effortlessly." })] }), _jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [error && _jsx("p", { className: "rounded-2xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-400", children: error }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm font-medium text-slate-200", children: "Email" }), _jsx("input", { className: "input-shell", type: "email", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm font-medium text-slate-200", children: "Password" }), _jsx("input", { className: "input-shell", type: "password", value: password, onChange: (e) => setPassword(e.target.value) })] }), _jsx("button", { className: "soft-button w-full", type: "submit", disabled: isSubmitting, children: isSubmitting ? 'Signing in...' : 'Login' })] })] })] }));
};
export default LoginPage;
