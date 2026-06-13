import { formatoEuros } from "../../utils/formatters";

const formatearFecha = (fecha) => {
  if (!fecha) return "Sin fecha";

  const fechaLimpia = fecha.split("T")[0];
  const [year, month, day] = fechaLimpia.split("-");

  return `${day}/${month}/${year}`;
};

function RecentTransactionsList({
  transacciones,
  loadingTransacciones,
  handleScrollTransacciones,
}) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h2 className="font-black text-slate-900">Últimas transacciones</h2>
      </div>

      <div
        onScroll={handleScrollTransacciones}
        className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto"
      >
        {transacciones.length > 0 ? (
          transacciones.map((transaccion) => {
            const esIngreso = transaccion.tipo === "INGRESO";

            return (
              <div
                key={transaccion.id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-slate-800">
                    {transaccion.titulo}
                  </p>

                  <p className="text-sm text-slate-500">
                    {transaccion.jugadorNombre ||
                      transaccion.categoria ||
                      "Movimiento del club"}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {formatearFecha(transaccion.fecha)}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`font-black ${
                      esIngreso ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {esIngreso ? "+" : "-"}
                    {formatoEuros(transaccion.cantidad)}
                  </p>

                  <p className="text-xs text-slate-400">
                    {esIngreso ? "INGRESO" : "RETIRO"}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-5 text-sm text-slate-500">
            No hay transacciones registradas.
          </div>
        )}

        {loadingTransacciones && (
          <div className="p-4 text-sm text-slate-500">
            Cargando más transacciones...
          </div>
        )}
      </div>
    </article>
  );
}

export default RecentTransactionsList;