import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import axiosClient from "../api/axiosClient";

function LoginPage() {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [resetEmail, setResetEmail] = useState("");

  const [requestName, setRequestName] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [requestPhone, setRequestPhone] = useState("");
  const [requestClub, setRequestClub] = useState("");
  const [requestRole, setRequestRole] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const resetMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const changeMode = (newMode) => {
    resetMessages();
    setMode(newMode);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      const status = err.response?.status;

      if (status === 429) {
        setError("Demasiados intentos. Espera unos minutos antes de volver a probar.");
      } else if (status === 423) {
        setError("La cuenta está bloqueada temporalmente por demasiados intentos fallidos.");
      } else {
        setError("Email o contraseña incorrectos.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!resetEmail.trim()) {
      setError("Introduce tu correo electrónico.");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(resetEmail);
      setSuccessMessage(
        "Si el correo existe, recibirás instrucciones para restablecer tu contraseña."
      );
    } catch (err) {
      console.error(err);

      const status = err.response?.status;

      if (status === 429) {
        setError("Has solicitado demasiados correos. Espera unos minutos.");
      } else {
        setError("No se ha podido enviar el correo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccessRequest = async (e) => {
    e.preventDefault();
    resetMessages();

    if (
      !requestName.trim() ||
      !requestEmail.trim() ||
      !requestPhone.trim() ||
      !requestClub.trim() ||
      !requestRole.trim()
    ) {
      setError("Completa nombre, email, teléfono, club y rol para enviar la solicitud.");
      return;
    }

    setLoading(true);

    try {
      await axiosClient.post("/solicitudes-acceso", {
        nombre: requestName,
        email: requestEmail,
        telefono: requestPhone,
        club: requestClub,
        rol: requestRole,
        mensaje: requestMessage,
      });

      setSuccessMessage(
        "Solicitud enviada. Un administrador revisará tu petición."
      );

      setRequestName("");
      setRequestEmail("");
      setRequestPhone("");
      setRequestClub("");
      setRequestRole("");
      setRequestMessage("");
    } catch (err) {
      console.error(err);

      const status = err.response?.status;

      if (status === 429) {
        setError("Has enviado demasiadas solicitudes. Espera unos minutos.");
      } else {
        setError("No se ha podido enviar la solicitud.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-6">
      <div
        className={`w-full bg-white rounded-3xl shadow-md border border-slate-200 px-6 sm:px-8 pt-4 pb-6 ${
          mode === "requestAccess" ? "max-w-xl" : "max-w-md"
        }`}
      >
        <div className="flex flex-col items-center mb-5">
          <img
            src="/ValosportLogo.png"
            alt="Valosport"
            className={`max-w-none object-contain ${
              mode === "requestAccess"
                ? "w-[330px] -mt-10 -mb-12"
                : "w-[460px] -mt-16 -mb-20"
            }`}
          />

          <p className="text-slate-500 text-center text-sm select-none">
            Toda la información de tu club en pocos clics.
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

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 select-none">
                Email
              </label>

              <input
                type="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 select-none">
                Contraseña
              </label>

              <input
                type="password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 text-white font-bold py-3 hover:bg-blue-800 disabled:opacity-60 transition select-none"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="flex items-center justify-between text-sm pt-1">
              <button
                type="button"
                onClick={() => changeMode("forgotPassword")}
                className="text-blue-700 font-semibold hover:text-blue-900"
              >
                ¿Has olvidado la contraseña?
              </button>

              <button
                type="button"
                onClick={() => changeMode("requestAccess")}
                className="text-slate-600 font-semibold hover:text-slate-900"
              >
                Solicitar acceso
              </button>
            </div>
          </form>
        )}

        {mode === "forgotPassword" && (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <h1 className="text-xl font-black text-slate-900 mb-2">
                Recuperar contraseña
              </h1>

              <p className="text-sm text-slate-500 mb-5">
                Introduce tu correo y te enviaremos instrucciones para cambiar
                tu contraseña.
              </p>

              <label className="block text-sm font-semibold text-slate-700 mb-1 select-none">
                Email
              </label>

              <input
                type="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="tuemail@club.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 text-white font-bold py-3 hover:bg-blue-800 disabled:opacity-60 transition select-none"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>

            <button
              type="button"
              onClick={() => changeMode("login")}
              className="w-full rounded-xl border border-slate-300 text-slate-700 font-bold py-3 hover:bg-slate-50 transition select-none"
            >
              Volver al login
            </button>
          </form>
        )}

        {mode === "requestAccess" && (
          <form onSubmit={handleAccessRequest} className="space-y-3">
            <div>
              <h1 className="text-xl font-black text-slate-900 mb-1">
                Solicitar acceso
              </h1>

              <p className="text-sm text-slate-500 mb-4">
                Rellena tus datos y un administrador revisará tu solicitud.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 select-none">
                  Nombre completo
                </label>

                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 select-none">
                  Email
                </label>

                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  placeholder="tuemail@club.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 select-none">
                  Teléfono
                </label>

                <input
                  type="tel"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={requestPhone}
                  onChange={(e) => setRequestPhone(e.target.value)}
                  placeholder="Tu teléfono"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 select-none">
                  Club
                </label>

                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={requestClub}
                  onChange={(e) => setRequestClub(e.target.value)}
                  placeholder="Nombre del club"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 select-none">
                Rol solicitado
              </label>

              <select
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={requestRole}
                onChange={(e) => setRequestRole(e.target.value)}
              >
                <option value="">Selecciona un rol</option>
                <option value="COORDINADOR">Coordinador</option>
                <option value="TESORERO">Tesorero</option>
                <option value="ADMIN">Admin</option>
                <option value="OWNER">Owner</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 select-none">
                Mensaje opcional
              </label>

              <textarea
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="2"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Explica brevemente por qué necesitas acceso"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 text-white font-bold py-2.5 hover:bg-blue-800 disabled:opacity-60 transition select-none"
            >
              {loading ? "Enviando..." : "Enviar solicitud"}
            </button>

            <button
              type="button"
              onClick={() => changeMode("login")}
              className="w-full rounded-xl border border-slate-300 text-slate-700 font-bold py-2.5 hover:bg-slate-50 transition select-none"
            >
              Volver al login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;