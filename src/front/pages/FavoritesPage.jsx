import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faHeart } from "@fortawesome/free-solid-svg-icons";

export const FavoritesPage = () => {
  const { store, dispatch } = useGlobalReducer();

  const removeFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorite/${favoriteId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Error al eliminar favorito");

      const updatedResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorite/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedFavorites = await updatedResponse.json();
      dispatch({ type: "handleFavorites", payload: updatedFavorites });
      toast.success("Favorito eliminado");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
    <div className="container text-center py-5 mt-5">
      <h2 className="landing-t1">Mis Favoritos</h2>
      <div className="row justify-content-center">
        {store.favorites.length > 0 ? (
          store.favorites.map((fav) => (
            <motion.div
              key={fav.id}
              className="col-md-3 my-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <motion.div
                className="card h-100 shadow-sm"
                initial={{ scale: 1, zIndex: 1 }}
                whileHover={{ scale: 1.03, zIndex: 1000 }}
                transition={{ duration: 0.05, ease: "easeInOut" }}
              >
                {fav.activity?.img && (
                  <img
                    src={fav.activity.img}
                    className="card-img-top"
                    alt={fav.activity.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{fav.activity?.name}</h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="landing-t3 p-2" style={{ fontSize: "1.5rem", color: "#333333ff" }}>
                      {fav.activity?.price}€
                    </span>
                </div>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                  <Link to={`/activities/${fav.activity_id}`}>
                    <motion.button
                      className="btn expCard-btn-b expCard-btn-txt rounded-pill mt-3 mb-3 border-0 text-white"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      Ver detalles
                    </motion.button>
                  </Link>
                  <motion.button
                    className="btn btn-sm border-0"
                    onClick={() => removeFavorite(fav.id)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-danger" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))
        ) : (
          <div className="col-12 text-center">
            <h4 className="landing-t2 fs-5">No tienes favoritos guardados</h4>
            <Link to="/">
              <motion.button
                className="btn-primary py-2 expCard-btn-txt px-3 rounded-pill mt-5 mb-3 border-0 text-white"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                Ver actividades
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};