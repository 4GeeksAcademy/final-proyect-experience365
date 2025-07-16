import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

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
        return <div className="text-center py-5">Cargando...</div>;
    }

    return (
        <div className="container py-5 mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Mis Actividades</h2>
                <Link to="/activities/create" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>Crear Nueva
                </Link>
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {activities.length > 0 ? (
                    activities.map(activity => (
                        <div key={activity.id} className="col">
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={activity.img || "https://via.placeholder.com/300"}
                                    className="card-img-top"
                                    alt={activity.name}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{activity.name}</h5>
                                    <p className="card-text text-truncate">{activity.description}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="badge bg-primary rounded-pill">
                                            {activity.price} €
                                        </span>
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
                        <h4>No has creado ninguna actividad aún</h4>
                        <Link to="/activities/create" className="btn btn-primary mt-3">
                            Crear mi primera actividad
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};