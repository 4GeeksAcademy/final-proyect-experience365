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

  // Maneja cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Maneja la selección de imágenes
  const handleImgChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validaciones básicas
      if (!formData.name || !formData.description || !formData.price || !formData.hours || !formData.minutes) {
        throw new Error("Todos los campos obligatorios deben completarse");
      }

      // Convertir horas y minutos a formato HH:MM
      const formattedMinutes = String(formData.minutes).padStart(2, '0');
      const duration = `${formData.hours}:${formattedMinutes}`;

      // Validar formato de duración
      if (!/^\d{1,2}:\d{2}$/.test(duration)) {
        throw new Error("Formato de duración inválido");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("duration", duration);

      // Agregar imagen si existe
      if (file) {
        formDataToSend.append("file", file);
      }

      // Enviar a la API
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
      console.log("Actividad creada exitosamente", response.json());

      // Redirigir después de éxito
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

              {/* Mensaje de error */}
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

                  {/* Sección de Duración */}
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

                {/* Sección de carga de imagen */}
                <div className="image-upload-section form-group">
                  <label className="form-label">Imagen (opcional)</label>
                  <div className="file-input-container">
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      accept="image/*"
                      onChange={handleImgChange}
                    />
                  </div>

                  {/* Vista previa de imagen */}
                  {fileUrl && (
                    <div className="img-preview-container mt-2">
                      <img src={fileUrl} className="img-preview" alt="Preview" />
                    </div>
                  )}
                </div>

                {/* Botón de submit */}
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