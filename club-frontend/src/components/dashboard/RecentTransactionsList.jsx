import { formatoEuros } from "../../utils/formatters";

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
          transacciones.map((transaccion) => (
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
              </div>

              <div className="text-right">
                <p
                  className={`font-black ${
                    transaccion.tipo === "INGRESO"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {transaccion.tipo === "INGRESO" ? "+" : "-"}
                  {formatoEuros(transaccion.cantidad)}
                </p>
                <p className="text-xs text-slate-400">{transaccion.tipo}</p>
              </div>
            </div>
          ))
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