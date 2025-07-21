import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const EditProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setProfile({
            name: data.user.name,
            lastname: data.user.lastname,
            email: data.user.email,
          });
        }
      })
      .catch((error) => {
        setError(`Error loading profile data: ${error.message || error}`);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const validateForm = () => {
    if (!profile.email || !profile.name || !profile.lastname) {
      setError("Todos los campos son obligatorios");
      return false;
    }

    if (profile.password && profile.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(profile),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setSuccess(true);
          setError(null);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setError("Error al actualizar el perfil");
        }
      })
      .catch((error) => {
        setError("Error al actualizar el perfil");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 content-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <motion.div
              className="card shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-body p-4">
                <h2 className="expCard-header fs-3 text-center mb-4">Editar Perfil</h2>

                {error && (
                  <div className="alert alert-danger fs-6" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success fs-6" role="alert">
                    Perfil actualizado con éxito!
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ display: "none" }}>
                    <input
                      type="email"
                      name="prevent_autofill_email"
                      autoComplete="off"
                      tabIndex="-1"
                    />
                    <input
                      type="password"
                      name="prevent_autofill_password"
                      autoComplete="new-password"
                      tabIndex="-1"
                    />
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
                        value={profile.name}
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
                        value={profile.lastname}
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
                      value={profile.email}
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
                      value={profile.password}
                      onChange={handleChange}
                      minLength="6"
                      autoComplete="new-password"
                    />
                    <div className="form-text in-text fs-7">Mínimo 6 caracteres</div>
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
                        Guardando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};