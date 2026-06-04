import { useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

function CambiarPasswordPanel() {
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const email = useAuthStore((state) => state.email);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnviarCorreo = async () => {
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("No se ha podido obtener el correo asociado a tu cuenta.");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);

      setSuccessMessage(
        "Te hemos enviado un correo con instrucciones para cambiar tu contraseña."
      );
    } catch (err) {
      console.error(err);

      const status = err.response?.status;

      if (status === 429) {
        setError("Has solicitado demasiados correos. Espera unos minutos.");
      } else {
        setError("No se ha podido enviar el correo de cambio de contraseña.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4ED4D4]/15 text-[#0F766E]">
          <LockKeyhole size={22} />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900">
            Cambiar contraseña
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Por seguridad, enviaremos un enlace temporal a tu correo electrónico
            para que puedas cambiar tu contraseña.
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

      <div className="flex flex-1 items-center justify-center">
        <button
          type="button"
          onClick={handleEnviarCorreo}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:opacity-60"
        >
          <Mail size={18} />
          {loading ? "Enviando correo..." : "Enviar enlace de cambio"}
        </button>
      </div>
    </section>
  );
}

export default CambiarPasswordPanel;