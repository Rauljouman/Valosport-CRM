import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { formatoEuros } from "../../utils/formatters";

function MonthlyChart({
  graficoData,
  transacciones = [],
  rangoMeses,
  setRangoMeses,
}) {
  const obtenerFechaDia = (fecha) => {
    if (!fecha) return null;
    return fecha.split("T")[0];
  };

  const formatearFechaCorta = (fecha) => {
    if (!fecha) return "";

    const [, month, day] = fecha.split("-");
    return `${day}/${month}`;
  };

  const generarDiasPorRangoMeses = (meses) => {
    const hoy = new Date();

    const fechaInicio = new Date(
      hoy.getFullYear(),
      hoy.getMonth() - meses + 1,
      1
    );

    const fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    const dias = [];
    const fechaActual = new Date(fechaInicio);

    while (fechaActual <= fechaFin) {
      const year = fechaActual.getFullYear();
      const month = String(fechaActual.getMonth() + 1).padStart(2, "0");
      const day = String(fechaActual.getDate()).padStart(2, "0");

      const fechaISO = `${year}-${month}-${day}`;

      dias.push({
        fecha: fechaISO,
        fechaLabel: formatearFechaCorta(fechaISO),
        ingresosJugadores: 0,
        ingresosClub: 0,
        gastos: 0,
      });

      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return dias;
  };

  const obtenerGraficoDiario = (meses) => {
    const diasDelRango = generarDiasPorRangoMeses(meses);

    const diasMap = diasDelRango.reduce((acc, dia) => {
      acc[dia.fecha] = { ...dia };
      return acc;
    }, {});

    transacciones.forEach((transaccion) => {
      const fecha = obtenerFechaDia(transaccion.fecha);

      if (!fecha || !diasMap[fecha]) {
        return;
      }

      const cantidad = Number(transaccion.cantidad) || 0;

      if (transaccion.tipo === "GASTO") {
        diasMap[fecha].gastos += cantidad;
      }

      if (transaccion.tipo === "INGRESO" && transaccion.origen === "JUGADOR") {
        diasMap[fecha].ingresosJugadores += cantidad;
      }

      if (transaccion.tipo === "INGRESO" && transaccion.origen !== "JUGADOR") {
        diasMap[fecha].ingresosClub += cantidad;
      }
    });

    return Object.values(diasMap).sort(
      (a, b) => new Date(a.fecha) - new Date(b.fecha)
    );
  };

  const esGraficoDiario = rangoMeses === 1 || rangoMeses === 3;
  const dataDiaria = obtenerGraficoDiario(rangoMeses);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h2 className="font-black text-slate-900">
            {esGraficoDiario ? "Evolución diaria" : "Evolución mensual"}
          </h2>

          <p className="text-sm text-slate-500">
            {esGraficoDiario
              ? rangoMeses === 1
                ? "Ingresos y gastos diarios del mes actual."
                : "Ingresos y gastos diarios de los últimos 3 meses."
              : "Comparativa mensual de ingresos por jugadores, ingresos del club y gastos."}
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

      <div className="h-72 overflow-x-auto">
        <div
          className={
            esGraficoDiario
              ? rangoMeses === 3
                ? "min-w-[3600px] h-full"
                : "min-w-[1300px] h-full"
              : "h-full"
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            {esGraficoDiario ? (
              <BarChart data={dataDiaria} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="fechaLabel"
                  interval={0}
                  minTickGap={0}
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={65}
                />

                <YAxis />
                <Tooltip formatter={(value) => formatoEuros(value)} />
                <Legend />

                <Bar
                  dataKey="ingresosJugadores"
                  name="Jugadores"
                  stackId="ingresos"
                  fill="#2563eb"
                />

                <Bar
                  dataKey="ingresosClub"
                  name="Club"
                  stackId="ingresos"
                  fill="#16a34a"
                />

                <Bar dataKey="gastos" name="Gastos" fill="#ea580c" />
              </BarChart>
            ) : (
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
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default MonthlyChart;