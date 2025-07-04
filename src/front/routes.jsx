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
import { Login } from "./pages/Login";
import { RegisterProfessional } from "./pages/RegisterProfessional";
import { Link } from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<NotFound />}>
      <Route index element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/activities" element={<ActivitiesList />} />
      <Route path="/activities/create" element={<CreateActivity />} />
      <Route 
        path="/activities/:id" 
        element={<ActivityDetail onFavoriteUpdate={() => window.dispatchEvent(new Event('favoritesUpdated'))} />} 
      />
      <Route path="/login" element={<Login />} />
      <Route path="/registerprofessional" element={<RegisterProfessional />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

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