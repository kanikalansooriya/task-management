import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApiClient, clearAuth } from '../auth';
import toast, { Toaster } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';
const emptyForm = {
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
};
const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const navigate = useNavigate();
    const buildQuery = () => {
        const params = new URLSearchParams();
        if (search)
            params.append('search', search);
        if (filterStatus !== 'all')
            params.append('status', filterStatus);
        if (filterPriority !== 'all')
            params.append('priority', filterPriority);
        if (sortOrder)
            params.append('sort', sortOrder);
        return params.toString();
    };
    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const api = createApiClient();
            const query = buildQuery();
            const response = await api.get(`/api/tasks${query ? `?${query}` : ''}`);
            setTasks(response.data);
        }
        catch (error) {
            if (error.response && [401, 403].includes(error.response.status)) {
                clearAuth();
                navigate('/login');
            }
            else {
                toast.error('Unable to load tasks');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchTasks();
    }, [search, filterStatus, filterPriority, sortOrder]);
    const resetForm = () => {
        setForm(emptyForm);
    };
    const handleCreateTask = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const api = createApiClient();
            await api.post('/api/tasks', form);
            toast.success('Task created successfully');
            resetForm();
            await fetchTasks();
        }
        catch (error) {
            if (error.response && [401, 403].includes(error.response.status)) {
                clearAuth();
                navigate('/login');
            }
            else {
                toast.error(error?.response?.data?.message || 'Could not create task');
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Delete this task?');
        if (!confirmed)
            return;
        setDeletingTaskId(id);
        try {
            const api = createApiClient();
            await api.delete(`/api/tasks/${id}`);
            toast.success('Task deleted');
            await fetchTasks();
        }
        catch (error) {
            if (error.response && [401, 403].includes(error.response.status)) {
                clearAuth();
                navigate('/login');
            }
            else {
                toast.error('Could not delete task');
            }
        }
        finally {
            setDeletingTaskId(null);
        }
    };
    const openEditModal = (task) => {
        setEditingTask(task);
        setForm({
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate,
        });
        setIsModalOpen(true);
    };
    const closeEditModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        resetForm();
    };
    const handleUpdateTask = async (e) => {
        e.preventDefault();
        if (!editingTask)
            return;
        setIsSubmitting(true);
        try {
            const api = createApiClient();
            await api.put(`/api/tasks/${editingTask.id}`, form);
            toast.success('Task updated successfully');
            closeEditModal();
            await fetchTasks();
        }
        catch (error) {
            if (error.response && [401, 403].includes(error.response.status)) {
                clearAuth();
                navigate('/login');
            }
            else {
                toast.error(error?.response?.data?.message || 'Could not update task');
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const taskRows = useMemo(() => tasks, [tasks]);
    return (_jsxs("div", { className: "page-shell", children: [_jsx(Toaster, { position: "top-right" }), _jsxs("div", { className: "mx-auto max-w-7xl", children: [_jsxs("div", { className: "mb-6 flex flex-col gap-4 rounded-[32px] border p-6 shadow-xl backdrop-blur-xl md:flex-row md:items-center md:justify-between", style: {
                            background: "var(--card-bg)",
                            borderColor: "var(--card-border)"
                        }, children: [_jsxs("div", { children: [_jsx("p", { className: "mb-2 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300", children: "Task board" }), _jsx("h1", { className: "text-3xl font-semibold tracking-tight", style: { color: "var(--text-primary)" }, children: "Tasks" }), _jsx("p", { style: { color: "var(--text-secondary)" }, children: "Create, search, filter, and manage tasks with style." })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx("button", { onClick: () => navigate('/'), className: "soft-button", children: "Back to dashboard" }), _jsx(ThemeToggle, {})] })] }), _jsxs("div", { className: "mb-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]", children: [_jsxs("div", { className: "glass-card p-6", children: [_jsxs("div", { className: "mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between", children: [_jsx("input", { className: "input-shell md:max-w-xs", placeholder: "Search by title", value: search, onChange: (e) => setSearch(e.target.value) }), _jsxs("div", { className: "flex flex-col gap-2 md:flex-row", children: [_jsxs("select", { className: "input-shell w-full md:w-auto", value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "Pending", children: "Pending" }), _jsx("option", { value: "In Progress", children: "In Progress" }), _jsx("option", { value: "Completed", children: "Completed" })] }), _jsxs("select", { className: "input-shell w-full md:w-auto", value: filterPriority, onChange: (e) => setFilterPriority(e.target.value), children: [_jsx("option", { value: "all", children: "All Priority" }), _jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High" })] }), _jsxs("select", { className: "input-shell w-full md:w-auto", value: sortOrder, onChange: (e) => setSortOrder(e.target.value), children: [_jsx("option", { value: "newest", children: "Newest" }), _jsx("option", { value: "oldest", children: "Oldest" }), _jsx("option", { value: "dueDate", children: "Due Date" })] })] })] }), isLoading ? (_jsx("div", { className: "rounded-2xl border border-dashed px-4 py-10 text-center text-sm", style: {
                                            color: "var(--text-secondary)",
                                            borderColor: "var(--card-border)"
                                        }, children: "Loading tasks..." })) : taskRows.length === 0 ? (_jsx("div", { className: "rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-sm text-slate-400", children: "No tasks found for the current filters." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-left", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b text-sm", style: {
                                                            borderColor: "var(--card-border)",
                                                            color: "var(--text-secondary)"
                                                        }, children: [_jsx("th", { className: "py-3", children: "Title" }), _jsx("th", { className: "py-3", children: "Priority" }), _jsx("th", { className: "py-3", children: "Status" }), _jsx("th", { className: "py-3", children: "Due Date" }), _jsx("th", { className: "py-3", children: "Action" })] }) }), _jsx("tbody", { children: taskRows.map((task) => (_jsxs("tr", { className: "border-b text-sm", style: {
                                                            borderColor: "var(--card-border)",
                                                            color: "var(--text-secondary)"
                                                        }, children: [_jsxs("td", { className: "py-3", style: { color: "var(--text-primary)" }, children: [" ", task.title] }), _jsxs("td", { className: "py-3", style: { color: "var(--text-primary)" }, children: [" ", task.priority] }), _jsxs("td", { className: "py-3", style: { color: "var(--text-primary)" }, children: [" ", task.status] }), _jsxs("td", { className: "py-3", style: { color: "var(--text-primary)" }, children: [" ", task.dueDate] }), _jsx("td", { className: "py-3", children: _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: () => openEditModal(task), className: "rounded-xl bg-cyan-500/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-cyan-500", children: "Edit" }), _jsx("button", { onClick: () => handleDelete(task.id), disabled: deletingTaskId === task.id, className: "rounded-xl bg-rose-500/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-70", children: deletingTaskId === task.id ? 'Deleting...' : 'Delete' })] }) })] }))) })] }) }))] }), _jsxs("form", { onSubmit: handleCreateTask, className: "glass-card p-6", children: [_jsxs("div", { className: "mb-4 flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold", style: { color: "var(--text-primary)" }, children: " Create Task " }), _jsx("p", { className: "mt-1 text-sm", style: { color: "var(--text-secondary)" }, children: "Add a fresh task to your board." })] }), _jsx("div", { className: "rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300", children: "New" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { className: "input-shell", placeholder: "Task title", value: form.title, onChange: (e) => setForm((current) => ({ ...current, title: e.target.value })), required: true }), _jsx("textarea", { className: "input-shell min-h-[96px]", placeholder: "Description", value: form.description, onChange: (e) => setForm((current) => ({ ...current, description: e.target.value })), required: true }), _jsxs("select", { className: "input-shell", value: form.priority, onChange: (e) => setForm((current) => ({ ...current, priority: e.target.value })), children: [_jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High" })] }), _jsxs("select", { className: "input-shell", value: form.status, onChange: (e) => setForm((current) => ({ ...current, status: e.target.value })), children: [_jsx("option", { value: "Pending", children: "Pending" }), _jsx("option", { value: "In Progress", children: "In Progress" }), _jsx("option", { value: "Completed", children: "Completed" })] }), _jsx("input", { className: "input-shell", type: "date", value: form.dueDate, onChange: (e) => setForm((current) => ({ ...current, dueDate: e.target.value })), required: true }), _jsx("button", { className: "soft-button w-full", disabled: isSubmitting, children: isSubmitting ? 'Saving...' : 'Add Task' })] })] })] })] }), isModalOpen && editingTask && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm", children: _jsxs("div", { className: "w-full max-w-lg rounded-[28px] border p-6 shadow-2xl", style: {
                        background: "var(--card-bg)",
                        borderColor: "var(--card-border)"
                    }, children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.25em] text-cyan-500", children: "Edit task" }), _jsx("h2", { className: "text-2xl font-semibold", style: { color: "var(--text-primary)" }, children: "Update task details" })] }), _jsx("button", { onClick: closeEditModal, className: "rounded-full px-3 py-1 text-sm", style: { color: "var(--text-secondary)" }, children: "Close" })] }), _jsxs("form", { onSubmit: handleUpdateTask, className: "space-y-3", children: [_jsx("input", { className: "input-shell", placeholder: "Task title", value: form.title, onChange: (e) => setForm((current) => ({ ...current, title: e.target.value })), required: true }), _jsx("textarea", { className: "input-shell min-h-[96px]", placeholder: "Description", value: form.description, onChange: (e) => setForm((current) => ({ ...current, description: e.target.value })), required: true }), _jsxs("select", { className: "input-shell", value: form.priority, onChange: (e) => setForm((current) => ({ ...current, priority: e.target.value })), children: [_jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High" })] }), _jsxs("select", { className: "input-shell", value: form.status, onChange: (e) => setForm((current) => ({ ...current, status: e.target.value })), children: [_jsx("option", { value: "Pending", children: "Pending" }), _jsx("option", { value: "In Progress", children: "In Progress" }), _jsx("option", { value: "Completed", children: "Completed" })] }), _jsx("input", { className: "input-shell", type: "date", value: form.dueDate, onChange: (e) => setForm((current) => ({ ...current, dueDate: e.target.value })), required: true }), _jsxs("div", { className: "flex flex-col gap-3 pt-2 sm:flex-row", children: [_jsx("button", { type: "submit", className: "soft-button w-full sm:w-auto", disabled: isSubmitting, children: isSubmitting ? 'Updating...' : 'Save changes' }), _jsx("button", { type: "button", onClick: closeEditModal, className: "rounded-2xl border border-slate-300 px-4 py-2.5 font-semibold s", style: { borderColor: "var(--card-border)", color: "var(--text-primary)", background: "var(--card-bg)" }, children: "Cancel" })] })] })] }) }))] }));
};
export default TasksPage;
