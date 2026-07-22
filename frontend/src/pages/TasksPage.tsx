import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApiClient, clearAuth } from '../auth';
import toast, { Toaster } from 'react-hot-toast';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filterStatus !== 'all') params.append('status', filterStatus);
    if (filterPriority !== 'all') params.append('priority', filterPriority);
    if (sortOrder) params.append('sort', sortOrder);
    return params.toString();
  };

  const navigate = useNavigate();

  const fetchTasks = async () => {
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
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filterStatus, filterPriority, sortOrder]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const api = createApiClient();
      await api.post('/api/tasks', { title, description, priority, status, dueDate });
      toast.success('Task created');
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('Pending');
      setDueDate('');
      fetchTasks();
    } catch (error: any) {
      if (error.response && [401, 403].includes(error.response.status)) {
        clearAuth();
        navigate('/login');
      } else {
        toast.error(error?.response?.data?.message || 'Could not create task');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const api = createApiClient();
      await api.delete(`/api/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error: any) {
      if (error.response && [401, 403].includes(error.response.status)) {
        clearAuth();
        navigate('/login');
      } else {
        toast.error('Could not delete task');
      }
    }
  };

  const taskRows = useMemo(() => {
    return tasks;
  }, [tasks]);

  return (
    <div className="page-shell">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[32px] border border-white/10 bg-slate-900/50 p-6 shadow-[0_20px_60px_-15px_rgba(2,8,23,0.9)] backdrop-blur-xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Task board</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Tasks</h1>
          <p className="mt-1 text-slate-300">Create, search, filter, and manage tasks with style.</p>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card p-6">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-sm text-slate-400">
                    <th className="py-3">Title</th>
                    <th className="py-3">Priority</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Due Date</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskRows.map((task) => (
                    <tr key={task.id} className="border-b border-white/10 transition hover:bg-white/5">
                      <td className="py-3 text-slate-100">{task.title}</td>
                      <td className="py-3 text-slate-100">{task.priority}</td>
                      <td className="py-3 text-slate-100">{task.status}</td>
                      <td className="py-3 text-slate-100">{task.dueDate}</td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="rounded-xl bg-rose-500/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <form onSubmit={handleCreateTask} className="glass-card p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Create Task</h2>
            <div className="space-y-3">
              <input
                className="input-shell"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="input-shell min-h-[96px]"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <select
                className="input-shell"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                className="input-shell"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                className="input-shell"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
              <button className="soft-button w-full">
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
