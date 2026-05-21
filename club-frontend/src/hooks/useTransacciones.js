import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const PAGE_SIZE = 20;

const filtrosIniciales = {
  tipo: "",
  origen: "",
  categoria: "",
  jugadorId: "",
  fechaDesde: "",
  fechaHasta: "",
  cantidadMin: "",
  cantidadMax: "",
  titulo: "",
};

export function useTransacciones() {
  const [balance, setBalance] = useState(0);
  const [transacciones, setTransacciones] = useState([]);
  const [jugadores, setJugadores] = useState([]);

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

  const cargarBalance = async () => {
    const response = await axiosClient.get("/transacciones/balance");
    setBalance(response.data ?? 0);
  };

  const cargarJugadores = async () => {
    const response = await axiosClient.get("/jugadores");
    setJugadores(response.data ?? []);
  };

  const cargarTransacciones = async (pageToLoad = 0, reset = false) => {
    if (pageToLoad === 0) setLoading(true);
    else setLoadingMore(true);

    setError("");

    try {
      const query = construirQueryParams(pageToLoad);
      const response = await axiosClient.get(`/transacciones/filtrar?${query}`);

      const content = response.data?.content ?? [];
      const isLast = response.data?.last ?? true;

      setTransacciones((prev) => (reset ? content : [...prev, ...content]));
      setPage(pageToLoad);
      setHasMore(!isLast);
    } catch (err) {
      console.error(err);
      setError("No se han podido cargar las transacciones.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const cargarInicial = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        cargarBalance(),
        cargarJugadores(),
        cargarTransacciones(0, true),
      ]);
    } catch (err) {
      console.error(err);
      setError("No se han podido cargar las transacciones.");
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
    cargarTransacciones(0, true);
  };

  const limpiarFiltros = () => {
    setFiltros(filtrosIniciales);
    setTimeout(() => cargarTransacciones(0, true), 0);
  };

  const cargarMas = () => {
    if (!hasMore || loadingMore) return;
    cargarTransacciones(page + 1, false);
  };

  const handleScroll = (event) => {
    const element = event.currentTarget;

    const nearBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 40;

    if (nearBottom) cargarMas();
  };

  return {
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
  };
}