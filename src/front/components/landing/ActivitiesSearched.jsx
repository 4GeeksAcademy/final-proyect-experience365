import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const ActivitiesSearched = () => {
  const { store } = useGlobalReducer();
  const activities = store.searchResults || [];

  if (!activities.length) {
    return (
      <div
        className="container-fluid d-flex flex-column text-center py-5 align-items-center justify-content-center"
        style={{ height: "50vh" }}
      >
        <h4 className="landing-t2 text-white align-items-center justify-content-center fs-2">No se encontraron actividades</h4>
        <Link to="/" >
          <motion.div
            className="btn btn-primary rounded-pill m-5 expCard-btn-txt fs-5 px-4"
            initial={{ scale: 1 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
          >Volver
          </motion.div>
        </Link>
      </div>
    );
  }

  return (
    <>
      {activities.map((activity, index) => {
        const groupDelay = 0.2;
        const itemDelay = 0.05;
        const group = Math.floor(index / 4);
        const positionInGroup = index % 4;
        const delay = (group * groupDelay) + (positionInGroup * itemDelay);

        return (
          <motion.div
            key={activity.id}
            className="col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay }}
          >
            <motion.div
              className="card shadow-sm"
              style={{ overflow: "hidden", zIndex: 0, maxWidth: "300px" }}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.05, ease: "easeInOut" }}
            >
              {activity.img && (
                <img
                  src={activity.img}
                  className="card-img-top"
                  alt={activity.name}
                  style={{
                    height: "200px",
                    objectFit: "cover"
                  }}
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
      })}
    </>
  );
};
