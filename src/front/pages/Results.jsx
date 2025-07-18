import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ActivitiesSearched } from "../components/landing/ActivitiesSearched";
import { SearchBar } from "../components/landing/SearchBar";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { motion } from "framer-motion";

export const Results = () => {
  const { store } = useGlobalReducer();


  return (
    <>
      <div className="container-fluid d-flex flex-column align-items-center min-vh-100 content-center">

        <div className="py-5 d-flex flex-column align-items-center">
          <SearchBar />
          <ActivitiesSearched />
        </div>
      </div>


    </>
  );
};