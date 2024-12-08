import { supabase } from "../../../database/supabase/db.supabase";
import { SecureStorageAdapter } from "../../../helpers/adapters/secure-storage.adapter";
import { User } from "../interfaces/auth.interface";
import { Session, User as SupabaseUser } from "@supabase/auth-js";

const returnUserToken = (data: {
  user: User;
  session: Session;
}): { user: User; access_token: string; refresh_token: string } => {
  const { user, session } = data;

  return {
    user,
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  };
};

const mapSupabaseUserToUser = (supabaseUser: SupabaseUser): User => {
  return {
    id: supabaseUser.id,
    aud: supabaseUser.aud,
    role: supabaseUser.role || "",
    email: supabaseUser.email || "",
  };
};

export const authCreateUser = async (email: string, password: string) => {
  const lowerCaseEmail = email.toLowerCase();

  try {
    const { data, error } = await supabase.auth.signUp({
      email: lowerCaseEmail,
      password,
    });

    if (error) {
      console.error(`Error al crear el usuario: ${error.message}`);
      throw error;
    }

    console.log("Usuario creado:", data);

    if (data && data.user) {
      return mapSupabaseUserToUser(data.user);
    }

    return null;
  } catch (error) {
    console.error("Error en authCreateUser:", error);
    throw new Error(`Error al crear el usuario: ${error}`);
  }
};

export const authSingIn = async (email: string, password: string) => {
  const lowerCaseEmail = email.toLowerCase();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: lowerCaseEmail,
      password,
    });

    if (error) {
      throw new Error(`Error al iniciar sesión ${error.message}`);
    }

    if (data) {
      console.log(data);
      const user = mapSupabaseUserToUser(data.user);
      return returnUserToken({ user, session: data.session });
    }
  } catch (error) {
    console.log("Error al iniciar sesión", error);
    throw new Error(`Error al iniciar sesión ${error}`);
  }
};

export const authRefreshSession = async (refresh_token: string) => {
  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      throw new Error(`Error al refrescar la sesión: ${error.message}`);
    }

    if (!data || !data.user || !data.session) {
      throw new Error("No se pudieron obtener los datos de usuario o sesión");
    }

    const user = mapSupabaseUserToUser(data.user);
    return returnUserToken({ user, session: data.session });
  } catch (error) {
    console.error("Error al refrescar la sesión", error);
    throw new Error(`Error al refrescar la sesión: ${error}`);
  }
};

export const AuthlogOut = async () => {
  try {
    await supabase.auth.signOut();
    await SecureStorageAdapter.deleteItem("access_token");
    await SecureStorageAdapter.deleteItem("refresh_token");
    console.log("Sesión cerrada");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
