import { createContext, useState } from "react";
import {
  authCreateUser,
  authSingIn,
} from "../../../core/auth/actions/auth-actions";
import { Alert } from "react-native";
import { User } from "../../../core/auth/interfaces/auth.interface";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

export interface AuthContextValue {
  user: User | null;
  authStatus: AuthStatus;

  login: (email: string, password: string) => Promise<void>;
  setUser: (user: User | null) => void;
  setAuthStatus: (authStatus: AuthStatus) => void;
  register: (email: string, password: string) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("unauthenticated");

  const login = async (email: string, password: string) => {
    try {
      setAuthStatus("checking");
      const userData = await authSingIn(email, password);
      if (userData) {
        setUser(userData.user);
        setAuthStatus("authenticated");
      } else {
        Alert.alert("Error", "Error al iniciar sesión");
        setAuthStatus("unauthenticated");
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      setAuthStatus("unauthenticated");
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userData = await authCreateUser(email, password);

      if (userData) {
        console.log("usuario creado");
        console.log(useState);
      }
    } catch (error) {
      console.error("Error durante el registro:", error);
      setAuthStatus("unauthenticated");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
