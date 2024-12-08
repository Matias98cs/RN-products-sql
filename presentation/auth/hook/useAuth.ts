import { useContext } from "react";
import { AuthContext, AuthContextValue } from "../provider/AuthPriver";


export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
}