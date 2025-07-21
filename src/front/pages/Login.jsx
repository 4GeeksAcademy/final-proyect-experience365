import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successSubmit, setSuccessSubmit] = useState(false);


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
        window.location.href = "/login/success";


      } else {
        setMessage(data.error || "Error al iniciar sesión.");
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error de conexión con el servidor.");
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4 m-5">
            <motion.div
              className="card shadow-lg border-0 rounded-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-body p-4">
                <h2 className="expCard-header fs-4 text-center mt-3 my-4">Iniciar Sesión</h2>

                {error && <div className="alert alert-danger fs-6">{message}</div>}

                <form onSubmit={handleSubmit} className="mt-4 col-12 align-items-center py-3 d-flex flex-column">
                  <div className="mb-3">
                    <label className="form-label expLogin-t3 fs-6" htmlFor="email">Email</label>
                    <input className="form-control rounded-pill fs-6" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label expLogin-t3 fs-6" htmlFor="password">Password</label>
                    <input className="form-control rounded-pill fs-6" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <p className="text-center expLogin-t2 mt-3" >
                    ¿Has olvidado tu contraseña?{" "}
                    <span
                      className="text-decoration-underline text-primary"
                      style={{ cursor: "pointer" }}
                      data-bs-dismiss="modal"
                      onClick={() => Navigate("/recovery-password")}
                    >
                      Restablece aquí
                    </ span>
                  </p>
                  <br />
                  <motion.button
                    type="submit"
                    className="expCard-btn expCard-btn-txt py-2 px-3 mt-3 border-0 rounded-pill"
                    initial={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      </>
                    ) : <span className="expCard-btn-txt"
                    >Iniciar Sesión
                    </span>}
                  </motion.button>
                </form>
                {error ? (
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                ) : ""}
                <hr />
                <p className="text-center expLogin-t2">
                  ¿No tienes cuenta?{" "}
                  <span
                    className="text-decoration-underline text-primary"
                    style={{ cursor: "pointer" }}
                    data-bs-dismiss="modal"
                    onClick={() => Navigate("/register")}
                  >
                    Regístrate aquí
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};