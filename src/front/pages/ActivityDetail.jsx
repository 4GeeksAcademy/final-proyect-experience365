import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Reviews } from "../components/Reviews";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Loading } from "../components/Loading";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCalendarAlt,
  faMapMarkerAlt,
  faEnvelope,
  faClock,
  faGlobe,
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: 1 }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronRight} size="lg" color="#fff" />
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "10px", zIndex: 1 }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronLeft} size="lg" color="#fff" />
    </div>
  );
};

export const ActivityDetail = () => {
  const { store, dispatch } = useGlobalReducer();
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate();

  const isFavorite = store.favorites.some(fav => fav.activity_id === parseInt(id));

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    adaptiveHeight: true,
  };

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

      const favResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorite/user`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      const updatedFavorites = await favResponse.json();

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
    return <Loading />;
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
              className="border-0 shadow-sm rounded-3 overflow-hidden"
              style={{ height: "400px" }}
              initial={{ opacity: 0, y: -40, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut", delay: 0.3 }}
            >
              {activity.images?.length > 0 ? (
                <Slider {...sliderSettings}>
                  {activity.images.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image.url || "https://via.placeholder.com/800x500?text=Imagen+no+disponible"}
                        alt={`${activity.name} ${index + 1}`}
                        className="img-fluid"
                        style={{
                          height: "400px",
                          width: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <img
                  src="https://via.placeholder.com/800x500?text=Imagen+no+disponible"
                  alt={activity.name}
                  className="card-img img-fluid"
                  style={{ height: "400px", objectFit: "cover", width: "100%" }}
                />
              )}
            </motion.div>
          </div>

          <div className="col-md-5">
            <motion.div
              className="card shadow-sm"
              initial={{ opacity: 0, y: -40, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut", delay: 0.3 }}
            >
              <div className="card-body d-flex flex-column">
                <h1 className="expCard-header fs-1 mb-3">{activity.name}</h1>
                <p className="card-text flex-grow-1 fs-6">{activity.description}</p>
                <hr />
                <p className="card-text text-muted h6">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                  {activity.city || "Ubicación no especificada"}
                </p>

                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="landing-t3 fs-4 p-2" style={{ color: "#333333ff" }}>
                      {activity.price} €
                    </span>
                    <span className="text-muted d-flex align-items-center">
                      <FontAwesomeIcon icon={faClock} className="me-2" />
                      {activity.activity_date || "Fechas no especificadas"}
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <motion.button
                      className={`btn w-50 ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
                      onClick={handleFavorite}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FontAwesomeIcon icon={faHeart} className="me-2" />
                      {isFavorite ? "Quitar favorito" : "Añadir favorito"}
                    </motion.button>
                    <motion.button
                      className="btn expCard-btn-b expCard-btn-txt w-50 border-0 text-white"
                      onClick={handlePay}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reservar
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-lg-8">
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut", delay: 0.4 }}
            >
              <Reviews activityId={activity.id} />
            </motion.div>
          </div>

          <div className="col-lg-4">
            <motion.div
              className="card shadow-sm mt-3 mt-md-0"
              initial={{ opacity: 0, y: -40, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut", delay: 0.6 }}
            >
              <div className="card-body text-center">
                <h3 className="expCard-header fs-3 mb-3">Anfitrión</h3>
                {activity.professional ? (
                  <>
                    <img
                      src={activity.professional.image || "https://via.placeholder.com/150?text=Anfitrión"}
                      alt={`${activity.professional.name} ${activity.professional.lastname}`}
                      className="rounded-circle mb-3"
                      style={{ width: "120px", height: "120px", objectFit: "cover" }}
                    />
                    <h4 className="expCard-menu-user mb-3">
                      {activity.professional.name} {activity.professional.lastname}
                    </h4>

                    <div className="mb-4">
                      <a href={`mailto:${activity.professional.email}`} className="text-decoration-none">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        {activity.professional.email}
                      </a>
                    </div>

                    <div className="d-flex justify-content-center gap-4 mb-4">
                      {/* {activity.professional.facebook && ( */}
                      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} className="fs-4 text-primary" />
                      </a>
                      {/* )} */}
                      {/* {activity.professional.instagram && ( */}
                      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} className="fs-4 text-danger" />
                      </a>
                      {/* )} */}
                      {/* {activity.professional.twitter && ( */}
                      <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTwitter} className="fs-4 text-info" />
                      </a>
                      {/* )} */}
                      {/* {activity.professional.linkedin && ( */}
                      <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} className="fs-4 text-primary" />
                      </a>
                      {/* )} */}
                    </div>

                    {activity.professional.web && (
                      <div>
                        <a href={activity.professional.web} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                          <FontAwesomeIcon icon={faGlobe} className="me-2" />
                          Visitar sitio web
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted">Información del anfitrión no disponible</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};