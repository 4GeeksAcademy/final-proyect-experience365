
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUser, setIsUser] = useState(false);

  const userId = 1; // Reemplaza el Id con el user_id actual

  useEffect(() => {

    const fetchActivity = async () => {

      try {
        const response = await fetch(`${BACKEND_URL}/api/activity/${id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Error al cargar la actividad");
        }
        setActivity(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
      localStorage.getItem("token") ? setIsUser(true) : setIsUser(false);
    };
    fetchActivity();
  }, [id]);


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
        },
        body: JSON.stringify({
          user_id: userId,
          activity_id: id,
          amount: Math.round(Number(activity.price) * 100),
          product_name: activity.name,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Error al crear la sesión de pago")
      };

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe no se cargó correctamente");
      }

      window.location.href = data.url;

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="container py-5">Cargando actividad...</div>;
  if (error) return <div className="container py-5 text-danger">Error: {error}</div>;

  return (
    <div className="container py-5">
      <div className="card h-100 shadow-sm">
        <img
          src={activity.img}
          className="card-img-top"
          alt={activity.name}
          style={{ height: "400px", objectFit: "cover" }}
        />
        <div className="row my-5">
          <div className="col-md-8 px-5">
            <h1 className="display-5">{activity.name}</h1>
            <p className="lead h4">{activity.description}</p>
          </div>
          <div className="col-md-4 text-center align-items-center justify-content-center">
            <h1 className="display-1">{activity.price} €</h1>
            <button className="btn btn-primary btn-lg" onClick={handlePay}>
              Pagar
            </button>
          </div>
        </div>

        <div className="text-center my-4">

        </div>
      </div>
    </div>

  );
};  