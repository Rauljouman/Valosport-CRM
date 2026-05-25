import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";
import { formatoEuros } from "../../utils/formatters";

function TransaccionesList({
  transacciones,
  loading,
  loadingMore,
  hasMore,
  handleScroll,
}) {
  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <p className="text-slate-500">Cargando movimientos...</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h2 className="font-black text-slate-900">Movimientos</h2>
      </div>

      <div onScroll={handleScroll} className="max-h-[680px] overflow-y-auto">
        {transacciones.length > 0 ? (
          transacciones.map((transaccion) => {
            const esIngreso = transaccion.tipo === "INGRESO";

            return (
              <article
                key={transaccion.id}
                className="p-4 sm:p-5 border-b border-slate-100 hover:bg-slate-50 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 min-w-0">
                    <div
                      className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        esIngreso
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {esIngreso ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-black text-slate-900 truncate">
                        {transaccion.titulo}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="text-sm text-slate-500">
                          {transaccion.jugadorNombre ||
                            transaccion.origen ||
                            "Movimiento del club"}
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                          <CreditCard className="h-3 w-3" />
                          {transaccion.categoria}
                        </span>

                        <span>{formatearFecha(transaccion.fecha)}</span>
                      </div>

                      {transaccion.descripcion && (
                        <p className="mt-2 text-sm text-slate-600 break-words line-clamp-2">
                          {transaccion.descripcion}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-black text-lg ${
                        esIngreso ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {esIngreso ? "+" : "-"}
                      {formatoEuros(transaccion.cantidad)}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Saldo: {formatoEuros(transaccion.saldoGeneralDespues)}
                    </p>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="p-8 text-center text-sm text-slate-500">
            No se han encontrado movimientos.
          </div>
        )}

        {loadingMore && (
          <div className="p-4 text-center text-sm text-slate-500">
            Cargando más movimientos...
          </div>
        )}

        {!hasMore && transacciones.length > 0 && (
          <div className="p-4 text-center text-xs text-slate-400">
            No hay más movimientos para mostrar.
          </div>
        )}
      </div>
    </section>
  );
}

export default TransaccionesList;