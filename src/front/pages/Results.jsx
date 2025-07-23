import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ActivitiesSearched } from "../components/landing/ActivitiesSearched";
import { SearchBarTop } from "../components/landing/SearchBarTop";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { motion } from "framer-motion";

export const Results = () => {
  const { store } = useGlobalReducer();


  return (
    <>
      <div className="container-fluid d-flex flex-column align-items-center min-vh-100 content-center">

        <div className="py-5 d-flex flex-column align-items-center">
          <SearchBarTop />
        </div>
        <div
          className="row min-vw-100"
          style={{ paddingLeft: "2vw", paddingRight: "2vw", }}

        >
          <ActivitiesSearched />
        </div>
      </div>


    </>
  );
};