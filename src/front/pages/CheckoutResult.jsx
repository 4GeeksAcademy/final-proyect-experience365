import { Navigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const CheckoutResult = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState(0);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/stripe/session-status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await res.json();
        if (res.ok && data.payment_status === "completed") {
          setStatus(2);
        } else {
          setStatus(1);
        }
      } catch (error) {
        setStatus(1);
      }
    };

    if (sessionId) verifyPayment();
    else setStatus("No se proporcionó ningún session_id.");
  }, [sessionId]);

  if (status === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Cargando...</h2>
      </div>
    );
  }

  if (status === 1) {
    return (
      <Navigate to="/payment/checkout-result/cancel" />
    );
  }

  if (status === 2)
    return (
      <div className="container py-5 text-center">
        <h2>El pago se ha realizado correctamente</h2>
      </div>
    );
};