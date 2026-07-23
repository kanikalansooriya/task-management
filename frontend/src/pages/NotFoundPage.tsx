import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-shell flex items-center justify-center px-4">
      <div className="glass-card max-w-md p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Oops</p>
        <h1 className="mt-3 text-5xl font-semibold text-white">404</h1>
        <p className="mt-3 text-slate-300">The page you are looking for does not exist.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={() => navigate(-1)} className="soft-button">Go back</button>
          <button onClick={() => navigate('/')} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 font-semibold text-slate-100 transition hover:bg-white/20">Go home</button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
