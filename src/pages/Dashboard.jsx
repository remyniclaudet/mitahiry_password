import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

export default function Dashboard() {
  const [credentials, setCredentials] = useState([]);
  const [filteredCredentials, setFilteredCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, categories: {} });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPassword, setShowPassword] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [editingCredential, setEditingCredential] = useState(null);
  const [credentialToDelete, setCredentialToDelete] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      const userId = session.user.id;
      const mp = localStorage.getItem("master_password");
      setUser({
        id: userId,
        email: session.user.email,
        full_name: session.user.user_metadata.full_name || session.user.email.split('@')[0],
      });
      setMasterPassword(mp);
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    if (user && masterPassword) fetchCredentials();
  }, [user, masterPassword]);

  useEffect(() => {
    filterCredentials();
  }, [credentials, searchTerm, selectedCategory]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("passwords")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des mots de passe:", error);
        setCredentials([]);
        setStats({ total: 0, categories: {} });
      } else {
        setCredentials(data);
        // Statistiques
        const categories = {};
        data.forEach((c) => {
          if (c.category) categories[c.category] = (categories[c.category] || 0) + 1;
        });
        setStats({
          total: data.length,
          categories,
        });
      }
    } catch (error) {
      console.error("Exception lors du chargement:", error);
      setCredentials([]);
      setStats({ total: 0, categories: {} });
    } finally {
      setLoading(false);
    }
  };

  const filterCredentials = () => {
    let filtered = credentials;
    
    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.site.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtrer par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }
    
    setFilteredCredentials(filtered);
  };

  const encryptPassword = (pwd) => {
    return CryptoJS.AES.encrypt(pwd, masterPassword).toString();
  };

  const decryptPassword = (cipher) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipher, masterPassword);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return "Erreur de décryptage";
    }
  };

  const generateStrongPassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(password);
    showToast("Mot de passe généré avec succès", "success");
  };

  const addCredential = async (e) => {
    e.preventDefault();
    if (!site || !username || !password) {
      showToast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }
    
    try {
      const { error } = await supabase.from("passwords").insert([
        {
          user_id: user.id,
          site,
          username,
          password_encrypted: encryptPassword(password),
          category: category || null,
          description: description || null,
        },
      ]);
      
      if (error) {
        console.error("Erreur lors de l'ajout:", error);
        showToast("Erreur lors de l'ajout du mot de passe", "error");
      } else {
        setSite("");
        setUsername("");
        setPassword("");
        setCategory("");
        setDescription("");
        setShowAddForm(false);
        fetchCredentials();
        showToast("Mot de passe ajouté avec succès", "success");
      }
    } catch (error) {
      console.error("Exception lors de l'ajout:", error);
      showToast("Erreur lors de l'ajout du mot de passe", "error");
    }
  };

  const updateCredential = async (e) => {
    e.preventDefault();
    if (!site || !username || !password) {
      showToast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("passwords")
        .update({
          site,
          username,
          password_encrypted: encryptPassword(password),
          category: category || null,
          description: description || null,
        })
        .eq("id", editingCredential.id);
      
      if (error) {
        console.error("Erreur lors de la modification:", error);
        showToast("Erreur lors de la modification du mot de passe", "error");
      } else {
        setSite("");
        setUsername("");
        setPassword("");
        setCategory("");
        setDescription("");
        setEditingCredential(null);
        setShowAddForm(false);
        fetchCredentials();
        showToast("Mot de passe modifié avec succès", "success");
      }
    } catch (error) {
      console.error("Exception lors de la modification:", error);
      showToast("Erreur lors de la modification du mot de passe", "error");
    }
  };

  const deleteCredential = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce mot de passe ?")) {
      try {
        const { error } = await supabase.from("passwords").delete().eq("id", id);
        if (error) {
          showToast("Erreur lors de la suppression du mot de passe", "error");
        } else {
          fetchCredentials();
          showToast("Mot de passe supprimé avec succès", "success");
        }
      } catch (error) {
        showToast("Erreur lors de la suppression du mot de passe", "error");
      }
    }
  };

  const confirmDeleteCredential = async () => {
    if (!credentialToDelete) return;
    try {
      const { error } = await supabase.from("passwords").delete().eq("id", credentialToDelete);
      if (error) {
        showToast("Erreur lors de la suppression du mot de passe", "error");
      } else {
        fetchCredentials();
        showToast("Mot de passe supprimé avec succès", "success");
      }
    } catch (error) {
      showToast("Erreur lors de la suppression du mot de passe", "error");
    } finally {
      setShowDeletePopup(false);
      setCredentialToDelete(null);
    }
  };

  const editCredential = (credential) => {
    setEditingCredential(credential);
    setSite(credential.site);
    setUsername(credential.username);
    setPassword(decryptPassword(credential.password_encrypted));
    setCategory(credential.category || "");
    setDescription(credential.description || "");
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingCredential(null);
    setSite("");
    setUsername("");
    setPassword("");
    setCategory("");
    setDescription("");
    setShowAddForm(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copié dans le presse-papier", "success");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Obtenir l'initiale du nom pour l'avatar
  const getUserInitial = () => {
    if (!user?.full_name) return "U";
    return user.full_name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR AMÉLIORÉE */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src="/mipasslogo.png" alt="Logo Mi-Pass" className="h-10 w-auto" />
          </div>
          
          <div className="flex items-center gap-4">
            {/* Barre de recherche dans la navbar */}
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            {/* Avatar avec dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors"
              >
                {getUserInitial()}
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-500 cursor-not-allowed"
                    disabled
                    title="Fonctionnalité à venir"
                  >
                    Supprimer le compte
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* En-tête avec bouton d'ajout */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Bouton Ajouter un mot de passe */}
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Ajouter un mot de passe
            </button>
            {/* Barre de recherche mobile */}
            <div className="md:hidden relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            {/* SUPPRIME LE SELECT CATEGORIES */}
          </div>
        </div>

        {/* Statistiques améliorées */}
        <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6">
          <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col items-center transition-transform hover:scale-105">
            <div className="p-2 md:p-3 bg-orange-100 rounded-full mb-2 md:mb-3">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-700 mb-1 md:mb-2">Mots de passe</h3>
            <span className="text-2xl md:text-4xl font-bold text-orange-600">{stats.total}</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col items-center transition-transform hover:scale-105">
            <div className="p-2 md:p-3 bg-green-100 rounded-full mb-2 md:mb-3">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-700 mb-1 md:mb-2">Dernier ajout</h3>
            <span className="text-xs md:text-sm text-gray-600 text-center">
              {credentials[0]?.site
                ? `${credentials[0].site}`
                : "Aucun"}
            </span>
          </div>
        </section>

        {/* Formulaire d'ajout/modification */}
        {showAddForm && (
          <section className="mb-6 bg-white p-4 md:p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCredential ? "Modifier le mot de passe" : "Ajouter un nouveau mot de passe"}
              </h3>
              <button
                onClick={cancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form onSubmit={editingCredential ? updateCredential : addCredential} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site / Application *</label>
                <input
                  type="text"
                  placeholder="ex: google.com"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant *</label>
                <input
                  type="text"
                  placeholder="ex: mon.email@gmail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                <div className="relative">
                  <input
                    type={showPassword.add ? "text" : "password"}
                    placeholder="Mot de passe fort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-24"
                    required
                  />
                  <div className="absolute right-1 top-1 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, add: !showPassword.add })}
                      className="p-2 text-gray-500 hover:text-gray-700"
                      title={showPassword.add ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword.add ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(password)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                      title="Copier le mot de passe"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={generateStrongPassword}
                      className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded hover:bg-orange-200"
                      title="Générer un mot de passe fort"
                    >
                      Générer
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <input
                  type="text"
                  placeholder="ex: Réseaux sociaux"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
                <textarea
                  placeholder="Notes supplémentaires..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium flex items-center gap-2"
                >
                  {editingCredential ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Liste des mots de passe améliorée */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Vos mots de passe</h3>
            <span className="text-sm text-gray-500">
              {filteredCredentials.length} {filteredCredentials.length === 1 ? 'élément' : 'éléments'}
            </span>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40 bg-white rounded-xl shadow">
              <div className="animate-pulse text-orange-600">Chargement de vos mots de passe...</div>
            </div>
          ) : filteredCredentials.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <p className="text-gray-500 mb-2">Aucun mot de passe trouvé</p>
              <p className="text-sm text-gray-400">Ajoutez votre premier mot de passe ou modifiez vos filtres</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredCredentials.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{c.site}</p>
                          <p className="text-sm text-gray-600">{c.username}</p>
                          {c.description && (
                            <p className="text-sm text-gray-500 mt-1">{c.description}</p>
                          )}
                        </div>
                      </div>
                      
                     
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <input
                          type={showPassword[c.id] ? "text" : "password"}
                          value={decryptPassword(c.password_encrypted)}
                          readOnly
                          className="pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(c.id)}
                          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword[c.id] ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(decryptPassword(c.password_encrypted))}
                          className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          title="Copier le mot de passe"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => editCredential(c)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => {
                            setCredentialToDelete(c.id);
                            setShowDeletePopup(true);
                          }}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-3">
                    Ajouté le {new Date(c.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Toast notifications */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-transform duration-300 ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Popup de confirmation de suppression */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmation</h3>
            <p className="mb-6 text-gray-700">Êtes-vous sûr de vouloir supprimer ce mot de passe ?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowDeletePopup(false); setCredentialToDelete(null); }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteCredential}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}