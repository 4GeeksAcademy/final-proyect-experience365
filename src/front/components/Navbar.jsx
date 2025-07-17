import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { meUser } from "../services/loginUser.js";
import useGlobalReducer from "../hooks/useGlobalReducer";

import logo_experience365 from "../assets/img/logo-experience365.svg";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
    window.addEventListener("scroll", () => {
      if (scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({
      type: "SET_SESSION",
      payload: false
    })
    dispatch({
      type: "SET_USER",
      payload: {}
    })
  };

  // const handleProfileClick = () => {
  //   navigate("/edit-profile");
  // };
  const handleProfileClick = () => {
    // Si el usuario es profesional, lo redirige a /edit-professional-profile
    if (store.user.role === "professional") {
      navigate("/edit-professional-profile");
    } else {
      // Si es un usuario normal, lo redirige a /edit-profile
      navigate("/edit-profile");
    }
  };
  return (
    <motion.nav
      className="navbar fixed-top"
      animate={{ y: isScrolled ? "-100%" : "0%", transition: { duration: 0.4 } }}
    >
      <div className="container-fluid">
        <Link to="/">
          <span className="navbar-brand align-content-baseline">

            {/* Imagen Logo svg experience365 */}
            <img src={logo_experience365}
              alt="Logo"
              width="100px"
              className="d-inline-block align-text-top m-sm-3 m-1"
            />
          </span>
        </Link>

        <div className="d-flex justify-content-end align-items-center">
          {!store.sesion && (
            <button
              className="btn text-white"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              Inicia Sesión
            </button>
          )}

          <div className="btn-group">
            <button
              type="button"
              className="btn m-2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="navbar-toggler-icon navbar-dark text-white"></span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              {store.sesion ? (
                <>
                  <li>

                    <h3
                      className="dropdown-item text-dark h1 fs-5"
                      type="button"
                      onClick={handleProfileClick}
                    >

                      {store.user.email}
                    </h3>
                  </li>
                  <hr />

                  {/* Opción diferente según rol */}
                  {store.user.role === 'professional' ? (
                    <>
                      <li>
                        <Link to="/activities/create" className="dropdown-item">
                          <i className="bi bi-plus-circle me-2"></i>
                          Crear actividad
                        </Link>
                      </li>
                      <li>
                        <Link to="/my-activities" className="dropdown-item">
                          <i className="bi bi-calendar-check me-2"></i>
                          Mis Actividades
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/favorites" className="dropdown-item d-flex align-items-center">
                          <i className="bi bi-heart-fill me-2 text-danger"></i>
                          Favoritos
                          {store.favorites.length > 0 && (
                            <span className="ms-2 badge bg-danger rounded-pill">
                              {store.favorites.length}
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link to="/my-reservations" className="dropdown-item">
                          <i className="bi bi-calendar-check me-2"></i>
                          Mis reservas
                        </Link>
                      </li>
                    </>
                  )}

                  <hr />
                  <li>
                    <button className="dropdown-item" type="button" onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/register" className="dropdown-item">
                      Regístrate como usuario
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <Link to="/registerprofessional" className="dropdown-item">
                      Regístrate como profesional
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};