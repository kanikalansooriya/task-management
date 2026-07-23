import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createApiClient, clearAuth, getUser } from '../auth';
import ThemeToggle from '../components/ThemeToggle';

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
}

interface DashboardStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

const DashboardPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
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

      } catch (error: any) {

        if (error.response && [401, 403].includes(error.response.status)) {
          clearAuth();
          navigate('/login');
        } else {
          setTasks([]);
        }

      } finally {
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
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div
          className="mb-8 flex flex-col gap-4 rounded-[32px] border p-6 shadow-xl backdrop-blur-xl md:flex-row md:items-center md:justify-between"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)"
          }}>
          <div>

            <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
              Welcome back
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Dashboard
            </h1>
            <p className="mt-1 text-[var(--text-secondary)]">
              Overview of your task activity.
            </p>
            {user && (
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Signed in as {user.name}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Link
              to="/tasks"
              className="soft-button inline-flex items-center justify-center">
              Manage Tasks
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-2xl bg-rose-500 px-4 py-2.5 font-semibold text-white transition hover:bg-rose-600">
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">

          {cards.map((card) => (

            <div
              key={card.label}
              className="glass-card overflow-hidden transition duration-300 hover:-translate-y-1">
              <div className={`h-1 w-full bg-gradient-to-r ${card.accent}`} />
              <div className="p-5">
                <p className="text-sm text-[var(--text-secondary)]">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
                  {card.value}
                </p>
              </div>
            </div>

          ))}
        </div>

        {/* Recent Tasks */}
        <div className="glass-card p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Recent Tasks
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                The latest updates from your workspace.
              </p>

            </div>
            <Link
              to="/tasks"
              className="text-sm font-medium text-cyan-400">
              Open task board
            </Link>
          </div>
          {isLoading ? (

            <div className="rounded-2xl border border-dashed border-cyan-400/30 bg-cyan-500/10 px-4 py-10 text-center text-sm text-[var(--text-secondary)]">
              Loading dashboard...
            </div>
          ) : tasks.length === 0 ? (

            <div className="rounded-2xl border border-dashed px-4 py-10 text-center text-sm text-[var(--text-secondary)]"
              style={{
                borderColor:"var(--card-border)"
              }}
            >
              No tasks yet. Create your first task from the task board.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr
                    className="border-b text-sm text-[var(--text-secondary)]"
                    style={{
                      borderColor:"var(--card-border)"
                    }}>

                    <th className="py-3">Title</th>
                    <th className="py-3">Priority</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Due Date</th>
                  </tr>
                </thead>
                <tbody>

                  {tasks.slice(0,5).map((task)=>(

                    <tr
                      key={task.id}
                      className="border-b transition hover:bg-black/5 dark:hover:bg-white/5"
                      style={{
                        borderColor:"var(--card-border)"
                      }}>
                      <td className="py-3 text-[var(--text-primary)]">
                        {task.title}
                      </td>
                      <td className="py-3 text-[var(--text-primary)]">
                        {task.priority}
                      </td>
                      <td className="py-3 text-[var(--text-primary)]">
                        {task.status}
                      </td>
                      <td className="py-3 text-[var(--text-primary)]">
                        {task.dueDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;