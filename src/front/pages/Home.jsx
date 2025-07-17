import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { AnimatedImages } from "../components/landing/AnimatedImages.jsx";
import { SearchBar } from "../components/landing/SearchBar.jsx";
import { ActivitiesList } from "../components/landing/ActivitiesList.jsx";
import { motion } from "framer-motion";
import '@fontsource/inter';
import '@fontsource/playfair-display';
import '@fontsource/space-grotesk';


export const Home = () => {

  const token = localStorage.getItem("token");
  const { store, dispatch } = useGlobalReducer()

  const [isLoading, setIsLoading] = useState(false);
  const [sesion, setSesion] = useState(false);

  return (
    <>
      <div className="d-flex align-items-center justify-content-center" style={{
        height: "100vh",
        background: "linear-gradient(180deg,rgba(12, 87, 117, 1) 0%, rgba(42, 123, 155, 1) 33%, rgba(87, 199, 133, 0.92) 63%, rgba(237, 221, 83, 0.74) 89%, rgba(255, 255, 255, 0) 100%)"
      }}>

        <motion.div
          className="d-flex flex-column align-items-center justify-content-center p-2 p-sm-0"
          initial={{ opacity: 0, }}
          animate={{ opacity: 1, }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          style={{ width: "100%", zIndex: 0 }}
        >
          <motion.h1
            className="landing-t1 p-md-0 p-2"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >¡Descubre experiencias únicas!</motion.h1>
          <motion.h5
            className="landing-t2 p-md-0 p-2"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >Planes exclusivos en más de 20 ciudades de toda España</motion.h5>
          <SearchBar />
          <div className="d-flex align-items-start justify-content-center position-absolute" style={{ width: "100%", zIndex: -2 }} >
            <AnimatedImages />
          </div>
        </motion.div>
      </div>
      <ActivitiesList />
    </>
  );
}; 