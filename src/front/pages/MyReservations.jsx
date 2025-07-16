import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

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
        return <div className="text-center py-5">Cargando...</div>;
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4">Mis Reservas</h2>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {reservations.length > 0 ? (
                    reservations.map(reservation => (
                        <div key={reservation.id} className="col">
                            <div className="card h-100 shadow-sm">
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
                                        <span className="badge bg-primary rounded-pill">
                                            {reservation.activity?.price} €
                                        </span>
                                        <span className="badge bg-success rounded-pill">
                                            {reservation.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <Link
                                        to={`/activities/${reservation.activity_id}`}
                                        className="btn btn-sm btn-outline-primary w-100"
                                    >
                                        Ver actividad
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <h4>No tienes reservas aún</h4>
                        <Link to="/activities" className="btn btn-primary mt-3">
                            Explorar actividades
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};