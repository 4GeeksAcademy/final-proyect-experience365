import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Inicio de sesión exitoso.");
        localStorage.setItem("token", data.token);
      } else {
        setMessage(data.error || "Error al iniciar sesión.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container text-center">
      <h1 className="display-4">Iniciar Sesión</h1>

      <form onSubmit={handleSubmit} className="mt-4 col-md-6 mx-auto">
        <div className="mb-3">
          <label className="form-label" htmlFor="email">Email</label>
          <input className="form-control" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="password">Password</label>
          <input className="form-control" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Iniciando Sesión...
            </>
          ) : "Iniciar Sesión"}
        </button>
      </form>

      {message && <p className="mt-3 alert alert-info col-md-6 mx-auto">{message}</p>}

      <hr className="my-4" />
      <Link to="/">
        <span className="btn btn-secondary btn-lg" role="button">
          Volver
        </span>
      </Link>
    </div>
  );
};