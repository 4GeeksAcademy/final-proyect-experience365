import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Regístrate como Profesional</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
              {/* esto es el name */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastname" className="form-label">Apellido</label>
                    <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="form-control" required />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" minLength={6} required />
                </div>

                <div className="mb-3">
                  <label htmlFor="cif" className="form-label">CIF</label>
                  <input type="text" name="cif" value={formData.cif} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="adress" className="form-label">Dirección</label>
                  <input type="text" name="adress" value={formData.adress} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Teléfono</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descripción</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">URL de imagen</label>
                  <input type="text" name="image" value={formData.image} onChange={handleChange} className="form-control" />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                  {isLoading ? <>Registrando...</> : "Registrarse"}
                </button>
              </form>

              <div className="mt-3 text-center">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};