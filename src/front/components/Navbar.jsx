import { Link } from "react-router-dom";
import { FavoritesDropdown } from "./FavoritesDropdown";

export const Navbar = () => {

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

          <FavoritesDropdown />
          
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