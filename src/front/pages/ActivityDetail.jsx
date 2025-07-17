import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Reviews } from "../components/Reviews";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Loading } from "../components/Loading";
import { motion } from "framer-motion";


export const ActivityDetail = () => {
  const { store, dispatch } = useGlobalReducer();
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate();

  // Verificar si es favorito usando el store global
  const isFavorite = store.favorites.some(fav => fav.activity_id === parseInt(id));

  // Fetch de la actividad
  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    token ? setIsUser(true) : setIsUser(false);

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
  }, []);

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
        const favorite = store.favorites.find(fav => fav.activity_id == id);
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

      // Obtener favoritos actualizados después de la operación
      const favResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorite/user`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      const updatedFavorites = await favResponse.json();

      // Actualizar el store global
      dispatch({ type: "handleFavorites", payload: updatedFavorites });

      toast.success(
        isFavorite ? "Eliminado de favoritos" : "Añadido a favoritos",
        { icon: "❤️" }
      );
    } catch (err) {
      toast.error(err.message || "Error al actualizar favoritos");
    };
  };

  const handlePay = async () => {
    if (!isUser) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          activity_id: id,
          amount: Math.round(Number(activity.price) * 100),
          product_name: activity.name,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        if (res.status === 401) {
          navigate("/error/401");
        }
        throw new Error(data.error || "Error al crear la sesión de pago")
      };
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe no se cargó correctamente");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="container-fluid d-flex flex-column align-items-center justify-content-center content-center">
        <div className="container py-5 content-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="container-fluid d-flex flex-column align-items-center justify-content-center content-center">
        <div className="container py-5 content-center">
          <div className="alert alert-warning" role="alert">
            Actividad no encontrada.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center content-center-b">
      <div className="container py-5">
        <div className="row mt-5">
          <div className="col-md-7 mb-md-0 mb-5">
            <motion.div
              className="card shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: -40, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut", delay: 0.3 }}
            >
              <img
                src={activity.images?.[0]?.url || activity.img || "https://via.placeholder.com/800x500?text=Imagen+no+disponible"}
                alt={activity.name}
                className="card-img img-fluid"
                style={{ height: "400px", objectFit: "cover", width: "100%" }}
              />
              {/* <div className="card-img-overlay d-flex flex-column justify-content-start z-1">
                <h2 className="card-title text-light landing-t4 px-2" style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)" }}>{activity.name}</h2>
              </div>
              <div className="card-img-overlay d-flex flex-column justify-content-end bg-dark opacity-25 z-0">
                <div className="d-flex justify-content-between">
                </div>
              </div> */}
              {activity.images?.length > 1 && (
                <div className="d-flex flex-wrap gap-2 p-3 bg-light">
                  {activity.images.slice(1).map((image, index) => (
                    <div key={index} className="position-relative">
                      <img
                        src={image.url}
                        alt={`${activity.name} ${index + 2}`}
                        className="img-thumbnail"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          const newImages = [...activity.images];
                          [newImages[0], newImages[index + 1]] = [newImages[index + 1], newImages[0]];
                          setActivity({ ...activity, images: newImages });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="col-md-5">
            <motion.div
              className="card shadow-sm h-100"
              initial={{ opacity: 0, y: -40, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut", delay: 0.3 }}
            >
              <div className="card-body d-flex flex-column">
                <h1 className="card-title mb-3">{activity.name}</h1>
                <p className="card-text flex-grow-1">{activity.description}
                </p>
                <hr />
                <p className="card-text text-muted h6">
                  <i className="bi bi-geo-alt me-2"></i>
                  {activity.city || "Horarios no especificados"}
                </p>


                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary fs-5 p-2">
                      {activity.price} €
                    </span>
                    <span className="text-muted d-flex">
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
                    <button className="btn btn-primary w-50" onClick={handlePay}>
                      Reservar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sección del anfitrión */}
        <div className="row mt-5">
          <div className="col-12">
            <motion.div
              className="card shadow-sm"
              initial={{ opacity: 0, y: -40, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut", delay: 0.4 }}
            >
              <div className="card-body">
                <h3 className="card-title">Sobre el anfitrión</h3>
                {activity.professional ? (
                  <div className="row">
                    <div className="col-md-3 d-flex flex-column align-items-center">
                      <img
                        src={activity.professional.image || "https://via.placeholder.com/150?text=Anfitrión"}
                        alt={`${activity.professional.name} ${activity.professional.lastname}`}
                        className="rounded-circle mb-3"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      />
                      <h4 className="text-center">{activity.professional.name} {activity.professional.lastname}</h4>
                      <p className="text-muted text-center mb-3">
                        <i className="bi bi-envelope me-2"></i>
                        {activity.professional.email || "Email no disponible"}
                      </p>
                    </div>

                    <div className="col-md-9">
                      <div className="mb-3">
                        <p className="mb-4">{activity.professional.description}</p>

                        <div className="row">
                          <div className="col-md-6">
                            <p className="mb-2">
                              <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                              {activity.professional.adress}
                            </p>
                            <p className="mb-2">
                              <i className="bi bi-telephone-fill text-primary me-2"></i>
                              {activity.professional.phone}
                            </p>
                            {activity.professional.web && (
                              <p className="mb-2">
                                <i className="bi bi-globe text-primary me-2"></i>
                                <a href={activity.professional.web} target="_blank" rel="noopener noreferrer">
                                  Sitio web
                                </a>
                              </p>
                            )}
                          </div>

                          <div className="col-md-6">
                            <div className="d-flex flex-wrap gap-3 mt-2">
                              {activity.professional.facebook && (
                                <a href={activity.professional.facebook} target="_blank" rel="noopener noreferrer">
                                  <i className="bi bi-facebook fs-4 text-primary"></i>
                                </a>
                              )}
                              {activity.professional.instagram && (
                                <a href={activity.professional.instagram} target="_blank" rel="noopener noreferrer">
                                  <i className="bi bi-instagram fs-4 text-danger"></i>
                                </a>
                              )}
                              {activity.professional.twitter && (
                                <a href={activity.professional.twitter} target="_blank" rel="noopener noreferrer">
                                  <i className="bi bi-twitter-x fs-4"></i>
                                </a>
                              )}
                              {activity.professional.linkedin && (
                                <a href={activity.professional.linkedin} target="_blank" rel="noopener noreferrer">
                                  <i className="bi bi-linkedin fs-4 text-primary"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">Información del anfitrión no disponible</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sección de valoraciones */}
        <div className="row mt-4">
          <motion.div
            className="col-12"
            initial={{ opacity: 0, y: -40, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.6 }}
          >
            <Reviews activityId={activity.id} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};