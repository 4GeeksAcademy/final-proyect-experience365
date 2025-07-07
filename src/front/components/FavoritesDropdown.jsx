import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const FavoritesDropdown = () => {
  const { store, dispatch } = useGlobalReducer()
  const [isOpen, setIsOpen] = useState(false);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorite/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar favoritos");

      const data = await response.json();
      dispatch({ type: "handleFavorites", payload: data });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeFavorite = async (favoriteId, e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorite/${favoriteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al eliminar favorito");

      // Obtener lista actualizada después de eliminar
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

  useEffect(() => {
    if (isOpen) {
      fetchFavorites();
      const interval = setInterval(fetchFavorites, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-danger position-relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="bi bi-heart-fill me-1"></i>
        {store.favorites.length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {store.favorites.length}
          </span>
        )}
      </button>

      <div className={`dropdown-menu ${isOpen ? "show" : ""}`}
        style={{
          width: "300px",
          maxHeight: "400px",
          overflowY: "auto",
          padding: "0.5rem"
        }}
      >
        {store.favorites.length === 0 ? (
          <div className="dropdown-item-text text-muted p-2">
            No tienes favoritos
          </div>
        ) : (
          store.favorites.map(fav => (
            <div key={fav.id} className="d-flex justify-content-between align-items-center p-2">
              <Link 
                to={`/activities/${fav.activity_id}`} 
                className="text-decoration-none flex-grow-1"
                onClick={() => setIsOpen(false)}
              >
                {fav.activity?.name || `Actividad #${fav.activity_id}`}
              </Link>
              <button 
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={(e) => removeFavorite(fav.id, e)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};