import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { motion } from "framer-motion";
import { Loading } from "../components/Loading";

export const MyReservations = () => {
    const { store } = useGlobalReducer();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/stripe/purchase/user`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Error al cargar reservas");

                const data = await response.json();
                setReservations(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">

            <div className="container text-center py-5 mt-5">
                <h2 className="landing-t1">Mis Reservas</h2>

                <div className="row justify-content-center">
                    {reservations.length > 0 ? (
                        reservations.map(reservation => (
                            <motion.div
                                key={reservation.id}
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
                                    <img
                                        src={reservation.activity?.img || "https://via.placeholder.com/300"}
                                        className="card-img-top"
                                        alt={reservation.activity?.name}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{reservation.activity?.name}</h5>
                                        <p className="card-text">Fecha: {new Date(reservation.date).toLocaleDateString()}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="landing-t3 p-2" style={{ fontSize: "1.5rem", color: "#333333ff" }}>
                                                {reservation.activity?.price}€
                                            </span>
                                            <span className={`badge rounded-pill ${reservation.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                                {reservation.status === 'completed' ? 'Completada' : 'Pendiente'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-footer bg-transparent border-0 d-flex justify-content-end">
                                        <Link to={`/activities/${reservation.activity_id}`}>
                                            <motion.button
                                                className="btn expCard-btn-b expCard-btn-txt rounded-pill mt-3 mb-3 border-0 text-white"
                                                initial={{ scale: 1 }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.98 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                Ver actividad
                                            </motion.button>
                                        </Link>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <h4 className="landing-t2 fs-5">No tienes reservas aún</h4>
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