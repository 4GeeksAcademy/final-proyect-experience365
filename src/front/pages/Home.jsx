import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  // (Mantén tu función loadMessage() si la necesitas)

  return (
    <div className="text-center mt-5">
      <h1 className="display-4">¡Bienvenido a Experience365!</h1>
      
      {/* Mensaje del backend (opcional) */}
      {store.message && (
        <div className="alert alert-info mb-4">
          {store.message}
        </div>
      )}

      {/* Botones de acceso rápido */}
      <div className="mt-4">
        <Link to="/activities" className="btn btn-primary btn-lg mx-2">
          Explorar Actividades
        </Link>
        <Link to="/activities/create" className="btn btn-success btn-lg mx-2">
          Crear Actividad
        </Link>
      </div>

      {/* Imagen opcional (puedes quitarla) */}
      {/* <img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Experience365" /> */}
    </div>
  );
};