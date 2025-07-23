import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEuroSign, faClock, faLocationDot, faCaretDown, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

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
      <motion.div
        className="container py-5 text-center"
        initial={{ opacity: 0, y: 0, scale: 6 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0 }}
        repeat={Infinity}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </motion.div>
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
        filteredActivities.map((activity, index) => {
          const groupDelay = 0.2;
          const itemDelay = 0.05;
          const group = Math.floor(index / 4);
          const positionInGroup = index % 4;
          const delay = (group * groupDelay) + (positionInGroup * itemDelay);

          // Verificar si hay imágenes para mostrar en el carrusel
          const hasImages = activity.images && activity.images.length > 0;

          return (
            <motion.div
              key={activity.id}
              className="col my-5"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay }}
            >
              <motion.div
                className="card h-100 shadow-sm"
                initial={{ scale: 1, zIndex: 1 }}
                whileHover={{ scale: 1.03, zIndex: 1000 }}
                transition={{ duration: 0.05, ease: "easeInOut" }}
              >
                {/* Carrusel de imágenes */}
                {hasImages ? (
                  <Carousel
                    fade
                    indicators={false}
                    prevIcon={<FontAwesomeIcon icon={faChevronLeft} className="text-dark bg-white p-2 rounded-circle" />}
                    nextIcon={<FontAwesomeIcon icon={faChevronRight} className="text-dark bg-white p-2 rounded-circle" />}
                    interval={null}
                    style={{ height: "200px", overflow: "hidden" }}
                  >
                    {activity.images.map((image, imgIndex) => (
                      <Carousel.Item key={imgIndex}>
                        <img
                          src={image.url}
                          className="d-block w-100"
                          alt={`${activity.name} ${imgIndex + 1}`}
                          style={{
                            height: "200px",
                            objectFit: "cover",
                            objectPosition: "center"
                          }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/800x400?text=Imagen+no+disponible";
                          }}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <img
                    src={activity.img || "https://via.placeholder.com/800x400?text=Imagen+no+disponible"}
                    className="card-img-top"
                    alt={activity.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}

                <div className="card-body">
                  <h5 className="card-title">{activity.name}</h5>
                  <p className="card-text text-truncate">{activity.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                      <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                      {activity.city}
                    </span>
                    <div className="activity-rating m-2">
                      <div className="text-warning">
                        {"★".repeat(Math.round(activity.rate || 0)) +
                          "☆".repeat(5 - Math.round(activity.rate || 0))}
                      </div>
                      <small className="text-muted">
                        {activity.rate !== null && activity.rate !== undefined
                          ? `${activity.rate.toFixed(1)} / 5`
                          : "0.0 / 5"}
                      </small>
                    </div>
                    <span
                      className="landing-t3 p-2"
                      style={{ fontSize: "1.5rem", color: "#333333ff" }}
                    >
                      {activity.price}€
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex justify-content-end">
                  <Link to={`/activities/${activity.id}`}>
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
                </div>
              </motion.div>
            </motion.div>
          );
        })
      ) : (
        <div className="col-12 text-center py-5">
          <h4>No se encontraron actividades</h4>
        </div>
      )}
    </div>
  );
};