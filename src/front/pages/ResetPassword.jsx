import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { upgradePassword } from "../services/upgradeCredentials";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";


export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const Navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successSubmit, setSuccessSubmit] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isCoincide, setIsCoincide] = useState(false);
  const [alertCoincidence, setAlertCoincidence] = useState("");

  useEffect(() => {
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        setIsCoincide(false);
        setAlertCoincidence("Las contraseñas no coinciden.");
      } else {
        setIsCoincide(true);
        setAlertCoincidence("");
      }
    }

  }, [password, confirmPassword]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const message = await upgradePassword(token, password);
      setMessage(message);
    } catch (err) {
      setError(err.message || "Network error.");
    } finally {
      setLoading(false);
      setSuccessSubmit(true);
      setTimeout(() => {
        Navigate("/login");
      }, 3000);

    }
  };
  if (successSubmit) {
    return (
      <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
        <div className="container py-5 text-center">
          <motion.h2
            className="landing-t1"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0 }}
          ><FontAwesomeIcon icon={faCircleCheck} /></motion.h2>
          <motion.p
            className="landing-t1 text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >Contraseña actualizada
          </motion.p>
          <motion.p
            className="landing-t3"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          >La contraseña ha sido actualizada correctamente.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
          >
            <motion.button
              className="my-4 btn-primary expCard-btn-txt rounded-pill py-2 px-4 border-0"
              transition={{ duration: 0.2, ease: "easeOut", delay: 0 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => Navigate("/login")}
            >
              Iniciar Sesión
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
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
            <h2 className="expCard-header fs-4 text-center mt-3 my-4">
              Escribe tu nueva contraseña
            </h2>
            <form
              className="mt-4 col-12 align-items-center d-flex flex-column"
              onSubmit={handleSubmit}
            >
              <div className="mb-3 col-10">
                <label className="form-label expLogin-t3 fs-6 p-2" htmlFor="password">
                  Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control rounded-pill fs-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="mb-3 col-10">
                <label className="form-label expLogin-t3 fs-6 p-2" htmlFor="password"
                >Confirma tu nueva contraseña
                </label>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              {alertCoincidence ? <p className="mt-3 alert text-center alert-danger py-1 col-md-10 rounded-4">{alertCoincidence}</p> :

                <motion.button
                  type="submit"
                  className="expCard-btn expCard-btn-txt py-2 px-3 mt-4 mb-3 border-0 rounded-pill"
                  style={{ cursor: "pointer" }}
                  initial={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  disabled={loading || !password || !confirmPassword || !isCoincide}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : ("Actualizar Contraseña")}
                </motion.button>}
            </form>
            {error && <p className="mt-3 alert text-center alert-danger py-1 col-md-10 rounded-4">{error}</p>}
            {message && <p className="mt-3 alert text-center alert-success py-1 col-md-10 rounded-4">{message}</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}