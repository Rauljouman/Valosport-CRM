function DashboardError({ onRetry }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-red-100 shadow-sm p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <span className="text-2xl">⚠️</span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-3">
          No se pudo cargar el dashboard
        </h1>

        <p className="text-slate-600 text-sm mb-2">
          Ha ocurrido un problema al obtener la información del club.
        </p>

        <p className="text-slate-500 text-sm mb-6">
          Contacta con el administrador de la página si el problema continúa.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-blue-700 text-white font-bold px-5 py-3 hover:bg-blue-800 transition"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

export default DashboardError;