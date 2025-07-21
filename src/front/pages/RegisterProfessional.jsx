import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const RegisterProfessional = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    cif: "",
    adress: "",
    phone: "",
    description: "",
    image: ""
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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/professional/register`, {
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
          message: "Registro exitoso. Por favor inicia sesión",
        },
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
          <div className="col-md-8 col-lg-6">
            <motion.div
              className="card mt-5 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-body p-4">
                <h2 className="expCard-header fs-3 text-center mb-5 mt-2">Regístrate como Profesional</h2>
                {error && <div className="alert alert-danger fs-6">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label expLogin-t3 fs-6">Nombre</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="form-control rounded-pill fs-6" 
                        required 
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastname" className="form-label expLogin-t3 fs-6">Apellido</label>
                      <input 
                        type="text" 
                        name="lastname" 
                        value={formData.lastname} 
                        onChange={handleChange} 
                        className="form-control rounded-pill fs-6" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label expLogin-t3 fs-6">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="form-control rounded-pill fs-6" 
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label expLogin-t3 fs-6">Contraseña</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      className="form-control rounded-pill fs-6" 
                      minLength={6} 
                      required 
                    />
                    <div className="form-text in-text fs-7">Mínimo 6 caracteres</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cif" className="form-label expLogin-t3 fs-6">CIF</label>
                    <input 
                      type="text" 
                      name="cif" 
                      value={formData.cif} 
                      onChange={handleChange} 
                      className="form-control rounded-pill fs-6" 
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="adress" className="form-label expLogin-t3 fs-6">Dirección</label>
                    <input 
                      type="text" 
                      name="adress" 
                      value={formData.adress} 
                      onChange={handleChange} 
                      className="form-control rounded-pill fs-6" 
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label expLogin-t3 fs-6">Teléfono</label>
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="form-control rounded-pill fs-6" 
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label expLogin-t3 fs-6">Descripción</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      className="form-control fs-6" 
                      rows="4"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="image" className="form-label expLogin-t3 fs-6">URL de imagen</label>
                    <input 
                      type="text" 
                      name="image" 
                      value={formData.image} 
                      onChange={handleChange} 
                      className="form-control rounded-pill fs-6" 
                    />
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
                    ¿Ya tienes cuenta?{" "}
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