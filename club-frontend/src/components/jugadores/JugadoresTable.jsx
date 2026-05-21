import { formatoEuros } from "../../utils/formatters";

function JugadoresTable({
  jugadores,
  loading,
  loadingMore,
  hasMore,
  handleScroll,
}) {
  const calcularPagado = (jugador) => {
    const cuota = Number(jugador.cuotaAnual || 0);
    const pendiente = Number(jugador.saldoPendiente || 0);

    return cuota - pendiente;
  };

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <p className="text-slate-500">Cargando jugadores...</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h2 className="font-black text-slate-900">Listado de jugadores</h2>
        <p className="text-sm text-slate-500">
          Se cargan 20 jugadores inicialmente y se añaden más al hacer scroll.
        </p>
      </div>

      <div
        onScroll={handleScroll}
        className="max-h-[620px] overflow-y-auto"
      >
        {/* Vista móvil */}
        <div className="md:hidden divide-y divide-slate-100">
          {jugadores.length > 0 ? (
            jugadores.map((jugador) => (
              <article key={jugador.id} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-black text-slate-900">
                      {jugador.nombre} {jugador.apellido}
                    </h3>

                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      {jugador.rol} · {jugador.estatus}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      jugador.saldoPendiente > 0
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {jugador.saldoPendiente > 0 ? "Con deuda" : "Pagado"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">DNI</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {jugador.dni}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Equipo</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {jugador.grupoNombre ||
                        jugador.grupo?.nombre ||
                        "Sin equipo"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Teléfono</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {jugador.telefono}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 pt-2 border-t border-slate-100">
                    <span className="text-slate-500">Cuenta pagada</span>
                    <span className="font-black text-emerald-600 text-right">
                      {formatoEuros(calcularPagado(jugador))}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Falta por pagar</span>
                    <span
                      className={`font-black text-right ${
                        jugador.saldoPendiente > 0
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {formatoEuros(jugador.saldoPendiente)}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="p-5 text-sm text-center text-slate-500">
              No se han encontrado jugadores.
            </div>
          )}
        </div>

        {/* Vista desktop/tablet */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr className="text-left text-slate-500">
                <th className="px-5 py-3 font-bold">Nombre completo</th>
                <th className="px-5 py-3 font-bold">DNI</th>
                <th className="px-5 py-3 font-bold">Equipo</th>
                <th className="px-5 py-3 font-bold">Teléfono</th>
                <th className="px-5 py-3 font-bold text-right">
                  Cuenta pagada
                </th>
                <th className="px-5 py-3 font-bold text-right">
                  Falta por pagar
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {jugadores.length > 0 ? (
                jugadores.map((jugador) => (
                  <tr key={jugador.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-slate-900">
                          {jugador.nombre} {jugador.apellido}
                        </p>
                        <p className="text-xs text-slate-500">
                          {jugador.rol} · {jugador.estatus}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {jugador.dni}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {jugador.grupoNombre ||
                        jugador.grupo?.nombre ||
                        "Sin equipo"}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {jugador.telefono}
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-emerald-600">
                      {formatoEuros(calcularPagado(jugador))}
                    </td>

                    <td
                      className={`px-5 py-4 text-right font-black ${
                        jugador.saldoPendiente > 0
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {formatoEuros(jugador.saldoPendiente)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No se han encontrado jugadores.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {loadingMore && (
          <div className="p-4 text-center text-sm text-slate-500">
            Cargando más jugadores...
          </div>
        )}

        {!hasMore && jugadores.length > 0 && (
          <div className="p-4 text-center text-xs text-slate-400">
            No hay más jugadores para mostrar.
          </div>
        )}
      </div>
    </section>
  );
}

export default JugadoresTable;