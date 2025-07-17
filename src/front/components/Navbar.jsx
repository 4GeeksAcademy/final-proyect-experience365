import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { meUser } from "../services/loginUser.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faBars, faUserLarge } from "@fortawesome/free-solid-svg-icons";
import useGlobalReducer from "../hooks/useGlobalReducer";

import logo_experience365 from "../assets/img/logo-experience365.svg";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <motion.nav
      className="navbar fixed-top"
      animate={{ y: isScrolled ? "-100%" : "0%", transition: { duration: 0.4 } }}
    >
      <div className="container-fluid">
        <Link to="/">
          <span
            className="navbar-brand align-content-baseline"

          >

            {/* Imagen Logo svg experience365 */}
            <motion.img
              src={logo_experience365}
              alt="Logo"
              width="100px"
              className="d-inline-block align-text-top m-sm-3 m-1"
              transition={{ duration: 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.99 }}
            />
          </span>
        </Link>

        {/* Botón Iniciar Sesión */}
        <div className="d-flex">
          {!store.sesion && (
            <motion.button
              className="btn text-white border-0 landing-t3 fs-6 justify-content-center align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
              initial={{ opacity: 1, y: -1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              Inicia Sesión
            </motion.button>
          )}

          {/* Menú desplegable */}
          <div className="btn-group">
            <div className="d-flex align-items-center justify-content-center">
              <motion.button
                type="button"
                className="btn m-2 text-white border-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                initial={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {!store.user.role && (
                  <FontAwesomeIcon icon={faBars} style={{ fontSize: "1.5rem" }} />
                )}
                {store.user.role === "professional" && (
                  <FontAwesomeIcon icon={faUserTie} style={{ fontSize: "1.5rem" }} />
                )}
                {store.user.role === "user" && (
                  <FontAwesomeIcon icon={faUserLarge} style={{ fontSize: "1.5rem" }} />
                )
                }

              </motion.button>
              <ul className="dropdown-menu dropdown-menu-end">
                {store.sesion ? (
                  <>
                    <li>
                      <h3 className="dropdown-item text-dark bg-transparent expCard-menu-user mt-2" type="button">
                        {store.user.email}
                      </h3>
                    </li>
                    <hr />

                    {/* Opción diferente según rol */}
                    {store.user.role === 'professional' ? (
                      <>
                        <li>
                          <Link to="/activities/create" className="dropdown-item bg-transparent expCard-menu">
                            <i className="bi bi-plus-circle me-2"></i>
                            Crear actividad
                          </Link>
                        </li>
                        <li>
                          <Link to="/my-activities" className="dropdown-item bg-transparent expCard-menu">
                            <i className="bi bi-calendar-check me-2"></i>
                            Mis Actividades
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link to="/favorites" className="dropdown-item bg-transparent expCard-menu d-flex align-items-center">
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
                          <Link to="/my-reservations" className="dropdown-item bg-transparent expCard-menu">
                            <i className="bi bi-calendar-check me-2"></i>
                            Mis reservas
                          </Link>
                        </li>
                      </>
                    )}

                    <hr />
                    <li>
                      <button className="dropdown-item bg-transparent expCard-menu-close mb-2" type="button" onClick={logout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Cerrar Sesión
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/register" className="dropdown-item bg-transparent expCard-menu mt-2">
                        <FontAwesomeIcon icon={faUserLarge} className="me-2" />
                        Regístrate como usuario
                      </Link>
                    </li>
                    <hr />
                    <li>
                      <Link to="/registerprofessional" className="dropdown-item bg-transparent expCard-menu pb-2">
                        <FontAwesomeIcon icon={faUserTie} className="me-2" />
                        Regístrate como profesional
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};