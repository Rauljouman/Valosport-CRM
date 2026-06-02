import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de REQUEST:
// Antes de enviar cualquier petición, mira si hay token guardado
// y lo añade como Authorization: Bearer TOKEN.
axiosClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("auth-storage");

    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const token = parsed?.state?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error leyendo auth-storage:", error);
        localStorage.removeItem("auth-storage");
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE:
// Centraliza errores importantes de seguridad.
axiosClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token inválido o caducado.
      localStorage.removeItem("auth-storage");

      // Evita redirigir si ya estás en login o reset-password.
      const currentPath = window.location.pathname;

      if (currentPath !== "/login" && currentPath !== "/reset-password") {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      console.warn("No tienes permisos para realizar esta acción.");
    }

    if (status === 429) {
      console.warn("Demasiadas peticiones. Espera unos minutos.");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;