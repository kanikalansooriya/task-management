import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApiClient, clearAuth } from '../auth';
import toast, { Toaster } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
}

const emptyForm = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: '',
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const navigate = useNavigate();

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filterStatus !== 'all') params.append('status', filterStatus);
    if (filterPriority !== 'all') params.append('priority', filterPriority);
    if (sortOrder) params.append('sort', sortOrder);
    return params.toString();
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const api = createApiClient();
      const query = buildQuery();
      const response = await api.get(`/api/tasks${query ? `?${query}` : ''}`);
      setTasks(response.data);
    } catch (error: any) {
      if (error.response && [401, 403].includes(error.response.status)) {
        clearAuth();
        navigate('/login');
      } else {
        toast.error('Unable to load tasks');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filterStatus, filterPriority, sortOrder]);

  const resetForm = () => {
    setForm(emptyForm);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const api = createApiClient();
      await api.post('/api/tasks', form);
      toast.success('Task created successfully');
      resetForm();
      await fetchTasks();
    } catch (error: any) {
      if (error.response && [401, 403].includes(error.response.status)) {
        clearAuth();
        navigate('/login');
      } else {
        toast.error(error?.response?.data?.message || 'Could not create task');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this task?');
    if (!confirmed) return;

    setDeletingTaskId(id);
    try {
      const api = createApiClient();
      await api.delete(`/api/tasks/${id}`);
      toast.success('Task deleted');
      await fetchTasks();
    } catch (error: any) {
      if (error.response && [401, 403].includes(error.response.status)) {
        clearAuth();
        navigate('/login');
      } else {
        toast.error('Could not delete task');
      }
    } finally {
      setDeletingTaskId(null);
    }
  };

  const openEditModal = (task: Task) => {
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

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    setIsSubmitting(true);
    try {
      const api = createApiClient();
      await api.put(`/api/tasks/${editingTask.id}`, form);
      toast.success('Task updated successfully');
      closeEditModal();
      await fetchTasks();
    } catch (error: any) {
      if (error.response && [401, 403].includes(error.response.status)) {
        clearAuth();
        navigate('/login');
      } else {
        toast.error(error?.response?.data?.message || 'Could not update task');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const taskRows = useMemo(() => tasks, [tasks]);

  return (
    <div className="page-shell">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[32px] border p-6 shadow-xl backdrop-blur-xl md:flex-row md:items-center md:justify-between"style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)" }}>
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Task board</p>
            <h1 className="text-3xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }} >
              Tasks
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Create, search, filter, and manage tasks with style.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => navigate('/')} className="soft-button">Back to dashboard</button>
            <ThemeToggle />
          </div>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card p-6">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <input
                className="input-shell md:max-w-xs"
                placeholder="Search by title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex flex-col gap-2 md:flex-row">
                <select
                  className="input-shell w-full md:w-auto"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <select
                  className="input-shell w-full md:w-auto"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="all">All Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <select
                  className="input-shell w-full md:w-auto"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="dueDate">Due Date</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-dashed px-4 py-10 text-center text-sm"style={{
                color: "var(--text-secondary)",
                borderColor: "var(--card-border)"
              }}>
                Loading tasks...
              </div>
            ) : taskRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-sm text-slate-400">
                No tasks found for the current filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b text-sm"style={{
                      borderColor: "var(--card-border)",
                      color: "var(--text-secondary)"
                    }}>
                      <th className="py-3">Title</th>
                      <th className="py-3">Priority</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Due Date</th>
                      <th className="py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskRows.map((task) => (
                      <tr className="border-b text-sm"  style={{
                          borderColor: "var(--card-border)",
                          color: "var(--text-secondary)"
                        }}>
                        <td className="py-3"style={{ color: "var(--text-primary)"}} > {task.title}</td>
                        <td className="py-3"style={{ color: "var(--text-primary)"}} > {task.priority}</td>
                        <td className="py-3"style={{ color: "var(--text-primary)"}} > {task.status}</td>
                        <td className="py-3"style={{ color: "var(--text-primary)"}} > {task.dueDate}</td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => openEditModal(task)}
                              className="rounded-xl bg-cyan-500/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-cyan-500"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              disabled={deletingTaskId === task.id}
                              className="rounded-xl bg-rose-500/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <form onSubmit={handleCreateTask} className="glass-card p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold"style={{ color: "var(--text-primary)"}} > Create Task </h2>
                <p className="mt-1 text-sm"style={{ color: "var(--text-secondary)"}}>Add a fresh task to your board.</p>
              </div>
              <div className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">New</div>
            </div>
            <div className="space-y-3">
              <input
                className="input-shell"
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                required
              />
              <textarea
                className="input-shell min-h-[96px]"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                required
              />
              <select
                className="input-shell"
                value={form.priority}
                onChange={(e) => setForm((current) => ({ ...current, priority: e.target.value }))}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                className="input-shell"
                value={form.status}
                onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                className="input-shell"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((current) => ({ ...current, dueDate: e.target.value }))}
                required
              />
              <button className="soft-button w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isModalOpen && editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border p-6 shadow-2xl" style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)"}}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-500">Edit task</p>
                <h2 className="text-2xl font-semibold"style={{ color: "var(--text-primary)"}}>Update task details</h2>
              </div>
              <button onClick={closeEditModal} className="rounded-full px-3 py-1 text-sm"style={{ color: "var(--text-secondary)"}}>Close</button>
            </div>

            <form onSubmit={handleUpdateTask} className="space-y-3">
              <input
                className="input-shell"
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                required
              />
              <textarea
                className="input-shell min-h-[96px]"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                required
              />
              <select
                className="input-shell"
                value={form.priority}
                onChange={(e) => setForm((current) => ({ ...current, priority: e.target.value }))}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                className="input-shell"
                value={form.status}
                onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                className="input-shell"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((current) => ({ ...current, dueDate: e.target.value }))}
                required
              />
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button type="submit" className="soft-button w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Save changes'}
                </button>
                <button type="button" onClick={closeEditModal} className="rounded-2xl border border-slate-300 px-4 py-2.5 font-semibold s"style={{ borderColor: "var(--card-border)",color: "var(--text-primary)",background: "var(--card-bg)"}}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
