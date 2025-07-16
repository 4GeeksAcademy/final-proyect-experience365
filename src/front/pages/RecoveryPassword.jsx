import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { sendEmail } from "../services/sendEmail";


export const RecoveryPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail(e.target.value);
    console.log(email);
    setIsLoading(true);
    try {
      const data = await sendEmail(email);
      if (data) {
        setIsLoading(false);
        setMessage(data.message);
        setTimeout(() => {
          window.location.href = ("/");
        }, 5000);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  if (message === "If the email exists, a reset link has been sent") {
    return (
      <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
        <div className="container py-5 text-center">
          <h2 className="landing-t1">Correo enviado</h2>
          <p className="landing-t2">Te hemos enviado un correo para restablecer tu contraseña</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
      <h1 className="landing-t1">Recupera tu cuenta</h1>
      <p className="p-2 landing-t3 fs-5 text-light">Introduce tu email y te enviaremos las instrucciones para recuperar tu contraseña.</p>

      <form onSubmit={handleSubmit} className="mt-4 col-md-2 mx-auto">
        <div className="mb-3">
          <label className="form-label login-t2 p-2 landing-t2" htmlFor="email">Email</label>
          <input className="form-control rounded-pill" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        </div>

        <button
          type="submit"
          className="btn w-100 my-5 btn-primary rounded-pill "
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
            </>
          ) : "Enviar Correo"}
        </button>
      </form>

      {message === "If the email exists, a reset link has been sent" ? (<p className="mt-3 alert alert-success col-md-6 mx-auto">{message}</p>) :
        message && (<p className="mt-3 alert alert-danger col-md-6 mx-auto">{message}</p>)}
    </div>
  );
};