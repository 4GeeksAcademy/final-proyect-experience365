import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const ActivityDetail = ({ onFavoriteUpdate }) => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Verificar si es favorito al cargar
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/favorite/user`,
            {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            }
          );
          if (response.ok) {
            const favorites = await response.json();
            setIsFavorite(favorites.some(fav => fav.activity_id === parseInt(id)));
          }
        }
      } catch (err) {
        console.error("Error checking favorite:", err);
      }
    };

    checkFavorite();
  }, [id]);

  // Fetch de la actividad
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/activity/${id}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error al cargar la actividad");
        setActivity(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  // Manejar click en favorito
  const handleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Debes iniciar sesión para marcar favoritos");
      return;
    }

    try {
      let url, method, body;
      
      if (isFavorite) {
        // Obtener el ID del favorito existente
        const favResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/favorite/user`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        const favorites = await favResponse.json();
        const favorite = favorites.find(fav => fav.activity_id == id);
        
        if (!favorite) throw new Error("Favorito no encontrado");
        
        url = `${import.meta.env.VITE_BACKEND_URL}/api/favorite/${favorite.id}`;
        method = "DELETE";
        body = null;
      } else {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/favorite`;
        method = "POST";
        body = JSON.stringify({ activity_id: parseInt(id) });
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar favoritos");
      }

      setIsFavorite(!isFavorite);
      toast.success(
        isFavorite ? "Eliminado de favoritos" : "Añadido a favoritos",
        { icon: "❤️" }
      );
      
      // Notificar actualización
      if (onFavoriteUpdate) onFavoriteUpdate();
    } catch (err) {
      console.error("Error en favoritos:", err);
      toast.error(err.message || "Error al actualizar favoritos");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Actividad no encontrada.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-md-7">
          <div className="card shadow-sm overflow-hidden">
            <img
              src={activity.img || "https://via.placeholder.com/800x500?text=Imagen+no+disponible"}
              alt={activity.name}
              className="img-fluid rounded-3"
              style={{ height: "400px", objectFit: "cover", width: "100%" }}
            />
          </div>
        </div>
        <div className="col-md-5">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h1 className="card-title mb-3">{activity.name}</h1>
              <p className="card-text flex-grow-1">{activity.description}</p>
              <div className="mt-auto">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-primary fs-5 p-2">
                    {activity.price} €
                  </span>
                  <span className="text-muted">
                    <i className="bi bi-calendar me-2"></i>
                    {activity.activity_date || "Fechas no especificadas"}
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className={`btn w-50 ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
                    onClick={handleFavorite}
                  >
                    <i className={`bi bi-heart${isFavorite ? "-fill" : ""}`}></i>
                    {isFavorite ? " Quitar de favoritos" : " Añadir a favoritos"}
                  </button>
                  <button className="btn btn-primary w-50">
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección del anfitrión */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Sobre el anfitrión</h3>
              <p className="text-muted">(falta terminar)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de valoraciones */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Valoraciones</h3>
              <p className="text-muted">(falta terminar)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};