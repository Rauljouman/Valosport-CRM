import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { formatDateForApi } from "../utils/formatters";
import { crearMesesBase } from "../utils/dashboardutils";

const PAGE_SIZE = 20;

export function useDashboard() {
  const [balance, setBalance] = useState(0);
  const [jugadores, setJugadores] = useState([]);
  const [grupos, setGrupos] = useState([]);

  const [jugadoresConDeuda, setJugadoresConDeuda] = useState([]);
  const [jugadoresPage, setJugadoresPage] = useState(0);
  const [hasMoreJugadores, setHasMoreJugadores] = useState(true);
  const [loadingJugadores, setLoadingJugadores] = useState(false);

  const [transacciones, setTransacciones] = useState([]);
  const [transaccionesPage, setTransaccionesPage] = useState(0);
  const [hasMoreTransacciones, setHasMoreTransacciones] = useState(true);
  const [loadingTransacciones, setLoadingTransacciones] = useState(false);

  const [rangoMeses, setRangoMeses] = useState(3);
  const [graficoData, setGraficoData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarJugadoresConDeuda = async (page = 0, reset = false) => {
    if (loadingJugadores) return;

    setLoadingJugadores(true);

    try {
      const response = await axiosClient.get(
        `/jugadores/filtrar?conDeuda=true&page=${page}&size=${PAGE_SIZE}`
      );

      const content = response.data?.content ?? [];
      const isLast = response.data?.last ?? true;

      setJugadoresConDeuda((prev) => (reset ? content : [...prev, ...content]));
      setJugadoresPage(page);
      setHasMoreJugadores(!isLast);
    } finally {
      setLoadingJugadores(false);
    }
  };

  const cargarTransacciones = async (page = 0, reset = false) => {
    if (loadingTransacciones) return;

    setLoadingTransacciones(true);

    try {
      const response = await axiosClient.get(
        `/transacciones/filtrar?page=${page}&size=${PAGE_SIZE}`
      );

      const content = response.data?.content ?? [];
      const isLast = response.data?.last ?? true;

      setTransacciones((prev) => (reset ? content : [...prev, ...content]));
      setTransaccionesPage(page);
      setHasMoreTransacciones(!isLast);
    } finally {
      setLoadingTransacciones(false);
    }
  };

  const cargarGrafico = async (meses = rangoMeses) => {
    const mesesBase = crearMesesBase(meses);
    const fechaDesde = new Date();

    fechaDesde.setMonth(fechaDesde.getMonth() - (meses - 1));
    fechaDesde.setDate(1);

    const response = await axiosClient.get(
      `/transacciones/filtrar?fechaDesde=${formatDateForApi(
        fechaDesde
      )}&page=0&size=1000`
    );

    const transaccionesGrafico = response.data?.content ?? [];

    const datosPorMes = mesesBase.reduce((acc, mes) => {
      acc[mes.key] = { ...mes };
      return acc;
    }, {});

    transaccionesGrafico.forEach((transaccion) => {
      if (!transaccion.fecha) return;

      const fecha = new Date(transaccion.fecha);
      const key = `${fecha.getFullYear()}-${String(
        fecha.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!datosPorMes[key]) return;

      const cantidad = Number(transaccion.cantidad || 0);

      if (transaccion.tipo === "RETIRO") {
        datosPorMes[key].gastos += cantidad;
      }

      if (transaccion.tipo === "INGRESO" && transaccion.origen === "JUGADOR") {
        datosPorMes[key].ingresosJugadores += cantidad;
      }

      if (transaccion.tipo === "INGRESO" && transaccion.origen !== "JUGADOR") {
        datosPorMes[key].ingresosClub += cantidad;
      }
    });

    setGraficoData(Object.values(datosPorMes));
  };

  const cargarDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [balanceRes, jugadoresRes, gruposRes] = await Promise.all([
        axiosClient.get("/transacciones/balance"),
        axiosClient.get("/jugadores"),
        axiosClient.get("/grupos"),
      ]);

      setBalance(balanceRes.data ?? 0);
      setJugadores(jugadoresRes.data ?? []);
      setGrupos(gruposRes.data ?? []);

      await Promise.all([
        cargarJugadoresConDeuda(0, true),
        cargarTransacciones(0, true),
        cargarGrafico(rangoMeses),
      ]);
    } catch (err) {
      console.error(err);
      setError("No se ha podido cargar la información del dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  useEffect(() => {
    if (!loading) {
      cargarGrafico(rangoMeses).catch((err) => {
        console.error(err);
        setError("No se ha podido cargar la información del dashboard.");
      });
    }
  }, [rangoMeses]);

  const totalPendiente = jugadores.reduce(
    (total, jugador) => total + (jugador.saldoPendiente || 0),
    0
  );

  const handleScrollJugadores = (event) => {
    const element = event.currentTarget;
    const nearBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 40;

    if (nearBottom && hasMoreJugadores && !loadingJugadores) {
      cargarJugadoresConDeuda(jugadoresPage + 1);
    }
  };

  const handleScrollTransacciones = (event) => {
    const element = event.currentTarget;
    const nearBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 40;

    if (nearBottom && hasMoreTransacciones && !loadingTransacciones) {
      cargarTransacciones(transaccionesPage + 1);
    }
  };

  return {
    balance,
    jugadores,
    grupos,
    jugadoresConDeuda,
    transacciones,
    rangoMeses,
    setRangoMeses,
    graficoData,
    loading,
    error,
    loadingJugadores,
    loadingTransacciones,
    cargarDashboard,
    handleScrollJugadores,
    handleScrollTransacciones,
    totalPendiente,
  };
}