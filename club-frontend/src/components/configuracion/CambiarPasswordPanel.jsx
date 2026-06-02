import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

function CambiarPasswordPanel() {
  const changePassword = useAuthStore((state) => state.changePassword);

  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const limpiarMensajes = () => {
    setError("");
    setSuccessMessage("");
  };

  const limpiarFormulario = () => {
    setPasswordActual("");
    setNuevaPassword("");
    setConfirmarPassword("");
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    limpiarMensajes();

    if (
      !passwordActual.trim() ||
      !nuevaPassword.trim() ||
      !confirmarPassword.trim()
    ) {
      setError("Completa todos los campos.");
      return;
    }

    if (nuevaPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await changePassword(passwordActual, nuevaPassword);

      setSuccessMessage("Contraseña actualizada correctamente.");
      limpiarFormulario();
    } catch (err) {
      console.error(err);

      const status = err.response?.status;

      if (status === 429) {
        setError("Demasiadas peticiones. Espera unos minutos.");
      } else {
        setError("No se ha podido cambiar la contraseña. Revisa la contraseña actual.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4ED4D4]/15 text-[#0F766E]">
          <LockKeyhole size={22} />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900">
            Cambiar contraseña
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Actualiza tu contraseña de acceso a Valosport CRM.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleCambiarPassword} className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Contraseña actual
          </label>

          <input
            type="password"
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="Contraseña actual"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Nueva contraseña
          </label>

          <input
            type="password"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="Nueva contraseña"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Confirmar contraseña
          </label>

          <input
            type="password"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="Repite la contraseña"
          />
        </div>

        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Actualizando..." : "Cambiar contraseña"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CambiarPasswordPanel;