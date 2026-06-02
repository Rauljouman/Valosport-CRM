import DashboardError from "../components/dashboard/DashboardError";
import DashboardStats from "../components/dashboard/DashboardStats";
import DebtPlayersList from "../components/dashboard/DebtPlayersList";
import MonthlyChart from "../components/dashboard/MonthlyChart";
import RecentTransactionsList from "../components/dashboard/RecentTransactionsList";
import { useDashboard } from "../hooks/useDashboard";
import { useAuthStore } from "../store/authStore";

function DashboardPage() {
  const clubNombre = useAuthStore((state) => state.clubNombre);

  const {
    loading,
    error,
    balance,
    jugadores,
    grupos,
    totalPendiente,
    graficoData,
    rangoMeses,
    setRangoMeses,
    jugadoresConDeuda,
    transacciones,
    loadingJugadores,
    loadingTransacciones,
    cargarDashboard,
    handleScrollJugadores,
    handleScrollTransacciones,
  } = useDashboard();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <p className="text-slate-500">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <DashboardError onRetry={cargarDashboard} />;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
      </section>

      <DashboardStats
        balance={balance}
        jugadores={jugadores}
        grupos={grupos}
        totalPendiente={totalPendiente}
      />

      <MonthlyChart
        graficoData={graficoData}
        transacciones={transacciones}
        rangoMeses={rangoMeses}
        setRangoMeses={setRangoMeses}
      />

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DebtPlayersList
          jugadoresConDeuda={jugadoresConDeuda}
          loadingJugadores={loadingJugadores}
          handleScrollJugadores={handleScrollJugadores}
        />

        <RecentTransactionsList
          transacciones={transacciones}
          loadingTransacciones={loadingTransacciones}
          handleScrollTransacciones={handleScrollTransacciones}
        />
      </section>
    </div>
  );
}

export default DashboardPage;