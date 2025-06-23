import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    const results = activities.filter(activity =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActivities(results);
  }, [searchTerm, activities]);

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
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar actividades por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="col">
              <div className="card h-100 shadow-sm">
                {activity.image && (
                  <img
                    src={activity.image}
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
              </div>
            </div>
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
    </div>
  );
};