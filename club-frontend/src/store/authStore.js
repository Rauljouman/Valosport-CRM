import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosClient from "../api/axiosClient";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      email: null,
      nombre: null,
      rol: null,
      clubId: null,
      clubNombre: null,
      isAuthenticated: false,

      setClubNombre: (clubNombre) =>
        set({
          clubNombre,
        }),

      login: async (email, password) => {
        const response = await axiosClient.post("/auth/login", {
          email,
          password,
        });

        const data = response.data;

        set({
          token: data.token,
          email: data.email,
          nombre: data.nombre,
          rol: data.rol,
          clubId: data.clubId,
          clubNombre: data.clubNombre,
          isAuthenticated: true,
        });

        return data;
      },

      forgotPassword: async (email) => {
        const response = await axiosClient.post("/auth/forgot-password", { email });
        return response.data;
      },

      resetPassword: async (token, nuevaPassword) => {
        const response = await axiosClient.post("/auth/reset-password", {
          token,
          nuevaPassword,
        });
        return response.data;
      },

      changePassword: async (passwordActual, nuevaPassword) => {
        const response = await axiosClient.post("/auth/cambiar-password", {
          passwordActual,
          nuevaPassword,
        });
        return response.data;
      },

      logout: () => {
        set({
          token: null,
          email: null,
          nombre: null,
          rol: null,
          clubId: null,
          clubNombre: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    }
    
  )
);