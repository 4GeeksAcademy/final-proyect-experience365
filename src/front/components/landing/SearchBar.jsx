import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEuroSign, faClock, faLocationDot, faCaretDown } from "@fortawesome/free-solid-svg-icons";

export const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const cities = [
    "Madrid", "Barcelona", "Valencia", "Bilbao", "Sevilla", "Zaragoza", "Albacete", "Alicante",
    "Almería", "Ávila", "Badajoz", "Burgos", "Cáceres", "Cádiz", "Castellón", "Ciudad Real",
    "Córdoba", "A Coruña", "Cuenca", "Girona", "Granada", "Guadalajara", "Huelva", "Huesca",
    "Jaén", "Las Palmas de Gran Canaria", "León", "Logroño", "Lugo", "Lleida", "Ourense",
    "Oviedo", "Palencia", "Palma", "Pamplona", "Pontevedra", "Salamanca", "San Sebastián",
    "Santa Cruz de Tenerife", "Segovia", "Soria", "Tarragona", "Teruel", "Toledo", "Valladolid",
    "Vitoria", "Zamora"
  ];

  const durations = ["30 min", "1 hora", "2 horas", "3 horas", "+ de 3 horas"];

  const prices = ["0€ - 15€", "15€ - 30€", "30€ - 60€", "60€ - 100€", "+ de 100€"];

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ city, duration, price });
    }
  };

  return (
    <div
      className="mt-4 p-2 bg-white rounded-sm-pill rounded-5
        d-flex flex-column 
        flex-sm-row align-items-center 
        justify-content-center justify-content-sm-between
        shadow"
      style={{
        width: "80%",
        maxWidth: 800,
        // border: "5px solid rgb(229, 102, 255)",
        border: "5px solid rgb(58, 255, 206)",
      }}
    >
      <div className="dropdown mx-2 col-md-3 my-2 my-md-0">
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
      </div>

      <div className="dropdown mx-2 col-md-3 my-2 my-md-0">
        <button className="btn in-text border-0" type="button" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faClock} className="me-2" /> {duration || "Duración"}
          <FontAwesomeIcon icon={faCaretDown} className="ms-3 me-2" />
        </button>
        <ul className="dropdown-menu">{
          durations.map((duration, index) => (
            <li key={index}><button className="dropdown-item" onClick={() => setDuration(duration)}>{duration}</button></li>
          ))}
        </ul>
      </div>

      <div className="dropdown mx-2 col-md-3 my-2 my-md-0">
        <button className="btn in-text border-0" type="button" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faEuroSign} /> {price || "Precio"}
          <FontAwesomeIcon icon={faCaretDown} className="ms-3 me-2" />
        </button>
        <ul className="dropdown-menu">{
          prices.map((price, index) => (
            <li key={index}><button className="dropdown-item" onClick={() => setPrice(price)}>{price}</button></li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleSearch}
        className="rounded-pill px-4 py-2 ms-2 text-white my-2 my-md-0"
        style={{
          background: "linear-gradient(300deg,rgba(12, 87, 117, 1) 0%, rgba(42, 123, 155, 1) 33%, rgba(87, 199, 133, 0.92) 63%, rgba(237, 221, 83, 0.74) 89%, rgba(255, 255, 255, 0) 100%)",
          border: "none",
        }}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
};
