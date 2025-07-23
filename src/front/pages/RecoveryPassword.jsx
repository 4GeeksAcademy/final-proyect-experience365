import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
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
          <motion.h2
            className="landing-t1"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0 }}
          ><FontAwesomeIcon icon={faEnvelope} /></motion.h2>
          <motion.p
            className="landing-t1 text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >Correo enviado
          </motion.p>
          <motion.p
            className="landing-t3"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          >Te hemos enviado un correo para restablecer tu contraseña
          </motion.p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
      <div className="col-md-6 col-lg-4 m-5">
        <motion.div
          className="card shadow-lg border-0 rounded-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-body p-4">
            <h2 className="expCard-header fs-4 text-center mt-3 my-4">Recupera tu cuenta</h2>

            <p className="ps-4 expCard-txt fs-5">Introduce tu email y te enviaremos las instrucciones para recuperar tu contraseña.</p>
            <form
              className="mt-4 col-12 align-items-center d-flex flex-column"
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <label className="form-label expLogin-t3 fs-6" htmlFor="email">Email</label>
                <input className="form-control rounded-pill fs-6" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

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
                >Enviar Correo
                </span>}
              </motion.button>
            </form>

            {message === "If the email exists, a reset link has been sent" ? (<p className="mt-3 alert alert-success col-md-6 mx-auto">{message}</p>) :
              message && (<p className="mt-3 alert alert-danger col-md-6 mx-auto">{message}</p>)}
          </div>
        </motion.div>
      </div>
    </div>
  );
};