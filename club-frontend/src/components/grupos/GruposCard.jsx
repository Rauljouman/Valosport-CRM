import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import GrupoJugadoresModal from "./GrupoJugadoresModal";
import {
  ChevronDown,
  Users,
  UserRound,
  Wallet,
  CheckCircle2,
} from "lucide-react";

function GrupoCard({ grupo }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [jugadores, setJugadores] = useState([]);
  const [loadingJugadores, setLoadingJugadores] = useState(false);

  const nombre = grupo.nombre ?? "Grupo sin nombre";
  const categoria = grupo.categoria ?? "Sin categoría";
  const numeroJugadores = grupo.numeroJugadores ?? 0;
  const entrenador = grupo.entrenadorNombre ?? "Sin entrenador";
  const totalPendiente = grupo.totalPendiente ?? 0;
  const totalPagado = grupo.totalPagado ?? 0;

  const tieneDeuda = totalPendiente > 0;

  const formatoEuros = (valor) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(Number(valor ?? 0));

  const abrirJugadores = async () => {
    setModalOpen(true);
    setLoadingJugadores(true);

    try {
      const response = await axiosClient.get(`/jugadores/por-equipo/${grupo.id}`);
      setJugadores(response.data ?? []);
    } catch (error) {
      console.error(error);
      setJugadores([]);
    } finally {
      setLoadingJugadores(false);
    }
  };

  return (
    <>
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex rounded-full bg-[#4ED4D4]/15 px-3 py-1 text-xs font-black text-[#0F766E]">
              {categoria}
            </span>

            <h3 className="mt-3 text-xl font-black text-slate-900">
              {nombre}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Equipo perteneciente al club
            </p>
          </div>

          <div
            className={`rounded-full px-3 py-1 text-xs font-black ${
              tieneDeuda
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {tieneDeuda ? "Con deuda" : "Al día"}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <InfoBox
            icon={<Users className="h-4 w-4" />}
            label="Jugadores"
            value={numeroJugadores}
          />

          <InfoBox
            icon={<UserRound className="h-4 w-4" />}
            label="Entrenador"
            value={entrenador}
          />

          <InfoBox
            icon={<Wallet className="h-4 w-4" />}
            label="Pendiente"
            value={formatoEuros(totalPendiente)}
            danger={tieneDeuda}
          />

          <InfoBox
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Pagado"
            value={formatoEuros(totalPagado)}
            success
          />
        </div>

        <button
          type="button"
          onClick={abrirJugadores}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Ver jugadores
          <ChevronDown className="h-4 w-4" />
        </button>
      </article>

      <GrupoJugadoresModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        grupo={grupo}
        jugadores={jugadores}
        loading={loadingJugadores}
      />
    </>
  );
}

function InfoBox({ icon, label, value, danger, success }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div
        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${
          danger
            ? "bg-amber-100 text-amber-700"
            : success
            ? "bg-emerald-100 text-emerald-700"
            : "bg-white text-[#0F766E]"
        }`}
      >
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default GrupoCard;