const NotFoundPage = () => {
  return (
    <div className="page-shell flex items-center justify-center">
      <div className="glass-card max-w-md p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Oops</p>
        <h1 className="mt-3 text-5xl font-semibold text-white">404</h1>
        <p className="mt-3 text-slate-300">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NotFoundPage;
