import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Error = () => {

  const { code } = useParams()
  const navigate = useNavigate();
  const [ifCode, setIfCode] = useState(0);


  useEffect(() => {
    document.title = `Error: ${code}`;
    setIfCode(code);
  }, [code]);

  if (code === "401" || code === "403") {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setTimeout(() => {
      navigate("/Login");
    }, 3000)

    return (
      <div className="container text-center">
        <h1 className="display-4">Error: {code}</h1>
        <h2 className="display-5">Inicio de sesión expirado</h2>
      </div>
    )
  }

  return (
    <div className="container text-center">
      <h1 className="display-4">Error: {code}</h1>
    </div>
  );
}