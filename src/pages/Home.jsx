import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../index.css';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white text-gray-800">
      {/* HEADER / NAV */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <img 
              src="/mipasslogo.png" 
              alt="Logo Mi-Pass" 
              className="h-10 w-auto mr-2 transition-transform duration-300 hover:scale-105"
            />
          </div>

          <nav className="hidden md:flex gap-6 text-gray-600 font-medium items-center">
            <a href="#home" className="hover:text-orange-600 transition-colors duration-300 hover:scale-105">Accueil</a>
            <a href="#about" className="hover:text-orange-600 transition-colors duration-300 hover:scale-105">À propos</a>
            <a href="#features" className="hover:text-orange-600 transition-colors duration-300 hover:scale-105">Fonctionnalités</a>
            <a href="#security" className="hover:text-orange-600 transition-colors duration-300 hover:scale-105">Sécurité</a>
            <Link to="/login" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg">
              Connexion
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 text-2xl z-50"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Mobile menu overlay */}
          {menuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMenuOpen(false)}></div>
          )}

          {/* Mobile menu */}
          <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <img 
                  src="/mipasslogo.png" 
                  alt="Logo Mi-Pass" 
                  className="h-8 w-auto"
                />
                <button onClick={() => setMenuOpen(false)} className="text-gray-500 text-xl">✕</button>
              </div>
              <div className="flex flex-col gap-6 flex-1">
                <a href="#home" onClick={() => setMenuOpen(false)} className="text-lg font-medium hover:text-orange-600 transition-colors py-2">Accueil</a>
                <a href="#about" onClick={() => setMenuOpen(false)} className="text-lg font-medium hover:text-orange-600 transition-colors py-2">À propos</a>
                <a href="#features" onClick={() => setMenuOpen(false)} className="text-lg font-medium hover:text-orange-600 transition-colors py-2">Fonctionnalités</a>
                <a href="#security" onClick={() => setMenuOpen(false)} className="text-lg font-medium hover:text-orange-600 transition-colors py-2">Sécurité</a>
                <div className="mt-auto pb-6">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block w-full bg-orange-600 text-white text-center py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                    Connexion
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="block w-full border border-orange-600 text-orange-600 text-center py-3 rounded-lg mt-3 hover:bg-orange-50 transition-colors font-medium">
                    Créer un compte
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="pt-32 pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Gérez vos mots de passe en toute <span className="text-orange-600">sécurité</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Une application simple, sécurisée et gratuite pour stocker, générer et protéger tous vos mots de passe en un seul endroit.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-100">
            <Link to="/signup" className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Commencer gratuitement
            </Link>
            <a href="#features" className="border border-orange-600 text-orange-600 px-8 py-4 rounded-lg hover:bg-orange-50 transition-all duration-300 font-medium text-lg">
              Découvrir les fonctionnalités
            </a>
          </div>

          {/* Visuel amélioré */}
          <div className="mt-16 animate-float">
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-2xl shadow-2xl border border-orange-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="h-4 bg-orange-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-orange-100 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-10 bg-orange-50 rounded-lg border border-orange-200 flex items-center px-4">
                    <div className="h-4 bg-orange-200 rounded w-full"></div>
                    <svg className="w-5 h-5 text-orange-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pourquoi choisir Mi-Pass ?</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Mi-Pass est conçu pour vous aider à gérer vos identifiants facilement et en toute sécurité, 
              sans compromis sur la protection de vos données.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="bg-orange-50 p-8 rounded-2xl shadow-lg">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Simplifiez votre vie numérique</h4>
                <p className="text-gray-600 mb-6">
                  Plus besoin de retenir des dizaines de mots de passe complexes. Mi-Pass s'occupe de tout 
                  pour que vous puissiez vous concentrer sur l'essentiel.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Accès rapide à tous vos comptes</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Synchronisation sécurisée</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Interface intuitive et moderne</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-orange-100 to-amber-50 p-8 rounded-2xl shadow-lg">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Sécurité renforcée</h4>
                <p className="text-gray-600 mb-6">
                  Vos données sont protégées par un chiffrement de pointe et des protocoles de sécurité avancés.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Chiffrement AES-256</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Authentification à deux facteurs</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Zero-knowledge architecture</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fonctionnalités principales</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez toutes les fonctionnalités conçues pour simplifier la gestion de vos mots de passe
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Stockage chiffré",
                description: "Sauvegardez vos mots de passe dans une base protégée par chiffrement robuste.",
                icon: "🔒"
              },
              {
                title: "Générateur puissant",
                description: "Créez des mots de passe forts et uniques avec des options personnalisables.",
                icon: "⚡"
              },
              {
                title: "Recherche & catégories",
                description: "Classez par dossiers et retrouvez tout en 1 clic avec notre moteur de recherche.",
                icon: "📂"
              },
              {
                title: "Copie rapide",
                description: "Copiez un mot de passe au presse-papiers avec auto-effacement après utilisation.",
                icon: "📋"
              },
              {
                title: "Multi-plateforme",
                description: "Interface responsive, utilisable sur mobile, tablette et ordinateur.",
                icon: "📱"
              },
              {
                title: "Export/Import",
                description: "Récupérez vos données en toute sécurité, quand vous le souhaitez.",
                icon: "📤"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sécurité avant tout 🔒</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Mi-Pass repose sur des technologies de pointe pour garantir la protection de vos données sensibles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-orange-50 p-6 rounded-2xl text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h5 className="font-semibold text-gray-900 mb-2">Auth & e-mail</h5>
              <p className="text-gray-600 text-sm">Inscription avec confirmation par e-mail, réinitialisation sécurisée de mot de passe.</p>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-2xl text-center animate-fade-in-up delay-200">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h5 className="font-semibold text-gray-900 mb-2">Bonnes pratiques</h5>
              <p className="text-gray-600 text-sm">Mots de passe forts, 2FA, expiration de session et protection contre les attaques.</p>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-2xl text-center animate-fade-in-up delay-400">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h5 className="font-semibold text-gray-900 mb-2">Chiffrement</h5>
              <p className="text-gray-600 text-sm">Stockage chiffré côté serveur, options de chiffrement local avec mot de passe maître.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 animate-pulse">Prêt à sécuriser vos mots de passe ?</h3>
          <p className="text-lg text-orange-100 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à Mi-Pass pour gérer leurs identifiants en toute sécurité.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-orange-50 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Créer un compte gratuit
            </Link>
            <Link to="/login" className="border border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-orange-600 transition-all duration-300 font-medium text-lg">
              Se connecter
            </Link>
          </div>
          <p className="mt-6 text-orange-200 text-sm">Aucune carte de crédit requise • Essai gratuit</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-orange-100 py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="font-bold text-white text-xl">Mi-Pass</span>
              </div>
              <p className="text-orange-200 text-sm">
                Votre gestionnaire de mots de passe sécurisé et simple d'utilisation.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-orange-200 hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#security" className="text-orange-200 hover:text-white transition-colors">Sécurité</a></li>
                <li><a href="#" className="text-orange-200 hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="text-orange-200 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-orange-200 hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="text-orange-200 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-orange-200 hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="text-orange-200 hover:text-white transition-colors">Presse</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-orange-200 hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="text-orange-200 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-orange-200 hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="text-orange-200 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-orange-200 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Mi-Pass. Tous droits réservés.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-orange-200 hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="text-orange-200 hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="text-orange-200 hover:text-white transition-colors">Cookies</a>
              <a href="#" className="text-orange-200 hover:text-white transition-colors">Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}