import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AuthConfirm() {
  const navigate = useNavigate();
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      // Récupère l'utilisateur depuis Supabase Auth
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Vérifie la confirmation de l'email
        const emailConfirmed = user.email_confirmed_at || user.confirmed_at;
        if (!emailConfirmed) {
          // Email non confirmé, reste sur la page de confirmation
          return;
        }

        // Vérifier si l'utilisateur existe déjà dans la table users
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (checkError || !existingUser) {
          // Créer l'utilisateur s'il n'existe pas
          await supabase
            .from('users')
            .insert([
              { 
                id: user.id, 
                email: user.email,
                full_name: user.user_metadata.full_name || user.email.split('@')[0],
                master_password: user.user_metadata.master_password
              }
            ]);
        }

        // Stocker les informations dans le localStorage
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("master_password", user.user_metadata.master_password);

        clearInterval(intervalRef.current); // Stop la boucle
        navigate("/dashboard");
      }
    }, 3000); // Vérifie toutes les 3 secondes

    return () => clearInterval(intervalRef.current);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 shadow rounded-xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Confirmation en cours...
        </h2>
        <p className="text-gray-600">
          Veuillez cliquer sur le lien reçu par email pour activer votre compte.<br />
          Cette page se mettra à jour automatiquement après confirmation.
        </p>
      </div>
    </div>
  );
}