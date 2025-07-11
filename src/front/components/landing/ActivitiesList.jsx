import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const ActivitiesList = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/activity`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al cargar actividades");
        }

        setActivities(data);
        setFilteredActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Función para convertir minutos a formato horas:minutos
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
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
      <div className="container py-5 bg-light">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (

    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 m-5">
      {filteredActivities.length > 0 ? (
        filteredActivities.map((activity) => (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            key={activity.id}
            className="col">
            <div className="card h-100 shadow-sm">
              {activity.img && (
                <img
                  src={activity.img}
                  className="card-img-top"
                  alt={activity.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{activity.name}</h5>
                <p className="card-text text-truncate">{activity.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-primary rounded-pill">
                    {activity.price} €
                  </span>
                  {activity.duration && (
                    <small className="text-muted">
                      {formatDuration(activity.duration)}
                    </small>
                  )}
                </div>
              </div>
              <div className="card-footer bg-transparent">
                <Link
                  to={`/activities/${activity.id}`}
                  className="btn btn-sm btn-outline-primary w-100"
                >
                  Ver detalles
                </Link>
              </div>
              <div className="card-footer bg-transparent">
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="col-12 text-center py-5">
          <h4>No se encontraron actividades</h4>
          {searchTerm && (
            <button
              className="btn btn-link"
              onClick={() => setSearchTerm("")}
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}
    </div>
  );
};