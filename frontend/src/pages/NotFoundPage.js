import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
const NotFoundPage = () => {
    const navigate = useNavigate();
    return (_jsx("div", { className: "page-shell flex items-center justify-center px-4", children: _jsxs("div", { className: "glass-card max-w-md p-8 text-center", children: [_jsx("p", { className: "text-sm font-medium uppercase tracking-[0.3em] text-cyan-300", children: "Oops" }), _jsx("h1", { className: "mt-3 text-5xl font-semibold text-white", children: "404" }), _jsx("p", { className: "mt-3 text-slate-300", children: "The page you are looking for does not exist." }), _jsxs("div", { className: "mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "soft-button", children: "Go back" }), _jsx("button", { onClick: () => navigate('/'), className: "rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 font-semibold text-slate-100 transition hover:bg-white/20", children: "Go home" })] })] }) }));
};
export default NotFoundPage;
