import { Link } from "react-router-dom";
import { FavoritesDropdown } from "./FavoritesDropdown";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const updateFavorites = () => {
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorite/user`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setFavoritesCount(data.length))
        .catch(console.error);
      }
    };

    // Escuchar eventos de actualización
    window.addEventListener('favoritesUpdated', updateFavorites);
    updateFavorites(); // Carga inicial
    
    return () => window.removeEventListener('favoritesUpdated', updateFavorites);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">Experience365</span>
        </Link>
        
        <div className="d-flex align-items-center gap-3">
          <Link to="/activities">
            <button className="btn btn-outline-secondary">
              Ver Actividades
            </button>
          </Link>

          <FavoritesDropdown onUpdate={(favorites) => setFavoritesCount(favorites.length)} />
          
          <div className="d-flex gap-2">
            <Link to="/register">
              <button className="btn btn-outline-primary">Registrarse</button>
            </Link>
            <Link to="/login">
              <button className="btn btn-primary">Iniciar sesión</button>
            </Link>
            <Link to="/registerprofessional">
              <button className="btn btn-primary">
                Registro Profesional
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};