import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">Experience365</span>
        </Link>
        <div className="ml-auto d-flex gap-2">

          {/* Nuevos enlaces añadidos */}
          <Link to="/activities">
            <button className="btn btn-outline-secondary">
              Ver Actividades
            </button>
          </Link>

          <Link to="/register">
            <button className="btn btn-outline-primary">Registrarse</button>
          </Link>
          <Link to="/login">
            <button className="btn btn-primary">Iniciar sesión</button>
          </Link>
          <Link to="/registerprofessional"> 
            <button className="btn btn-primary">Registro profesional</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};