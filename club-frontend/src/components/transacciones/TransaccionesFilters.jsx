import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

function TransaccionesFilters({
  variant = "mobile",
  filtros,
  jugadores,
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

  if (variant === "desktop") {
    return (
      <section className="hidden xl:block bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-fit sticky top-20">
        <div className="mb-5">
          <h2 className="font-black text-slate-900">Filtros</h2>
          <p className="text-sm text-slate-500">
            Busca movimientos por tipo, origen, categoría o fecha.
          </p>
        </div>

        <FiltersContent
          filtros={filtros}
          jugadores={jugadores}
          actualizarFiltro={actualizarFiltro}
        />

        <div className="grid grid-cols-2 gap-3 mt-5">
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
      </section>
    );
  }

  return (
    <>
      <section className="xl:hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            Movimientos del club
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
                Filtra los movimientos registrados.
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
              jugadores={jugadores}
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
    </>
  );
}

function FiltersContent({ filtros, jugadores, actualizarFiltro }) {
  const inputClass =
    "w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#4ED4D4] bg-white";

  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Título</label>
        <input
          type="text"
          value={filtros.titulo}
          onChange={(e) => actualizarFiltro("titulo", e.target.value)}
          className={inputClass}
          placeholder="Buscar movimiento"
        />
      </div>

      <div>
        <label className={labelClass}>Tipo</label>
        <select
          value={filtros.tipo}
          onChange={(e) => actualizarFiltro("tipo", e.target.value)}
          className={inputClass}
        >
          <option value="">Todos</option>
          <option value="INGRESO">Ingreso</option>
          <option value="RETIRO">Retiro</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Origen</label>
        <select
          value={filtros.origen}
          onChange={(e) => actualizarFiltro("origen", e.target.value)}
          className={inputClass}
        >
          <option value="">Todos</option>
          <option value="JUGADOR">Jugador</option>
          <option value="CLUB">Club</option>
          <option value="PROVEEDOR">Proveedor</option>
          <option value="CAMPUS">Campus</option>
          <option value="OTROS">Otros</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Categoría</label>
        <select
          value={filtros.categoria}
          onChange={(e) => actualizarFiltro("categoria", e.target.value)}
          className={inputClass}
        >
          <option value="">Todas</option>
          <option value="CUOTA_JUGADOR">Cuota jugador</option>
          <option value="MATERIAL">Material</option>
          <option value="ARBITRAJE">Arbitraje</option>
          <option value="INSCRIPCION">Inscripción</option>
          <option value="PATROCINIO">Patrocinio</option>
          <option value="ALQUILER_PISTA">Alquiler pista</option>
          <option value="OTROS">Otros</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Jugador</label>
        <select
          value={filtros.jugadorId}
          onChange={(e) => actualizarFiltro("jugadorId", e.target.value)}
          className={inputClass}
        >
          <option value="">Todos</option>
          {jugadores.map((jugador) => (
            <option key={jugador.id} value={jugador.id}>
              {jugador.nombre} {jugador.apellido}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Desde</label>
          <input
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => actualizarFiltro("fechaDesde", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Hasta</label>
          <input
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => actualizarFiltro("fechaHasta", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Mín.</label>
          <input
            type="number"
            value={filtros.cantidadMin}
            onChange={(e) => actualizarFiltro("cantidadMin", e.target.value)}
            className={inputClass}
            placeholder="0"
          />
        </div>

        <div>
          <label className={labelClass}>Máx.</label>
          <input
            type="number"
            value={filtros.cantidadMax}
            onChange={(e) => actualizarFiltro("cantidadMax", e.target.value)}
            className={inputClass}
            placeholder="999"
          />
        </div>
      </div>
    </div>
  );
}

export default TransaccionesFilters;