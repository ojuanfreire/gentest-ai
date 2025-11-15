import { supabase } from "../../../api/supabaseClient";

export const signUp = async (name: string, email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // O signUp retorna dados de usuário e sessão
  return data.user; 
};