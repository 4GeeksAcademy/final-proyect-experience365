import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

export const CancelResult = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 6000); // Redirige después de 3 segundos

    return () => clearTimeout(timer); // Limpieza por si el componente se desmonta
  }, [navigate]);

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
      <div className="container py-5 text-center">
        <motion.h2
          className="landing-t1"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0 }}
        ><FontAwesomeIcon icon={faWarning} /></motion.h2>

        <motion.p
          className="landing-t1 text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >Pago cancelado</motion.p>
        <motion.p
          className="landing-t3"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        >La transacción fue cancelada o no se completó correctamente.</motion.p>
      </div>
    </div>
  );
};