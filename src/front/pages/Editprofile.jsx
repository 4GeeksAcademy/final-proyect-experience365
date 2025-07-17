import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      setError("All fields are required");
      return false;
    }

    if (profile.password && profile.password.length < 6) {
      setError("Password must be at least 6 characters");
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
            navigate("/profile");
          }, 2000); // Redirigir después de 2 segundos
        } else {
          setError("Error updating profile");
        }
      })
      .catch((error) => {
        setError("Error updating profile");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Editar Perfil</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" role="alert">
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
                    <label htmlFor="name" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastname" className="form-label">
                      Apellido
                    </label>
                    <input
                      type="text"
                      className="form-control"
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
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                    autoComplete="new-email"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={profile.password}
                    onChange={handleChange}
                    minLength="6"
                    autoComplete="new-password"
                  />
                  <div className="form-text">Mínimo 6 caracteres</div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};