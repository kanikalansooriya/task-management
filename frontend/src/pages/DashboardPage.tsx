import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
}

const DashboardPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data);
      } catch {
        setTasks([]);
      }
    };

    fetchTasks();
  }, []);

  const stats = [
    { label: 'Total', value: tasks.length, accent: 'from-cyan-500 to-sky-500' },
    { label: 'Pending', value: tasks.filter((task) => task.status === 'pending').length, accent: 'from-amber-500 to-orange-500' },
    { label: 'Completed', value: tasks.filter((task) => task.status === 'completed').length, accent: 'from-emerald-500 to-green-500' },
    { label: 'In Progress', value: tasks.filter((task) => task.status === 'in_progress').length, accent: 'from-violet-500 to-fuchsia-500' }
  ];

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-white/10 bg-slate-900/50 p-6 shadow-[0_20px_60px_-15px_rgba(2,8,23,0.9)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Welcome back</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Dashboard</h1>
            <p className="mt-1 text-slate-300">Overview of your task activity and momentum.</p>
          </div>
          <Link to="/tasks" className="soft-button inline-flex items-center justify-center">
            Manage Tasks
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card overflow-hidden transition duration-300 hover:-translate-y-1">
              <div className={`h-1 w-full bg-gradient-to-r ${stat.accent}`} />
              <div className="p-5">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>
              <p className="text-sm text-slate-400">The latest updates from your workspace.</p>
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
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map((task) => (
                  <tr key={task.id} className="border-b border-white/10 transition hover:bg-white/5">
                    <td className="py-3 text-slate-100">{task.title}</td>
                    <td className="py-3 text-slate-100">{task.priority}</td>
                    <td className="py-3 text-slate-100">{task.status}</td>
                    <td className="py-3 text-slate-100">{task.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
