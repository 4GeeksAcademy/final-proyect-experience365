import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Loading } from "../components/Loading";

export const ProfessionalActivities = () => {
    const { store } = useGlobalReducer();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/activity/professional`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Error al cargar actividades");

                const data = await response.json();
                setActivities(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-12 text-center mb-4">
                        <h2 className="landing-t1 fs-3">Mis Actividades</h2>
                    </div>

                    <div className="col-12 text-center mb-4">
                        <Link to="/activities/create">
                            <motion.button
                                className="btn-primary py-2 expCard-btn-txt rounded-pill border-0 text-white px-4"
                                initial={{ scale: 0.9 }}
                                whileHover={{ scale: 1 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                                <FontAwesomeIcon icon={faPlus} className="me-2" />
                                Crear Nueva
                            </motion.button>
                        </Link>
                    </div>

                    <div className="row justify-content-center">
                        {activities.length > 0 ? (
                            activities.map(activity => (
                                <motion.div
                                    key={activity.id}
                                    className="col-md-6 col-lg-4 my-3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <motion.div
                                        className="card h-100 shadow-sm mx-auto"
                                        style={{ maxWidth: "350px" }}
                                        initial={{ scale: 1, zIndex: 1 }}
                                        whileHover={{ scale: 1.03, zIndex: 1000 }}
                                        transition={{ duration: 0.05, ease: "easeInOut" }}
                                    >
                                        <img
                                            src={activity.img || "https://via.placeholder.com/300"}
                                            className="card-img-top"
                                            alt={activity.name}
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title fs-5">{activity.name}</h5>
                                            <p className="card-text text-truncate fs-6">{activity.description}</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="landing-t3 p-2 fs-5" style={{ color: "#333333ff" }}>
                                                    {activity.price}€
                                                </span>
                                            </div>
                                        </div>
                                        <div className="card-footer bg-transparent border-0 d-flex justify-content-end">
                                            <Link to={`/activities/${activity.id}`}>
                                                <motion.button
                                                    className="btn expCard-btn-b expCard-btn-txt rounded-pill mt-2 mb-2 border-0 text-white fs-6"
                                                    initial={{ scale: 1 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                                >
                                                    Ver detalles
                                                </motion.button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-4">
                                <h4 className="expCard-header fs-4 mb-3">No has creado ninguna actividad aún</h4>
                                <Link to="/activities/create">
                                    <motion.button
                                        className="btn expCard-btn-b expCard-btn-txt rounded-pill border-0 text-white px-4"
                                        initial={{ scale: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                    >
                                        Crear mi primera actividad
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};