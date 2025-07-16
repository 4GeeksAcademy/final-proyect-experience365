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
import { CheckoutResult } from "./pages/CheckoutResult";
import { CancelResult } from "./pages/CancelResult";
import { Error } from "./error/Error";
import { FavoritesPage } from "./pages/FavoritesPage";
import { ProfessionalActivities } from "./pages/ProfessionalActivities";
import { MyReservations } from "./pages/MyReservations";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/activities" element={<ActivitiesList />} />
      <Route path="/activities/create" element={<CreateActivity />} />
      <Route
        path="/activities/:id"
        element={<ActivityDetail onFavoriteUpdate={() => window.dispatchEvent(new Event('favoritesUpdated'))} />}
      />
      <Route path="/activities/:id" element={<ActivityDetail />} />
      <Route path="/my-activities" element={<ProfessionalActivities />} />
      <Route path="/my-reservations" element={<MyReservations />} />


      <Route path="/payment/checkout-result/success" element={<CheckoutResult />} />
      <Route path="/payment/checkout-result/cancel" element={<CancelResult />} />

      {/* Errores */}
      <Route path="/error/:code" element={<Error />} />

      {/* Actividades (nuevas rutas) */}
      <Route path="/login" element={<Login />} />
      <Route path="/registerprofessional" element={<RegisterProfessional />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/favorites" element={<FavoritesPage />} />
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