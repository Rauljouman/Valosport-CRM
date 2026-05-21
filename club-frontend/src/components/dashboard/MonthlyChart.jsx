import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { formatoEuros } from "../../utils/formatters";

function MonthlyChart({ graficoData, rangoMeses, setRangoMeses }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h2 className="font-black text-slate-900">Evolución mensual</h2>
          <p className="text-sm text-slate-500">
            Comparativa de ingresos por jugadores, ingresos del club y gastos.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
          {[1, 3, 9].map((meses) => (
            <button
              key={meses}
              type="button"
              onClick={() => setRangoMeses(meses)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                rangoMeses === meses
                  ? "bg-blue-700 text-white"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              {meses === 1 ? "Mensual" : `${meses} meses`}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graficoData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip formatter={(value) => formatoEuros(value)} />
            <Legend />

            <Line
              type="monotone"
              dataKey="ingresosJugadores"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Jugadores"
            />

            <Line
              type="monotone"
              dataKey="ingresosClub"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Club"
            />

            <Line
              type="monotone"
              dataKey="gastos"
              stroke="#ea580c"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Gastos"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default MonthlyChart;