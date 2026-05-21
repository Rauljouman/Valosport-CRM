import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

function JugadoresFilters({
  filtros,
  grupos,
  totalJugadores,
  actualizarFiltro,
  aplicarFiltros,
  limpiarFiltros,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleApply = () => {
    aplicarFiltros();
    setFiltersOpen(false);
  };

  const handleClear = () => {
    limpiarFiltros();
    setFiltersOpen(false);
  };

  return (
    <>
      {/* Tablet y móvil */}
      <section className="xl:hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            {totalJugadores} jugadores encontrados
          </p>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtrar
          </button>
        </div>
      </section>

      {/* Panel lateral móvil/tablet */}
      <div
        className={`fixed inset-0 z-50 xl:hidden transition ${
          filtersOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setFiltersOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            filtersOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${
            filtersOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-900">Filtros</h2>
              <p className="text-xs text-slate-500">
                {totalJugadores} jugadores encontrados
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="text-2xl leading-none text-slate-500"
            >
              ×
            </button>
          </div>

          <div className="p-5">
            <FiltersContent
              filtros={filtros}
              grupos={grupos}
              actualizarFiltro={actualizarFiltro}
            />
          </div>

          <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700"
            >
              Borrar todo
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="rounded-xl bg-[#4ED4D4] px-4 py-3 text-sm font-black text-white"
            >
              Finalizado
            </button>
          </div>
        </aside>
      </div>

      {/* Desktop grande */}
      <section className="hidden xl:block bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-black text-slate-900">Filtros</h2>
            <p className="text-sm text-slate-500">
              {totalJugadores} jugadores encontrados
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-slate-300 text-slate-700 font-bold px-4 py-2 hover:bg-slate-50 transition"
            >
              Limpiar
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="rounded-xl bg-[#4ED4D4] text-white font-black px-4 py-2 hover:opacity-90 transition"
            >
              Filtrar
            </button>
          </div>
        </div>

        <FiltersContent
          filtros={filtros}
          grupos={grupos}
          actualizarFiltro={actualizarFiltro}
          compact
        />
      </section>
    </>
  );
}

function FiltersContent({ filtros, grupos, actualizarFiltro, compact = false }) {
  const inputClass =
    "w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#4ED4D4] bg-white";

  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

  return (
    <div
      className={
        compact
          ? "grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-3"
          : "space-y-4"
      }
    >
      <div>
        <label className={labelClass}>Nombre</label>
        <input
          type="text"
          value={filtros.nombre}
          onChange={(e) => actualizarFiltro("nombre", e.target.value)}
          className={inputClass}
          placeholder="Nombre"
        />
      </div>

      <div>
        <label className={labelClass}>Apellido</label>
        <input
          type="text"
          value={filtros.apellido}
          onChange={(e) => actualizarFiltro("apellido", e.target.value)}
          className={inputClass}
          placeholder="Apellido"
        />
      </div>

      <div>
        <label className={labelClass}>DNI</label>
        <input
          type="text"
          value={filtros.dni}
          onChange={(e) => actualizarFiltro("dni", e.target.value)}
          className={inputClass}
          placeholder="DNI"
        />
      </div>

      <div>
        <label className={labelClass}>Equipo</label>
        <select
          value={filtros.grupoId}
          onChange={(e) => actualizarFiltro("grupoId", e.target.value)}
          className={inputClass}
        >
          <option value="">Todos</option>
          {grupos.map((grupo) => (
            <option key={grupo.id} value={grupo.id}>
              {grupo.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Estado</label>
        <select
          value={filtros.estatus}
          onChange={(e) => actualizarFiltro("estatus", e.target.value)}
          className={inputClass}
        >
          <option value="">Todos</option>
          <option value="ACTIVO">Activo</option>
          <option value="LESIONADO">Lesionado</option>
          <option value="SUSPENDIDO">Suspendido</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Rol</label>
        <select
          value={filtros.rol}
          onChange={(e) => actualizarFiltro("rol", e.target.value)}
          className={inputClass}
        >
          <option value="">Todos</option>
          <option value="JUGADOR">Jugador</option>
          <option value="PORTERO">Portero</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Deuda</label>
        <select
          value={filtros.conDeuda}
          onChange={(e) => actualizarFiltro("conDeuda", e.target.value)}
          className={inputClass}
        >
          <option value="">Todos</option>
          <option value="true">Con deuda</option>
          <option value="false">Sin deuda</option>
        </select>
      </div>
    </div>
  );
}

export default JugadoresFilters;