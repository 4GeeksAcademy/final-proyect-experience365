import react from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const Loading = () => {
  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center content-center" style={{ height: "100vh" }}  >
      <motion.div
        className="container py-5 text-center"
        initial={{ opacity: 0, y: 0, scale: 6 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0 }}
        repeat={Infinity}
      >
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </motion.div>
    </div>
  );
};