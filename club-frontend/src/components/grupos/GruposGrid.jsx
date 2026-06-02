import GrupoCard from "./GruposCard";

function GruposGrid({
  grupos,
  loading,
  loadingMore,
  error,
  hasMore,
  handleScroll,
  onGrupoActualizado,
}) {
  if (loading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="font-bold text-red-700">{error}</p>
      </section>
    );
  }

  if (grupos.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-lg font-black text-slate-900">
          No hay grupos disponibles
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Cuando crees equipos, aparecerán aquí.
        </p>
      </section>
    );
  }

  return (
    <section
      onScroll={handleScroll}
      className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {grupos.map((grupo) => (
          <GrupoCard
            key={grupo.id}
            grupo={grupo}
            onGrupoActualizado={onGrupoActualizado}
          />
        ))}
      </div>

      {loadingMore && (
        <p className="py-4 text-center text-sm font-semibold text-slate-500">
          Cargando más grupos...
        </p>
      )}

      {!hasMore && grupos.length > 0 && (
        <p className="py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
          No hay más grupos
        </p>
      )}
    </section>
  );
}

export default GruposGrid;