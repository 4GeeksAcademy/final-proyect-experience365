import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { ActivitiesList } from "./pages/ActivitiesList";
import { CreateActivity } from "./pages/CreateActivity";
import { ActivityDetail } from "./pages/ActivityDetail";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<NotFound />}>
      {/* Página principal */}
      <Route index element={<Home />} />

      {/* Autenticación */}
      <Route path="/register" element={<Register />} />

      {/* Actividades (nuevas rutas) */}
      <Route path="/activities" element={<ActivitiesList />} />
      <Route path="/activities/create" element={<CreateActivity />} />
      <Route path="/activities/:id" element={<ActivityDetail />} />

      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

// Componente 404 reutilizable
function NotFound() {
  return (
    <div className="container text-center py-5">
      <h1>404 - Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Volver al inicio
      </Link>
    </div>
  );
}