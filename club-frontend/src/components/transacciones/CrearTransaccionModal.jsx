import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const formInicial = {
  titulo: "",
  descripcion: "",
  cantidad: "",
  tipo: "INGRESO",
  origen: "CLUB",
  categoria: "OTROS",
  jugadorId: "",
};

function CrearTransaccionModal({ open, onClose, onTransaccionCreada }) {
  const [form, setForm] = useState(formInicial);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selectClass =`${inputClass} appearance-none pr-10 cursor-pointer bg-white`;

  const esJugador = form.origen === "JUGADOR";

  useEffect(() => {
    if (open) cargarJugadores();
  }, [open]);

  const cargarJugadores = async () => {
    try {
      const response = await axiosClient.get("/jugadores");
      setJugadores(response.data ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  if (!open) return null;

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => {
      const nuevoForm = {
        ...prev,
        [campo]: valor,
      };

      if (campo === "origen" && valor === "JUGADOR") {
        nuevoForm.tipo = "INGRESO";
        nuevoForm.categoria = "CUOTA_JUGADOR";
      }

      if (campo === "origen" && valor !== "JUGADOR") {
        nuevoForm.jugadorId = "";
      }

      if (campo === "jugadorId") {
        const jugador = jugadores.find((j) => j.id === Number(valor));

        if (jugador && prev.origen === "JUGADOR") {
          nuevoForm.titulo = `Pago cuota - ${jugador.nombre} ${jugador.apellido}`;
          nuevoForm.descripcion = `Pago de cuota realizado por ${jugador.nombre} ${jugador.apellido}.`;
        }
      }

      return nuevoForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo.trim()) return setError("El título es obligatorio.");
    if (!form.descripcion.trim())
      return setError("La descripción es obligatoria.");
    if (!form.cantidad) return setError("La cantidad es obligatoria.");
    if (Number(form.cantidad) <= 0)
      return setError("La cantidad debe ser positiva.");
    if (!form.tipo) return setError("Debes seleccionar un tipo.");
    if (!form.origen) return setError("Debes seleccionar un origen.");
    if (!form.categoria) return setError("Debes seleccionar una categoría.");

    if (form.origen === "JUGADOR" && !form.jugadorId) {
      return setError("Debes seleccionar un jugador.");
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        cantidad: Number(form.cantidad),
        tipo: form.origen === "JUGADOR" ? "INGRESO" : form.tipo,
        origen: form.origen,
        categoria: form.origen === "JUGADOR" ? "CUOTA_JUGADOR" : form.categoria,
        jugadorId: form.origen === "JUGADOR" ? Number(form.jugadorId) : null,
      };

      await axiosClient.post("/transacciones", payload);

      setForm(formInicial);
      onTransaccionCreada?.();
      onClose();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "No se ha podido crear la transacción."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      <section className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Crear transacción
            </h2>
            <p className="text-sm text-slate-500">
              Registra un ingreso o retiro del club.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-2xl text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[75vh] space-y-5 overflow-y-auto p-5"
        >
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Campo label="Título">
              <input
                className={inputClass}
                value={form.titulo}
                onChange={(e) => actualizarCampo("titulo", e.target.value)}
                placeholder="Pago cuota mensual"
              />
            </Campo>

            <Campo label="Cantidad">
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputClass}
                value={form.cantidad}
                onChange={(e) => actualizarCampo("cantidad", e.target.value)}
                placeholder="100"
              />
            </Campo>

            <Campo label="Origen">
              <select
                className={inputClass}
                value={form.origen}
                onChange={(e) => actualizarCampo("origen", e.target.value)}
              >
                <option value="CLUB">Club</option>
                <option value="JUGADOR">Jugador</option>
                <option value="PROVEEDOR">Proveedor</option>
                <option value="CAMPUS">Campus</option>
                <option value="OTROS">Otros</option>
              </select>
            </Campo>

            <Campo label="Tipo">
              <select
                className={inputClass}
                value={form.tipo}
                disabled={esJugador}
                onChange={(e) => actualizarCampo("tipo", e.target.value)}
              >
                <option value="INGRESO">Ingreso</option>
                <option value="RETIRO">Retiro</option>
              </select>
            </Campo>

            {!esJugador && (
              <Campo label="Categoría">
                <select
                  className={inputClass}
                  value={form.categoria}
                  onChange={(e) =>
                    actualizarCampo("categoria", e.target.value)
                  }
                >
                  <option value="MATERIAL">Material</option>
                  <option value="ARBITRAJE">Arbitraje</option>
                  <option value="INSCRIPCION">Inscripción</option>
                  <option value="PATROCINIO">Patrocinio</option>
                  <option value="ALQUILER_PISTA">Alquiler pista</option>
                  <option value="OTROS">Otros</option>
                </select>
              </Campo>
            )}

            {esJugador && (
              <Campo label="Jugador">
                <select
                  className={inputClass}
                  value={form.jugadorId}
                  onChange={(e) =>
                    actualizarCampo("jugadorId", e.target.value)
                  }
                >
                  <option value="">Seleccionar jugador</option>
                  {jugadores.map((jugador) => (
                    <option key={jugador.id} value={jugador.id}>
                      {jugador.nombre} {jugador.apellido} · Pendiente:{" "}
                      {Number(jugador.saldoPendiente ?? 0).toFixed(2)} €
                    </option>
                  ))}
                </select>
              </Campo>
            )}

            {esJugador && (
              <div className="md:col-span-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Esta transacción se registrará automáticamente como{" "}
                <strong>Ingreso</strong> y categoría{" "}
                <strong>Cuota jugador</strong>.
              </div>
            )}

            <div className="md:col-span-2">
              <Campo label="Descripción">
                <textarea
                  className={`${inputClass} min-h-24 resize-none`}
                  value={form.descripcion}
                  onChange={(e) =>
                    actualizarCampo("descripcion", e.target.value)
                  }
                  placeholder="Detalle de la operación..."
                />
              </Campo>
            </div>
          </div>

          {esJugador && (
            <div className="rounded-2xl bg-[#4ED4D4]/10 p-4 text-sm text-slate-700">
              Al registrar una transacción de jugador, se descontará
              automáticamente de su saldo pendiente.
            </div>
          )}

          <div className="flex gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#4ED4D4] px-4 py-2 text-sm font-black text-slate-900 hover:brightness-95 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Crear transacción"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4ED4D4] focus:ring-2 focus:ring-[#4ED4D4]/20 disabled:bg-slate-100 disabled:text-slate-400";

export default CrearTransaccionModal;