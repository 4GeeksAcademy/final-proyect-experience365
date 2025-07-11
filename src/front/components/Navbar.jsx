import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { meUser } from "../services/loginUser.js";

import useGlobalReducer from "../hooks/useGlobalReducer";
import { s } from "framer-motion/client";

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

    console.log(store);

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
          <span className="navbar-brand align-content-baseline">

            {/* Imagen Logo svg experience365 */}
            <img src="src/front/assets/img/logo-experience365.svg"
              alt="Logo"
              width="100px"
              className="d-inline-block align-text-top m-sm-3 m-1"
            />
          </span>
        </Link>
        <div>

          {/* Botón de inicio de usuario modal */}
          {!store.sesion && (
            <button
              className="btn text-white"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >Inicia Sesión
            </button>)}

          {/* Modal de inicio de usuario esta en oculto en el main.jsx*/}

          {/* Menu desplegable*/}
          <div className="btn-group">
            <button
              type="button"
              className="btn m-2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="navbar-toggler-icon navbar-dark"></span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">{
              store.sesion &&
              <li><button className="dropdown-item text-dark h1 fs-5" type="button">{store.user.email}</button></li>}
              <li><button className="dropdown-item" type="button">Action</button></li>
              <li><button className="dropdown-item" type="button">Another action</button></li>
              <li><button className="dropdown-item" type="button" onClick={logout}>Cerrar Sesión</button></li>
            </ul>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};