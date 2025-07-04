import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const CheckoutResult = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState(0);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  const Navigate = useNavigate();

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
          setStatus(1);
          setTimeout(() => {
            Navigate("/activities");
          }, 3000);
        } else {
          Navigate("/payment/checkout-result/cancel");
        }
      } catch (error) {
        Navigate("/payment/checkout-result/cancel");
      }
    };

    if (sessionId) verifyPayment();

    else Navigate("/payment/checkout-result/cancel");

  }, [sessionId]);

  if (status === 0) {
    return (
      <div className="container py-5 text-center">
        <span className="spinner-border spinner-border-sm me-2"></span>
      </div>
    );
  }

  if (status === 1)
    return (
      <div className="container py-5 text-center">
        <h2 className="text-success">Pago Completado.</h2>
        <p>La transacción se ha reailzado con exito.</p>
      </div>
    );
};