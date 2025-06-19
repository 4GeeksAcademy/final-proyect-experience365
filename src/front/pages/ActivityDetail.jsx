import { useParams } from "react-router-dom";

export const ActivityDetail = () => {
  const { id } = useParams(); // Obtiene el ID de la URL

  return (
    <div className="container py-5">
      <h1>Detalle de la actividad ID: {id}</h1>
      <p>Esta es la página de detalles. Aquí irá la información específica.</p>
    </div>
  );
};