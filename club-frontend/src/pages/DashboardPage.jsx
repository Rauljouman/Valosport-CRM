import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuthStore } from "../store/authStore";

function DashboardPage() {
  const clubNombre = useAuthStore((state) => state.clubNombre);
  const rol = useAuthStore((state) => state.rol);

  const [balance, setBalance] = useState(0);
  const [jugadores, setJugadores] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [transacciones, setTransacciones] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [balanceRes, jugadoresRes, gruposRes, transaccionesRes] =
        await Promise.all([
          axiosClient.get("/transacciones/balance"),
          axiosClient.get("/jugadores"),
          axiosClient.get("/grupos"),
          axiosClient.get("/transacciones/filtrar?size=5&page=0"),
        ]);

      setBalance(balanceRes.data ?? 0);
      setJugadores(jugadoresRes.data ?? []);
      setGrupos(gruposRes.data ?? []);
      setTransacciones(transaccionesRes.data?.content ?? []);
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

  const jugadoresConDeuda = jugadores.filter(
    (jugador) => jugador.saldoPendiente > 0
  );

  const totalPendiente = jugadores.reduce(
    (total, jugador) => total + (jugador.saldoPendiente || 0),
    0
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <p className="text-slate-500">CCargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-red-100 shadow-sm p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <span className="text-2xl">⚠️</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-3">
            No se pudo cargar el dashboard
          </h1>

          <p className="text-slate-600 text-sm mb-2">
            Ha ocurrido un problema al obtener la información del club.
          </p>

          <p className="text-slate-500 text-sm mb-6">
            Contacta con el administrador de la página si el problema continúa.
          </p>

          <button
            type="button"
            onClick={cargarDashboard}
            className="rounded-xl bg-blue-700 text-white font-bold px-5 py-3 hover:bg-blue-800 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900">
          Dashboard
        </h1>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Balance actual</p>
          <p
            className={`text-3xl font-black mt-2 ${
              balance >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {balance.toFixed(2)} €
          </p>
        </article>

        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Jugadores</p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {jugadores.length}
          </p>
        </article>

        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Grupos</p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {grupos.length}
          </p>
        </article>

        <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Pendiente de cobro
          </p>
          <p className="text-3xl font-black text-amber-600 mt-2">
            {totalPendiente.toFixed(2)} €
          </p>
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="font-black text-slate-900">Jugadores con deuda</h2>
            <p className="text-sm text-slate-500">
              Jugadores con saldo pendiente superior a 0.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {jugadoresConDeuda.length > 0 ? (
              jugadoresConDeuda.slice(0, 5).map((jugador) => (
                <div
                  key={jugador.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-800">
                      {jugador.nombre} {jugador.apellido}
                    </p>
                    <p className="text-sm text-slate-500">
                      {jugador.grupoNombre || "Sin grupo"}
                    </p>
                  </div>

                  <p className="font-black text-red-600">
                    {jugador.saldoPendiente.toFixed(2)} €
                  </p>
                </div>
              ))
            ) : (
              <div className="p-5 text-sm text-slate-500">
                No hay jugadores con deuda pendiente.
              </div>
            )}
          </div>
        </article>

        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="font-black text-slate-900">
              Últimas transacciones
            </h2>
            <p className="text-sm text-slate-500">
              Últimos movimientos registrados en el club.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {transacciones.length > 0 ? (
              transacciones.map((transaccion) => (
                <div
                  key={transaccion.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-slate-800">
                      {transaccion.titulo}
                    </p>
                    <p className="text-sm text-slate-500">
                      {transaccion.jugadorNombre ||
                        transaccion.categoria ||
                        "Movimiento del club"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-black ${
                        transaccion.tipo === "INGRESO"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaccion.tipo === "INGRESO" ? "+" : "-"}
                      {transaccion.cantidad.toFixed(2)} €
                    </p>
                    <p className="text-xs text-slate-400">
                      {transaccion.tipo}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-sm text-slate-500">
                No hay transacciones registradas.
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <p className="text-sm text-slate-500">
          Sesión iniciada como{" "}
          <span className="font-bold text-slate-800">{rol}</span>.
        </p>
      </section>
    </div>
  );
}

export default DashboardPage;