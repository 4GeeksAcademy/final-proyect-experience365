import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { motion } from "framer-motion";

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

      // Actualizar lista de favoritos
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
    <div className="container py-5">
      <h2 className="mb-4">Mis Favoritos</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {store.favorites.length > 0 ? (
          store.favorites.map((fav) => (
            <motion.div
              key={fav.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="col"
            >
              <div className="card h-100 shadow-sm">
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
                    <span className="badge bg-primary rounded-pill">
                      {fav.activity?.price} €
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between">
                  <Link
                    to={`/activities/${fav.activity_id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Ver detalles
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFavorite(fav.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <h4>No tienes favoritos guardados</h4>
            <Link to="/activities" className="btn btn-primary mt-3">
              Explorar actividades
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};