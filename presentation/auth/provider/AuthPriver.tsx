import { createContext, useEffect, useState } from "react";
import {
  authCreateUser,
  AuthlogOut,
  authRefreshSession,
  authSingIn,
} from "../../../core/auth/actions/auth-actions";
import { Alert } from "react-native";
import { User } from "../../../core/auth/interfaces/auth.interface";
import { SecureStorageAdapter } from "../../../helpers/adapters/secure-storage.adapter";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

export interface AuthContextValue {
  user: User | null;
  authStatus: AuthStatus;

  login: (email: string, password: string) => Promise<boolean>;
  setUser: (user: User | null) => void;
  setAuthStatus: (authStatus: AuthStatus) => void;
  register: (email: string, password: string) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("unauthenticated");

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async (): Promise<boolean> => {
    try {
      setAuthStatus("checking");
      const refreshToken = await SecureStorageAdapter.getItem("refresh_token");
      if (refreshToken) {
        const userData = await authRefreshSession(refreshToken);
        if (userData) {
          setUser(userData.user);
          await SecureStorageAdapter.setItem(
            "access_token",
            userData.access_token
          );
          setAuthStatus("authenticated");
          return true;
        }
      } else {
        console.error("No se encontró el token de refresco");
        setAuthStatus("unauthenticated");
        await SecureStorageAdapter.deleteItem("access_token");
        await SecureStorageAdapter.deleteItem("refresh_token");
        return false;
      }
      return false
    } catch (error) {
      console.error("Error durante la refresco de sesión:", error);
      setAuthStatus("unauthenticated");
      await SecureStorageAdapter.deleteItem("access_token");
      await SecureStorageAdapter.deleteItem("refresh_token");
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthStatus("checking");
      const userData = await authSingIn(email, password);
      if (userData) {
        console.log(userData);
        setUser(userData.user);
        await SecureStorageAdapter.setItem(
          "access_token",
          userData.access_token
        );
        await SecureStorageAdapter.setItem(
          "refresh_token",
          userData.refresh_token
        );
        setAuthStatus("authenticated");
        return true;
      } else {
        Alert.alert("Error", "Error al iniciar sesión");
        setAuthStatus("unauthenticated");
        return false;
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      setAuthStatus("unauthenticated");
      return false;
    }
  };

  const register = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const userData = await authCreateUser(email, password);

      if (userData) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error durante el registro:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AuthlogOut();
      setUser(null);
      setAuthStatus("unauthenticated");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authStatus,

        login,
        register,
        setUser,
        setAuthStatus,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
