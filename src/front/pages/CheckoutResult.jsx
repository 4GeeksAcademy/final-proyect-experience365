import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";


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
            Navigate("/my-reservations");
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
      <Loading />
    );
  }

  if (status === 1)
    return (
      <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
        <div className="container py-5 text-center">
          <motion.h2
            className="landing-t1"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0 }}
          ><FontAwesomeIcon icon={faCircleCheck} /></motion.h2>

          <motion.p
            className="landing-t1 text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >Pago aceptado</motion.p>
          <motion.p
            className="landing-t3"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          >La transacción se completó correctamente.</motion.p>
        </div>
      </div>
    );
};