import TransaccionesFilters from "../components/transacciones/TransaccionesFilters";
import TransaccionesList from "../components/transacciones/TransaccionesList";
import { useTransacciones } from "../hooks/useTransacciones";
import { formatoEuros } from "../utils/formatters";

function TransaccionesPage() {
  const {
    balance,
    transacciones,
    jugadores,
    filtros,
    actualizarFiltro,
    aplicarFiltros,
    limpiarFiltros,
    loading,
    loadingMore,
    error,
    hasMore,
    handleScroll,
  } = useTransacciones();

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-black text-slate-900">Transacciones</h1>
      </section>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 items-start">
        <div className="space-y-5">
          <TransaccionesFilters
            variant="mobile"
            filtros={filtros}
            jugadores={jugadores}
            actualizarFiltro={actualizarFiltro}
            aplicarFiltros={aplicarFiltros}
            limpiarFiltros={limpiarFiltros}
          />

          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm font-semibold text-slate-500">Saldo total</p>

            <p
              className={`text-4xl font-black mt-2 ${
                balance >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {formatoEuros(balance)}
            </p>
          </article>

          <TransaccionesList
            transacciones={transacciones}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            handleScroll={handleScroll}
          />
        </div>

        <TransaccionesFilters
          variant="desktop"
          filtros={filtros}
          jugadores={jugadores}
          actualizarFiltro={actualizarFiltro}
          aplicarFiltros={aplicarFiltros}
          limpiarFiltros={limpiarFiltros}
        />
      </section>
    </div>
  );
}

export default TransaccionesPage;