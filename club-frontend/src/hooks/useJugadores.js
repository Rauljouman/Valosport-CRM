import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const PAGE_SIZE = 20;

const filtrosIniciales = {
  nombre: "",
  apellido: "",
  dni: "",
  grupoId: "",
  estatus: "",
  rol: "",
  conDeuda: "",
};

export function useJugadores() {
  const [jugadores, setJugadores] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [totalJugadores, setTotalJugadores] = useState(0);

  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const construirQueryParams = (pageToLoad = 0) => {
    const params = new URLSearchParams();

    params.append("page", pageToLoad);
    params.append("size", PAGE_SIZE);

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    return params.toString();
  };

  const cargarGrupos = async () => {
    const response = await axiosClient.get("/grupos");
    setGrupos(response.data ?? []);
  };

  const cargarJugadores = async (pageToLoad = 0, reset = false) => {
    if (pageToLoad === 0) setLoading(true);
    else setLoadingMore(true);

    setError("");

    try {
      const query = construirQueryParams(pageToLoad);
      const response = await axiosClient.get(`/jugadores/filtrar?${query}`);

      const content = response.data?.content ?? [];
      const isLast = response.data?.last ?? true;
      const total = response.data?.totalElements ?? content.length;

      setJugadores((prev) => (reset ? content : [...prev, ...content]));
      setTotalJugadores(total);
      setPage(pageToLoad);
      setHasMore(!isLast);
    } catch (err) {
      console.error(err);
      setError("No se han podido cargar los jugadores.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const cargarInicial = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([cargarGrupos(), cargarJugadores(0, true)]);
    } catch (err) {
      console.error(err);
      setError("No se han podido cargar los jugadores.");
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInicial();
  }, []);

  const actualizarFiltro = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const aplicarFiltros = () => {
    cargarJugadores(0, true);
  };

  const limpiarFiltros = () => {
    setFiltros(filtrosIniciales);
    setTimeout(() => cargarJugadores(0, true), 0);
  };

  const cargarMas = () => {
    if (!hasMore || loadingMore) return;
    cargarJugadores(page + 1, false);
  };

  const handleScroll = (event) => {
    const element = event.currentTarget;

    const nearBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 40;

    if (nearBottom) cargarMas();
  };

  return {
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
  };
}