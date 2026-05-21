import { formatoEuros } from "../../utils/formatters";

function DashboardStats({ balance, jugadores, grupos, totalPendiente }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <article className="bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">Balance actual</p>
        <p
          className={`text-2xl font-black mt-1 ${
            balance >= 0 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {formatoEuros(balance)}
        </p>
      </article>

      <article className="bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">Jugadores</p>
        <p className="text-2xl font-black text-slate-900 mt-1">
          {jugadores.length}
        </p>
      </article>

      <article className="bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">Grupos</p>
        <p className="text-2xl font-black text-slate-900 mt-1">
          {grupos.length}
        </p>
      </article>

      <article className="bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">
          Pendiente de cobro
        </p>
        <p className="text-2xl font-black text-amber-600 mt-1">
          {formatoEuros(totalPendiente)}
        </p>
      </article>
    </section>
  );
}

export default DashboardStats;