import { formatoEuros } from "../../utils/formatters";

const formatearFecha = (fecha) => {
  if (!fecha) return "Sin fecha";

  const fechaLimpia = fecha.split("T")[0];
  const [year, month, day] = fechaLimpia.split("-");

  return `${day}/${month}/${year}`;
};
function DebtPlayersList({
  jugadoresConDeuda,
  loadingJugadores,
  handleScrollJugadores,
}) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h2 className="font-black text-slate-900">Jugadores con deuda</h2>
      </div>

      <div
        onScroll={handleScrollJugadores}
        className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto"
      >
        {jugadoresConDeuda.length > 0 ? (
          jugadoresConDeuda.map((jugador) => (
            <div
              key={jugador.id}
              className="p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-slate-800">
                  {jugador.nombre} {jugador.apellido}
                </p>
                <p className="text-sm text-slate-500">
                  {jugador.grupoNombre || jugador.grupo?.nombre || "Sin grupo"}
                </p>
              </div>

              <p className="font-black text-red-600">
                {formatoEuros(jugador.saldoPendiente)}
              </p>
            </div>
          ))
        ) : (
          <div className="p-5 text-sm text-slate-500">
            No hay jugadores con deuda pendiente.
          </div>
        )}

        {loadingJugadores && (
          <div className="p-4 text-sm text-slate-500">
            Cargando más jugadores...
          </div>
        )}
      </div>
    </article>
  );
}

export default DebtPlayersList;