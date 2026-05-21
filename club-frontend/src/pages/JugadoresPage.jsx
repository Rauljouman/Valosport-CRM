import JugadoresFilters from "../components/jugadores/JugadoresFilters";
import JugadoresTable from "../components/jugadores/JugadoresTable";
import { useJugadores } from "../hooks/useJugadores";

function JugadoresPage() {
  const {
    jugadores,
    grupos,
    totalJugadores,
    filtros,
    actualizarFiltro,
    aplicarFiltros,
    limpiarFiltros,
    loading,
    loadingMore,
    error,
    hasMore,
    handleScroll,
  } = useJugadores();

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900">Jugadores</h1>
        <p className="hidden md:block text-slate-500">
          Consulta jugadores, filtra por equipo, estado o deuda y revisa el
          estado de sus cuotas.
        </p>
      </section>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <JugadoresFilters
        filtros={filtros}
        grupos={grupos}
        totalJugadores={totalJugadores}
        actualizarFiltro={actualizarFiltro}
        aplicarFiltros={aplicarFiltros}
        limpiarFiltros={limpiarFiltros}
      />

      <JugadoresTable
        jugadores={jugadores}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        handleScroll={handleScroll}
      />
    </div>
  );
}

export default JugadoresPage;