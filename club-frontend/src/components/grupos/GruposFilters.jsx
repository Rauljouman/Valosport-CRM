import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

function GruposFilters({
  filtros,
  totalGrupos,
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
      <section className="xl:hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            {totalGrupos} grupos encontrados
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
                {totalGrupos} grupos encontrados
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
              actualizarFiltro={actualizarFiltro}
              handleApply={handleApply}
              handleClear={handleClear}
            />
          </div>
        </aside>
      </div>

      <section className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:block">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-black text-slate-900">Filtros</h2>
            <p className="text-sm text-slate-500">
              {totalGrupos} grupos encontrados
            </p>
          </div>
        </div>

        <FiltersContent
          filtros={filtros}
          actualizarFiltro={actualizarFiltro}
          handleApply={handleApply}
          handleClear={handleClear}
          desktop
        />
      </section>
    </>
  );
}

function FiltersContent({
  filtros,
  actualizarFiltro,
  handleApply,
  handleClear,
  desktop = false,
}) {
  return (
    <div
      className={
        desktop
          ? "grid grid-cols-4 items-end gap-3"
          : "flex flex-col gap-4"
      }
    >
      <FilterField label="Nombre">
        <input
          value={filtros.nombre}
          onChange={(e) => actualizarFiltro("nombre", e.target.value)}
          placeholder="Buscar equipo..."
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4ED4D4] focus:ring-2 focus:ring-[#4ED4D4]/20"
        />
      </FilterField>

      <FilterField label="Categoría">
        <input
          value={filtros.categoria}
          onChange={(e) => actualizarFiltro("categoria", e.target.value)}
          placeholder="Senior, Juvenil..."
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4ED4D4] focus:ring-2 focus:ring-[#4ED4D4]/20"
        />
      </FilterField>

      <FilterField label="Estado económico">
        <select
          value={filtros.deuda}
          onChange={(e) => actualizarFiltro("deuda", e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4ED4D4] focus:ring-2 focus:ring-[#4ED4D4]/20"
        >
          <option value="">Todos</option>
          <option value="conDeuda">Con deuda</option>
          <option value="sinDeuda">Sin deuda</option>
        </select>
      </FilterField>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 rounded-xl bg-[#4ED4D4] px-4 py-2 text-sm font-black text-slate-900 transition hover:brightness-95"
        >
          Aplicar
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}

function FilterField({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

export default GruposFilters;