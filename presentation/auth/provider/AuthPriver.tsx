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

  login: (email: string, password: string) => Promise<boolean>;
  setUser: (user: User | null) => void;
  setAuthStatus: (authStatus: AuthStatus) => void;
  register: (email: string, password: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("unauthenticated");

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthStatus("checking");
      const userData = await authSingIn(email, password);
      if (userData) {
        console.log(userData);
        setUser(userData.user);
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
