import react from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const Loading = () => {
  return (
    <div className="container py-5 text-center">
      <h2 className="text-danger">Cargando...</h2>
    </div>
  );
};