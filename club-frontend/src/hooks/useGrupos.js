import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";

const PAGE_SIZE = 12;

const filtrosIniciales = {
  nombre: "",
  categoria: "",
  deuda: "",
};

export function useGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [filtros, setFiltros] = useState(filtrosIniciales);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const cargarGrupos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosClient.get("/grupos");
      setGrupos(response.data ?? []);
    } catch (err) {
      console.error(err);
      setError("No se han podido cargar los grupos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarGrupos();
  }, []);

  const actualizarFiltro = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const aplicarFiltros = () => {
    setVisibleCount(PAGE_SIZE);
  };

  const limpiarFiltros = () => {
    setFiltros(filtrosIniciales);
    setVisibleCount(PAGE_SIZE);
  };

  const gruposFiltrados = useMemo(() => {
    return grupos.filter((grupo) => {
      const nombre = grupo.nombre?.toLowerCase() ?? "";
      const categoria = grupo.categoria?.toLowerCase() ?? "";
      const totalPendiente = Number(grupo.totalPendiente ?? 0);

      const coincideNombre = nombre.includes(filtros.nombre.toLowerCase());

      const coincideCategoria =
        filtros.categoria === "" ||
        categoria.includes(filtros.categoria.toLowerCase());

      const coincideDeuda =
        filtros.deuda === "" ||
        (filtros.deuda === "conDeuda" && totalPendiente > 0) ||
        (filtros.deuda === "sinDeuda" && totalPendiente <= 0);

      return coincideNombre && coincideCategoria && coincideDeuda;
    });
  }, [grupos, filtros]);

  const gruposVisibles = gruposFiltrados.slice(0, visibleCount);
  const totalGrupos = gruposFiltrados.length;
  const hasMore = visibleCount < gruposFiltrados.length;

  const cargarMas = () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 250);
  };

  const handleScroll = (event) => {
    const element = event.currentTarget;

    const nearBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 40;

    if (nearBottom) cargarMas();
  };

  return {
    grupos: gruposVisibles,
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
  };
}