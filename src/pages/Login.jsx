import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Vérifier si l'email existe dans la table users
      const { data, error } = await supabase
        .from("users")
        .select("full_name")
        .eq("email", email)
        .single();

      if (error || !data) {
        setMessage("Aucun compte trouvé avec cet email");
      } else {
        setUserName(data.full_name || email.split('@')[0]);
        setStep("password");
      }
    } catch (error) {
      setMessage("Erreur lors de la vérification de l'email");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Vérifier le mot de passe maître dans la table users
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, master_password, full_name")
        .eq("email", email)
        .single();

      if (userError || !userData) {
        setMessage("Erreur d'authentification");
        return;
      }

      if (masterPassword === userData.master_password) {
        // Connexion avec Supabase Auth
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password: masterPassword,
        });

        if (authError) {
          setMessage("Erreur d'authentification: " + authError.message);
          return;
        }

        // Stocker les informations dans le localStorage
        localStorage.setItem("user_id", userData.id);
        localStorage.setItem("user_email", email);
        localStorage.setItem("master_password", masterPassword);
        navigate("/dashboard");
      } else {
        setMessage("Mot de passe maître incorrect");
      }
    } catch (error) {
      setMessage("Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
      {/* Logo avec espacement de 40px depuis le haut */}
      <div className="mt-10">
        <img 
          src="/src/assets/mipass logo.png" 
          alt="Logo Mi-Pass" 
          className="h-16 w-auto mx-auto"
        />
      </div>
      
      {/* Titre CONNEXION avec espacement de 40px depuis le logo */}
      <div className="my-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Connexion
        </h2>
        <p className="text-gray-600">Accédez à votre coffre-fort</p>
      </div>

      {/* Formulaire de connexion sans container */}
      {step === "email" ? (
        <form onSubmit={handleEmailSubmit} className="w-full max-w-sm flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm"
            disabled={loading}
          >
            {loading ? "Vérification..." : "Continuer"}
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm flex flex-col gap-5">
          <div className="text-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Content de vous revoir
              {userName && (
                <>
                  <span className="hidden md:inline">, </span>
                  <span className="block md:inline mt-1 md:mt-0 text-orange-600">
                    {userName}
                  </span>
                  
                </>
              )}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Veuillez entrer votre mot de passe maître
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Mot de passe maître
            </label>
            <input
              id="password"
              type="password"
              placeholder="Mot de passe maître"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="p-3.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
            <button
              type="button"
              onClick={handleBackToEmail}
              className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
              disabled={loading}
            >
              Retour
            </button>
          </div>
        </form>
      )}

      {message && (
        <div className="w-full max-w-sm mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-center text-sm">
          {message}
        </div>
      )}

      {step === "email" && (
        <p className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <a href="/signup" className="text-orange-600 hover:underline font-medium">
            Créez-en un
          </a>
        </p>
      )}
    </div>
  );
}