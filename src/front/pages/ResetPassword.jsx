import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { upgradePassword } from "../services/upgradeCredentials";
import { use } from "react";
import { nav } from "framer-motion/client";


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
          <h2 className="landing-t1">Contraseña actualizada</h2>
          <p className="landing-t2">La contraseña ha sido actualizada correctamente.</p>
          <button
            type="submit"
            className="btn my-5 btn-primary rounded-pill"
            onClick={() => Navigate("/login")}
          >Ir a iniciar Sesión</button>
        </div>
      </div>
    );
  }
  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
      <h1 className="landing-t1">Escribe tu nueva contraseña</h1>
      <form onSubmit={handleSubmit} className="mt-4 mx-auto">
        <div>
          <label className="form-label login-t2 p-2 landing-t2">Nueva Contraseña</label>
          <input
            type="password"
            className="form-control rounded-pill"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="bform-label login-t2 p-2 landing-t2">Confirma tu nueva contraseña</label>
          <input
            type="password"
            className="form-control rounded-pill"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        {alertCoincidence && <p className="mt-3 text-red-500 col-md-12 mx-auto">{alertCoincidence}</p>}

        <button
          type="submit"
          className="btn w-100 my-5 btn-primary rounded-pill"
          disabled={loading || !password || !confirmPassword || !isCoincide}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2"></span>
          ) : ("Actualizar Contraseña")}
        </button>
      </form>
      {error && <p className="mt-3 alert alert-danger col-md-6 mx-auto">{error}</p>}
      {message && <p className="mt-3 alert alert-success col-md-2 mx-auto">{message}</p>}
    </div>
  );
}