import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateActivity = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    horas: "",
    minutos: "",
  });

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const [archivo, setArchivo] = useState(null);
  const [urlArchivo, setUrlArchivo] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImgChange = (e) => {
    const archivoSeleccionado = e.target.files[0];
    setArchivo(archivoSeleccionado);

    if (archivoSeleccionado) {
      const lector = new FileReader();
      lector.onload = () => setUrlArchivo(lector.result);
      lector.readAsDataURL(archivoSeleccionado);
    } else {
      setUrlArchivo("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      if (!formData.nombre || !formData.descripcion || !formData.precio) {
        throw new Error("¡Por favor complete todos los campos obligatorios!");
      }

      const totalMinutos = (parseInt(formData.horas) || 0) * 60 + (parseInt(formData.minutos) || 0);

      const formDataToSend = new FormData();
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("precio", formData.precio);
      formDataToSend.append("duracion", totalMinutos.toString());
      if (archivo) formDataToSend.append("archivo", archivo);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/actividad`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formDataToSend
      });

      if (!response.ok) throw new Error(await response.text());
      navigate("/actividades", { state: { success: "¡Actividad creada con éxito!" } });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Crear Nueva Actividad</h2>

              {error && <div className="alert alert-danger mb-3">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nombre de la Actividad*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción*</label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    rows="4"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="form-label">Precio (€)*</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precio"
                      min="0"
                      step="0.01"
                      value={formData.precio}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 form-group">
                    <label className="form-label">Duración*</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        name="horas"
                        min="0"
                        max="24"
                        value={formData.horas}
                        onChange={handleChange}
                        required
                      />
                      <span className="input-group-text">h</span>
                      <input
                        type="number"
                        className="form-control"
                        name="minutos"
                        min="0"
                        max="59"
                        value={formData.minutos}
                        onChange={handleChange}
                        required
                      />
                      <span className="input-group-text">min</span>
                    </div>
                  </div>
                </div>

                <div className="image-upload-section form-group">
                  <label className="form-label">Imagen (opcional)</label>
                  <div className="file-input-container">
                    <input
                      type="file"
                      className="form-control"
                      name="imagen"
                      accept="image/*"
                      onChange={handleImgChange}
                    />
                  </div>

                  {urlArchivo && (
                    <div className="img-preview-container">
                      <img src={urlArchivo} className="img-preview" alt="Vista previa" />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 form-submit-btn"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Creando...
                    </>
                  ) : "Crear Actividad"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};