import GruposFilters from "../components/grupos/GruposFilters";
import GruposGrid from "../components/grupos/GruposGrid";
import { useGrupos } from "../hooks/useGrupos";
import { useState } from "react";
import CrearGrupoModal from "../components/grupos/CrearGrupoModal";

function GruposPage() {
  const {
    grupos,
    totalGrupos,
    filtros,
    actualizarFiltro,
    aplicarFiltros,
    limpiarFiltros,
    loading,
    loadingMore,
    error,
    hasMore,
    handleScroll,
    cargarGrupos,
  } = useGrupos();

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Grupos del club
            </h1>
          </div>
        </div>
      </section>

      <GruposFilters
        filtros={filtros}
        totalGrupos={totalGrupos}
        actualizarFiltro={actualizarFiltro}
        aplicarFiltros={aplicarFiltros}
        limpiarFiltros={limpiarFiltros}
      />

      <GruposGrid
        grupos={grupos}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        hasMore={hasMore}
        handleScroll={handleScroll}
        onGrupoActualizado={cargarGrupos}
      />
    </div>
  );
}

export default GruposPage;