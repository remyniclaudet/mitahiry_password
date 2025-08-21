import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [confirmMasterPassword, setConfirmMasterPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [resendMsg, setResendMsg] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalide";
    if (!fullName) newErrors.fullName = "Le nom complet est requis";
    if (!masterPassword) newErrors.masterPassword = "Le mot de passe maître est requis";
    else if (masterPassword.length < 8) newErrors.masterPassword = "Minimum 8 caractères";
    if (masterPassword !== confirmMasterPassword) {
      newErrors.confirmMasterPassword = "Les mots de passe ne correspondent pas";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setMessage("");
    setErrors({});
    try {
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email);

      if (checkError) {
        setMessage("Erreur lors de la vérification de l'email");
        setLoading(false);
        return;
      }
      if (existingUsers && existingUsers.length > 0) {
        setMessage("Cet email possède déjà un compte.");
        setLoading(false);
        return;
      }
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: masterPassword,
        options: {
          data: {
            master_password: masterPassword,
            full_name: fullName
          },
          emailRedirectTo: `${window.location.origin}/auth-confirm`
        }
      });
      if (signUpError) {
        setMessage("Erreur lors de la création du compte : " + signUpError.message);
        setLoading(false);
        return;
      }
      navigate("/auth-confirm");
    } catch (error) {
      setMessage("Une erreur est survenue lors de l'inscription: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg("");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });
    if (error) {
      setResendMsg("Erreur lors de l'envoi : " + error.message);
    } else {
      setResendMsg("Email de confirmation renvoyé !");
    }
    setResendLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
      {/* Logo avec espacement de 40px depuis le haut */}
      <div className="mt-10">
        <img 
          src="/mipasslogo.png" 
          alt="Logo Mi-Pass" 
          className="h-16 w-auto mx-auto"
        />
      </div>
      
      {/* Titre INSCRIPTION avec espacement de 40px depuis le logo */}
      <div className="my-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-2">
          Inscription
        </h2>
        <p className="text-gray-600">Créez votre compte Mi-Pass</p>
      </div>

      {/* Formulaire d'inscription sans container */}
      <form onSubmit={handleSignup} className="w-full max-w-sm flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`p-3.5 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
            Nom complet
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Votre nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`p-3.5 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="masterPassword" className="text-sm font-medium text-gray-700">
            Mot de passe maître
          </label>
          <input
            id="masterPassword"
            type="password"
            placeholder="Créez un mot de passe maître"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            className={`p-3.5 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
              errors.masterPassword ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.masterPassword && <p className="text-red-500 text-sm mt-1">{errors.masterPassword}</p>}
          <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmMasterPassword" className="text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmMasterPassword"
            type="password"
            placeholder="Confirmez votre mot de passe"
            value={confirmMasterPassword}
            onChange={(e) => setConfirmMasterPassword(e.target.value)}
            className={`p-3.5 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
              errors.confirmMasterPassword ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.confirmMasterPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmMasterPassword}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm mt-2"
          disabled={loading}
        >
          {loading ? "Création en cours..." : "Créer mon compte"}
        </button>
      </form>

      {/* Bouton renvoi email si inscription déjà tentée */}
      {message && message.includes("possède déjà un compte") && (
        <div className="w-full max-w-sm mt-4 flex flex-col items-center">
          <button
            className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
            onClick={handleResend}
            disabled={resendLoading}
          >
            {resendLoading ? "Envoi en cours..." : "Renvoyer l’email de confirmation"}
          </button>
          {resendMsg && (
            <div className="mt-2 text-orange-600">{resendMsg}</div>
          )}
        </div>
      )}

      {message && (
        <div className="w-full max-w-sm mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-center text-sm">
          {message}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Déjà un compte ?{" "}
        <a href="/login" className="text-orange-600 hover:underline font-medium">
          Connectez-vous
        </a>
      </p>
    </div>
  );
}