import React, { useState } from "react";

import useGlobalReducer from "../../hooks/useGlobalReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEuroSign, faClock, faLocationDot, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { use } from "react";
import { useNavigate } from "react-router-dom";


export const SearchBarTop = () => {

  const Navigate = useNavigate();
  const [city, setCity] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [results, setResults] = useState([]);

  const { store, dispatch } = useGlobalReducer();

  const cities = [
    "Madrid", "Barcelona", "Valencia", "Bilbao", "Sevilla", "Zaragoza", "Albacete", "Alicante",
    "Almería", "Ávila", "Badajoz", "Burgos", "Cáceres", "Cádiz", "Castellón", "Ciudad Real",
    "Córdoba", "A Coruña", "Cuenca", "Girona", "Granada", "Guadalajara", "Huelva", "Huesca",
    "Jaén", "Las Palmas de Gran Canaria", "León", "Logroño", "Lugo", "Lleida", "Ourense",
    "Oviedo", "Palencia", "Palma", "Pamplona", "Pontevedra", "Salamanca", "San Sebastián",
    "Santa Cruz de Tenerife", "Segovia", "Soria", "Tarragona", "Teruel", "Toledo", "Valladolid",
    "Vitoria", "Zamora"
  ];

  const durations = [
    { label: "30 min a 1 hora", value: { min: 30, max: 60 } },
    { label: "1 hora a 2 horas", value: { min: 60, max: 120 } },
    { label: "2 horas a 3 horas", value: { min: 120, max: 180 } },
    { label: "+ de 3 horas", value: { min: 180, max: null } }
  ];

  const prices = [
    { label: "0€ - 15€", value: { min: 0, max: 15 } },
    { label: "15€ - 30€", value: { min: 15, max: 30 } },
    { label: "30€ - 60€", value: { min: 30, max: 60 } },
    { label: "60€ - 100€", value: { min: 60, max: 100 } },
    { label: "+ de 100€", value: { min: 100, max: null } }
  ];

  const handleSearch = () => {
    const paramsObj = {
      ...(city && { city }),
      ...(selectedPrice?.value.min != null && { priceMin: selectedPrice.value.min }),
      ...(selectedPrice?.value.max != null && { priceMax: selectedPrice.value.max }),
      ...(selectedDuration?.value.min != null && { durationMin: selectedDuration.value.min }),
      ...(selectedDuration?.value.max != null && { durationMax: selectedDuration.value.max })
    };

    const params = new URLSearchParams(paramsObj).toString();

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/activity/search?${params}`)
      .then(res => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setResults([data]);
        dispatch({
          type: "SET_SEARCH_RESULTS",
          payload: data
        });
        Navigate("/results");
      })
      .catch(err => {
        console.error("Error al buscar actividades:", err);
      });
  };

  return (
    <motion.div
      className="mt-5 p-2 bg-white rounded-sm-pill rounded-5
        d-flex flex-column 
        flex-sm-row align-items-center 
        justify-content-center justify-content-sm-between
        shadow"
      style={{
        minWidth: "50vw",
        maxWidth: "60vw",
        border: "5px solid rgb(58, 255, 206)",
        zIndex: 3
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <motion.div
        className="dropdown mx-2 col-md-3 my-2 my-md-0"
        whileHover={{ scale: 1.05 }}
      >
        <button className="btn in-text border-0"
          type="button" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faLocationDot} className="ms-3 me-2" /> {city || "Ciudad"}
          <FontAwesomeIcon icon={faCaretDown} className="ms-3 me-2" />
        </button>
        <ul className="dropdown-menu dropdown-scroll">{
          cities.map((city, index) => (
            <li key={index}><button className="dropdown-item" onClick={() => setCity(city)}>{city}</button></li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="dropdown mx-2 col-md-3 my-2 my-md-0"
        whileHover={{ scale: 1.05 }}
      >
        <button className="btn in-text border-0" type="button" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faClock} className="me-2" /> {selectedDuration?.label || "Duración"}
          <FontAwesomeIcon icon={faCaretDown} className="ms-3 me-2" />
        </button>
        <ul className="dropdown-menu">{
          durations.map((duration, index) => (
            <li key={index}><button className="dropdown-item" onClick={() => setSelectedDuration(duration)}>{duration.label}</button></li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="dropdown mx-2 col-md-3 my-2 my-md-0"
        whileHover={{ scale: 1.05 }}
      >
        <button className="btn in-text border-0" type="button" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faEuroSign} /> {selectedPrice?.label || "Precio"}
          <FontAwesomeIcon icon={faCaretDown} className="ms-3 me-2" />
        </button>
        <ul className="dropdown-menu">{
          prices.map((price, index) => (
            <li key={index}><button className="dropdown-item" onClick={() => setSelectedPrice(price)}>{price.label}</button></li>
          ))}
        </ul>
      </motion.div>

      <motion.button
        onClick={handleSearch}
        className="rounded-pill px-4 py-2 ms-2 text-white my-2 my-md-0"
        style={{
          background: "linear-gradient(300deg,rgba(12, 87, 117, 1) 0%, rgba(42, 123, 155, 1) 33%, rgba(87, 199, 133, 0.92) 63%, rgba(237, 221, 83, 0.74) 89%, rgba(255, 255, 255, 0) 100%)",
          border: "none",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FontAwesomeIcon icon={faSearch} />
      </motion.button>
    </motion.div>
  );
};
