import { supabase } from "../../../database/supabase/db.supabase";
import { User } from '../interfaces/auth.interface';
import { Session, User as SupabaseUser } from '@supabase/auth-js';


const returnUserToken = (data: { user: User, session: Session }): { user: User, token: string } => {
    const { user, session } = data;

    return {
        user,
        token: session.access_token,
    };
};


const mapSupabaseUserToUser = (supabaseUser: SupabaseUser): User => {
    return {
        id: supabaseUser.id,
        aud: supabaseUser.aud,
        role: supabaseUser.role || '',
        email: supabaseUser.email || '',
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
            throw new Error(`Error al iniciar sesión ${error.message}`)
        }

        if (data) {
            console.log(data)
            const user = mapSupabaseUserToUser(data.user);
            return returnUserToken({ user, session: data.session });
        }

    } catch (error) {
        console.log("Error al iniciar sesión", error)
        throw new Error(`Error al iniciar sesión ${error}`)
    }
}