import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import JugadoresPage from "./pages/JugadoresPage";
import GruposPage from "./pages/GruposPage";
import TransaccionesPage from "./pages/TransaccionesPage";
import RoleRoute from "./components/RoleRoute";
import SugerenciaPage from "./pages/Sugerencias.Page";
import ConfiguracioPage from "./pages/ConfiguracionPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />

        <Route
          path="jugadores"
          element={
            <RoleRoute allowedRoles={["ADMIN", "COORDINADOR", "TESORERO"]}>
              <JugadoresPage />
            </RoleRoute>
          }
        />

        <Route
          path="grupos"
          element={
            <RoleRoute allowedRoles={["ADMIN", "COORDINADOR", "TESORERO"]}>
              <GruposPage />
            </RoleRoute>
          }
        />

        <Route
          path="transacciones"
          element={
            <RoleRoute allowedRoles={["ADMIN", "TESORERO","COORDINADOR"]}>
              <TransaccionesPage />
            </RoleRoute>
          }
        />

        <Route
          path="transacciones"
          element={
            <RoleRoute allowedRoles={["ADMIN", "TESORERO","COORDINADOR"]}>
              <TransaccionesPage />
            </RoleRoute>
          }
        />

        <Route
          path="configuracion"
          element={
            <RoleRoute allowedRoles={["ADMIN", "TESORERO","COORDINADOR"]}>
              <ConfiguracioPage />
            </RoleRoute>
          }
        />

        <Route
          path="sugerencias"
          element={
            <RoleRoute allowedRoles={["ADMIN", "TESORERO","COORDINADOR"]}>
              <SugerenciaPage />
            </RoleRoute>
          }
        />

      </Route>

    </Routes>
  );
}

export default App;