import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resetPassword = useAuthStore((state) => state.resetPassword);
  const token = searchParams.get("token");

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("El enlace no es válido.");
      return;
    }

    if (!nuevaPassword.trim() || !confirmarPassword.trim()) {
      setError("Completa todos los campos.");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (nuevaPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, nuevaPassword);
      setSuccessMessage("Contraseña cambiada correctamente.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError("El enlace ha caducado o no es válido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-md border border-slate-200 px-8 pt-4 pb-8">
        <div className="flex flex-col items-center mb-5">
          <img
            src="/ValosportLogo.png"
            alt="Valosport"
            className="w-[460px] max-w-none object-contain -mt-16 -mb-20"
          />

          <p className="text-slate-500 text-center text-sm select-none">
            Restablece tu contraseña de Valosport CRM.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Nueva contraseña
            </label>

            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              placeholder="Nueva contraseña"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Confirmar contraseña
            </label>

            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              placeholder="Repite la contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-700 text-white font-bold py-3 hover:bg-blue-800 disabled:opacity-60 transition"
          >
            {loading ? "Cambiando..." : "Cambiar contraseña"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full rounded-xl border border-slate-300 text-slate-700 font-bold py-3 hover:bg-slate-50 transition"
          >
            Volver al login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;