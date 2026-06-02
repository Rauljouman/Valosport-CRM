function GrupoJugadoresModal({ open, onClose, grupo, jugadores, loading }) {
  if (!open) return null;

  const formatoEuros = (valor) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(Number(valor ?? 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      <section className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Jugadores de {grupo?.nombre}
            </h2>

            <p className="text-sm text-slate-500">
              {jugadores.length} jugadores registrados
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-2xl text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-5">
          {loading ? (
            <p className="text-sm font-semibold text-slate-500">
              Cargando jugadores...
            </p>
          ) : jugadores.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">
              Este grupo todavía no tiene jugadores.
            </p>
          ) : (
            <div className="space-y-3">
              {jugadores.map((jugador) => {
                const cuotaAnual = Number(jugador.cuotaAnual ?? 0);
                const saldoPendiente = Number(jugador.saldoPendiente ?? 0);
                const pagado = cuotaAnual - saldoPendiente;

                return (
                  <article
                    key={jugador.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-black text-slate-900">
                          {jugador.nombre} {jugador.apellido}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {jugador.rol} · {jugador.estatus}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          DNI: {jugador.dni}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-sm font-black text-emerald-600">
                          Pagado: {formatoEuros(pagado)}
                        </p>

                        <p className="text-sm font-black text-red-600">
                          Pendiente: {formatoEuros(saldoPendiente)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default GrupoJugadoresModal;