import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";




export const LoginSuccess = () => {
  const { store, dispatch } = useGlobalReducer();
  const Navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      Navigate("/"); // Redirigir a la página principal después de 3 segundos
    }, 3500);
  }, []);

  return (

    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
      <div className="container py-5 text-center">
        <motion.h2
          className="landing-t1"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0 }}
        >Hola, </motion.h2>

        <motion.p
          className="landing-t4 text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >{store.user.email}</motion.p>
        <motion.p
          className="landing-t2"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        >¡Bienvenido de vuelta!</motion.p>
      </div>
    </div>

  );
}