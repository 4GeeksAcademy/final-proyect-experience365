import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
        setMessage("Inicio de sesión exitoso.");
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";

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
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
      <h1 className="landing-t1">Iniciar Sesión</h1>

      <form onSubmit={handleSubmit} className="mt-4 col-md-2 mx-auto">
        <div className="mb-3">
          <label className="form-label login-t2 p-2" htmlFor="email">Email</label>
          <input className="form-control rounded-pill" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label login-t2 p-2" htmlFor="password">Password</label>
          <input className="form-control rounded-pill" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button
          type="submit"
          className="btn w-100 my-5 btn-primary rounded-pill "
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

      {message === "Inicio de sesión exitoso." ? (<p className="mt-3 alert alert-success col-md-6 mx-auto">{message}</p>) :
        message && (<p className="mt-3 alert alert-danger col-md-6 mx-auto">{message}</p>)}

    </div>
  );
};