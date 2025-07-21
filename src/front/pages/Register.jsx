import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error("Ingresa un email válido");
      }

      if (formData.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en el registro");
      }

      navigate("/login", {
        state: {
          registeredEmail: formData.email,
          message: "Registro exitoso. Por favor inicia sesión"
        }
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <motion.div
              className="card shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-body p-4">
                <h2 className="expCard-header fs-3 text-center mb-3">Regístrate</h2>
                {error && (
                  <div className="alert alert-danger fs-6" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'none' }}>
                    <input type="email" name="prevent_autofill_email" autoComplete="off" tabIndex="-1" />
                    <input type="password" name="prevent_autofill_password" autoComplete="new-password" tabIndex="-1" />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label expLogin-t3 fs-6">
                        Nombre
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-pill fs-6"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastname" className="form-label expLogin-t3 fs-6">
                        Apellido
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-pill fs-6"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label expLogin-t3 fs-6">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control rounded-pill fs-6"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="new-email"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label expLogin-t3 fs-6">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control rounded-pill fs-6"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength="6"
                      required
                      autoComplete="new-password"
                    />
                    <div className="form-text in-text fs-7">
                      Mínimo 6 caracteres
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="expCard-btn expCard-btn-txt border-0 rounded-pill w-100 py-2 fs-6"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Registrando...
                      </>
                    ) : "Registrarse"}
                  </motion.button>
                </form>

                <div className="mt-3 text-center">
                  <p className="mb-0 expLogin-t2 fs-6">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-decoration-underline text-primary">
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};