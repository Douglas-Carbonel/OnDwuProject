import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  userId: string;
  name: string;
  email: string;
  profile: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: {
    username: string;
    email: string;
    password: string;
    profile: string;
  }) => Promise<{ success: boolean; message?: string; user?: User }>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      login: async (email: string, password: string) => {
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (response.ok) {
            const data = await response.json();
            const isAdmin = data.user.profile === "admin";
            set({
              user: data.user,
              isAuthenticated: true,
              isAdmin,
            });
            return true;
          } else {
            const errorData = await response.json();
            console.error("Login failed:", errorData.message);
            return false;
          }
        } catch (error) {
          console.error("Login failed:", error);
          return false;
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, isAdmin: false });
        // Clear any stored location state
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/welcome');
        }
      },
      createUser: async (userData) => {
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (response.ok) {
            return {
              success: true,
              user: data.user,
            };
          } else {
            return {
              success: false,
              message: data.message || "Erro ao criar usuário",
            };
          }
        } catch (error) {
          console.error("Error creating user:", error);
          return {
            success: false,
            message: "Erro de conexão com o servidor",
          };
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);