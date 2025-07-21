import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const CreateActivity = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    price: "",
    hours: "",
    minutes: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const cities = [
    "Madrid", "Barcelona", "Valencia", "Bilbao", "Sevilla", "Zaragoza", "Albacete", "Alicante",
    "Almería", "Ávila", "Badajoz", "Burgos", "Cáceres", "Cádiz", "Castellón", "Ciudad Real",
    "Córdoba", "A Coruña", "Cuenca", "Girona", "Granada", "Guadalajara", "Huelva", "Huesca",
    "Jaén", "Las Palmas de Gran Canaria", "León", "Logroño", "Lugo", "Lleida", "Ourense",
    "Oviedo", "Palencia", "Palma", "Pamplona", "Pontevedra", "Salamanca", "San Sebastián",
    "Santa Cruz de Tenerife", "Segovia", "Soria", "Tarragona", "Teruel", "Toledo", "Valladolid",
    "Vitoria", "Zamora"
  ];

  const removeCover = () => {
    setCoverImage(null);
    setCoverPreview("");
    URL.revokeObjectURL(coverPreview);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const removeGalleryImage = (index) => {
    const newGalleryImages = [...galleryImages];
    const newGalleryPreviews = [...galleryPreviews];

    URL.revokeObjectURL(newGalleryPreviews[index]);

    newGalleryImages.splice(index, 1);
    newGalleryPreviews.splice(index, 1);

    setGalleryImages(newGalleryImages);
    setGalleryPreviews(newGalleryPreviews);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryImages = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    setGalleryImages([...galleryImages, ...selectedFiles]);

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setGalleryPreviews([...galleryPreviews, ...newPreviews]);
  };

  const uploadImages = async (activityId) => {
    const formData = new FormData();

    if (coverImage) {
      formData.append("files", coverImage);
    }

    galleryImages.forEach(file => formData.append("files", file));

    if (formData.getAll("files").length === 0) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/activity_images/${activityId}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Error al subir imágenes");
    } catch (error) {
      console.error("Error en uploadImages:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.description || !formData.price || !formData.hours || !formData.minutes || !formData.city) {
        throw new Error("Todos los campos obligatorios deben completarse");
      }

      const formattedMinutes = String(formData.minutes).padStart(2, '0');
      const duration = `${formData.hours}:${formattedMinutes}`;

      if (!/^\d{1,2}:\d{2}$/.test(duration)) {
        throw new Error("Formato de duración inválido");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("duration", duration);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/activity`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear actividad");
      }

      const activityData = await response.json();

      if (coverImage || galleryImages.length > 0) {
        await uploadImages(activityData.id);
      }

      navigate("/activities", { state: { success: "¡Actividad creada!" } });
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
            className="card shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-body p-4">
              <h2 className="expCard-header fs-4 text-center mb-4">Crear Nueva Actividad</h2>

              {error && <div className="alert alert-danger fs-6">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label expLogin-t3 fs-6">Nombre*</label>
                  <input
                    type="text"
                    className="form-control rounded-pill fs-6"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label expLogin-t3 fs-6">Descripción*</label>
                  <textarea
                    className="form-control fs-6"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label expLogin-t3 fs-6">Precio (€)*</label>
                    <input
                      type="number"
                      className="form-control rounded-pill fs-6"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label expLogin-t3 fs-6">Duración*</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control rounded-pill fs-6"
                        name="hours"
                        min="0"
                        max="24"
                        value={formData.hours}
                        onChange={handleChange}
                        required
                      />
                      <span className="input-group-text fs-6">h</span>
                      <input
                        type="number"
                        className="form-control rounded-pill fs-6"
                        name="minutes"
                        min="0"
                        max="59"
                        value={formData.minutes}
                        onChange={handleChange}
                        required
                      />
                      <span className="input-group-text fs-6">min</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label expLogin-t3 fs-6">Ciudad*</label>
                  <input
                    type="text"
                    className="form-control rounded-pill fs-6"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label expLogin-t3 fs-6">Imagen de portada*</label>
                  <input
                    type="file"
                    className="form-control fs-6"
                    accept="image/*"
                    onChange={handleCoverImage}
                    required
                    ref={coverInputRef}
                  />

                  {coverPreview && (
                    <div className="mt-2 position-relative" style={{ width: "200px" }}>
                      <img
                        src={coverPreview}
                        alt="Portada preview"
                        className="img-thumbnail"
                        style={{ width: "200px", height: "200px", objectFit: "cover" }}
                      />
                      <motion.button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                        onClick={removeCover}
                        style={{ borderRadius: "50%" }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        &times;
                      </motion.button>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label expLogin-t3 fs-6">Añadir más imágenes (opcional)</label>
                  <input
                    type="file"
                    className="form-control fs-6"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryImages}
                    ref={galleryInputRef}
                  />
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {galleryPreviews.map((url, index) => (
                      <div key={index} className="position-relative">
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="img-thumbnail"
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                        <motion.button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                          onClick={() => removeGalleryImage(index)}
                          style={{ borderRadius: "50%" }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          &times;
                        </motion.button>
                      </div>
                    ))}
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
                      Creando...
                    </>
                  ) : (
                    "Crear Actividad"
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