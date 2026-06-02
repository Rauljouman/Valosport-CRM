import { useState } from "react";
import axiosClient from "../api/axiosClient";

const formInicial = {
  tipo: "SUGERENCIA",
  asunto: "",
  mensaje: "",
};

function SugerenciasPage() {
  const [form, setForm] = useState(formInicial);
  const [loading, setLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [error, setError] = useState("");

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.asunto.trim()) {
      setError("Debes indicar un asunto.");
      return;
    }

    if (!form.mensaje.trim()) {
      setError("Debes escribir un mensaje.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMensajeExito("");

      await axiosClient.post("/sugerencias", form);

      setMensajeExito("Sugerencia enviada correctamente.");
      setForm(formInicial);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "No se ha podido enviar la sugerencia."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-black text-slate-900">
          Sugerencias
        </h1>

        <p className="mt-1 text-slate-500">
          ¿Has encontrado un error o tienes una idea para mejorar Valosport?
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {mensajeExito && (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {mensajeExito}
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-[140px_1fr]">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                Tipo
              </span>

              <select
                value={form.tipo}
                onChange={(e) =>
                  actualizarCampo("tipo", e.target.value)
                }
                className={inputClass}
              >
                <option value="SUGERENCIA">Sugerencia</option>
                <option value="ERROR">Error</option>
                <option value="MEJORA">Mejora</option>
                <option value="CONTACTO">Contacto</option>
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                Asunto
              </span>

              <input
                type="text"
                value={form.asunto}
                onChange={(e) =>
                  actualizarCampo("asunto", e.target.value)
                }
                placeholder="Problema con jugadores..."
                className={inputClass}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-black uppercase tracking-wide text-slate-500">
              Mensaje
            </span>

            <textarea
              value={form.mensaje}
              onChange={(e) =>
                actualizarCampo("mensaje", e.target.value)
              }
              placeholder="Describe aquí tu sugerencia..."
              className={`${inputClass} min-h-40 resize-none`}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#4ED4D4] px-5 py-2 font-black text-slate-900 transition hover:brightness-95 disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar sugerencia"}
          </button>
        </form>
      </section>
    </div>
  );
}

const inputClass =
  "rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4ED4D4] focus:ring-2 focus:ring-[#4ED4D4]/20";

export default SugerenciasPage;