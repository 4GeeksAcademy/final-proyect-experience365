import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateActivity = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    hours: "",
    minutes: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleImgChange = (event) => {
    const file = event.target.files[0];
    setFile(file)
    const reader = new FileReader();

    reader.onloadend = () => {
      setFileUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validaciones básicas
      if (!formData.name || !formData.description || !formData.price) {
        throw new Error("Todos los campos obligatorios deben completarse");
      }

      // Convertir a minutos totales
      const totalMinutes = (parseInt(formData.hours) * 60) + parseInt(formData.minutes);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("duration", totalMinutes.toString());
      if (file) {
        formDataToSend.append("file", file);
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/activity`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear actividad");
      }

      navigate("/activities", { state: { success: "Actividad creada exitosamente!" } });
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
              <h2 className="card-title text-center mb-4">Crear Nueva Actividad</h2>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Campos del formulario */}
                <div className="mb-3">
                  <label className="form-label">Nombre de la actividad*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción*</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Precio (€)*</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Duración*</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        name="hours"
                        min="0"
                        max="24"
                        value={formData.hours}
                        onChange={handleChange}
                        required
                      />
                      <span className="input-group-text">h</span>
                      <input
                        type="number"
                        className="form-control"
                        name="minutes"
                        min="0"
                        max="59"
                        value={formData.minutes}
                        onChange={handleChange}
                        required
                      />
                      <span className="input-group-text">min</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Imagen (opcional)</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    accept="image/*"
                    onChange={handleImgChange}
                  />
                </div>

                <div>
                  {
                    fileUrl !== ""
                      ?
                      <div className="col-4">
                        <img src={fileUrl} />
                      </div>
                      :
                      null
                  }
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Creando..." : "Crear Actividad"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};