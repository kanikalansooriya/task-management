import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createApiClient, clearAuth, getUser } from '../auth';
import ThemeToggle from '../components/ThemeToggle';
const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const api = createApiClient();
                const [tasksResponse, statsResponse] = await Promise.all([
                    api.get('/api/tasks?sort=newest'),
                    api.get('/api/dashboard'),
                ]);
                setTasks(tasksResponse.data);
                setStats(statsResponse.data);
            }
            catch (error) {
                if (error.response && [401, 403].includes(error.response.status)) {
                    clearAuth();
                    navigate('/login');
                }
                else {
                    setTasks([]);
                }
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [navigate]);
    const cards = [
        { label: 'Total Tasks', value: stats.totalTasks, accent: 'from-cyan-500 to-sky-500' },
        { label: 'Pending', value: stats.pendingTasks, accent: 'from-amber-500 to-orange-500' },
        { label: 'In Progress', value: stats.inProgressTasks, accent: 'from-violet-500 to-fuchsia-500' },
        { label: 'Completed', value: stats.completedTasks, accent: 'from-emerald-500 to-green-500' },
        { label: 'Overdue', value: stats.overdueTasks, accent: 'from-rose-500 to-amber-500' },
    ];
    const user = getUser();
    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };
    return (_jsx("div", { className: "page-shell", children: _jsxs("div", { className: "mx-auto max-w-6xl", children: [_jsxs("div", { className: "mb-8 flex flex-col gap-4 rounded-[32px] border p-6 shadow-xl backdrop-blur-xl md:flex-row md:items-center md:justify-between", style: {
                        background: "var(--card-bg)",
                        borderColor: "var(--card-border)"
                    }, children: [_jsxs("div", { children: [_jsx("p", { className: "mb-2 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400", children: "Welcome back" }), _jsx("h1", { className: "text-3xl font-semibold tracking-tight text-[var(--text-primary)]", children: "Dashboard" }), _jsx("p", { className: "mt-1 text-[var(--text-secondary)]", children: "Overview of your task activity and momentum." }), user && (_jsxs("p", { className: "mt-2 text-sm text-[var(--text-secondary)]", children: ["Signed in as ", user.name] }))] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx(ThemeToggle, {}), _jsx(Link, { to: "/tasks", className: "soft-button inline-flex items-center justify-center", children: "Manage Tasks" }), _jsx("button", { onClick: handleLogout, className: "rounded-2xl bg-rose-500 px-4 py-2.5 font-semibold text-white transition hover:bg-rose-600", children: "Logout" })] })] }), _jsx("div", { className: "mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5", children: cards.map((card) => (_jsxs("div", { className: "glass-card overflow-hidden transition duration-300 hover:-translate-y-1", children: [_jsx("div", { className: `h-1 w-full bg-gradient-to-r ${card.accent}` }), _jsxs("div", { className: "p-5", children: [_jsx("p", { className: "text-sm text-[var(--text-secondary)]", children: card.label }), _jsx("p", { className: "mt-2 text-3xl font-semibold text-[var(--text-primary)]", children: card.value })] })] }, card.label))) }), _jsxs("div", { className: "glass-card p-6", children: [_jsxs("div", { className: "mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-[var(--text-primary)]", children: "Recent Tasks" }), _jsx("p", { className: "text-sm text-[var(--text-secondary)]", children: "The latest updates from your workspace." })] }), _jsx(Link, { to: "/tasks", className: "text-sm font-medium text-cyan-400", children: "Open task board" })] }), isLoading ? (_jsx("div", { className: "rounded-2xl border border-dashed border-cyan-400/30 bg-cyan-500/10 px-4 py-10 text-center text-sm text-[var(--text-secondary)]", children: "Loading dashboard..." })) : tasks.length === 0 ? (_jsx("div", { className: "rounded-2xl border border-dashed px-4 py-10 text-center text-sm text-[var(--text-secondary)]", style: {
                                borderColor: "var(--card-border)"
                            }, children: "No tasks yet. Create your first task from the task board." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-left", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b text-sm text-[var(--text-secondary)]", style: {
                                                borderColor: "var(--card-border)"
                                            }, children: [_jsx("th", { className: "py-3", children: "Title" }), _jsx("th", { className: "py-3", children: "Priority" }), _jsx("th", { className: "py-3", children: "Status" }), _jsx("th", { className: "py-3", children: "Due Date" })] }) }), _jsx("tbody", { children: tasks.slice(0, 5).map((task) => (_jsxs("tr", { className: "border-b transition hover:bg-black/5 dark:hover:bg-white/5", style: {
                                                borderColor: "var(--card-border)"
                                            }, children: [_jsx("td", { className: "py-3 text-[var(--text-primary)]", children: task.title }), _jsx("td", { className: "py-3 text-[var(--text-primary)]", children: task.priority }), _jsx("td", { className: "py-3 text-[var(--text-primary)]", children: task.status }), _jsx("td", { className: "py-3 text-[var(--text-primary)]", children: task.dueDate })] }, task.id))) })] }) }))] })] }) }));
};
export default DashboardPage;
