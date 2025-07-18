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
import { LoginSuccess } from "./pages/LoginSuccess";
import { RegisterProfessional } from "./pages/RegisterProfessional";
import { Results } from "./pages/Results";

import { Link } from "react-router-dom";

// Stripe
import { CheckoutResult } from "./pages/CheckoutResult";
import { CancelResult } from "./pages/CancelResult";

// Recovery Password
import { RecoveryPassword } from "./pages/RecoveryPassword";
import { ResetPassword } from "./pages/ResetPassword";


import { Error } from "./error/Error";

import { EditProfile } from "./pages/Editprofile";
import { EditProfessionalProfile } from "./pages/EditProfileProfessional";

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
      {/* <Route
        path="/activities/:id"
        element={<ActivityDetail onFavoriteUpdate={() => window.dispatchEvent(new Event('favoritesUpdated'))} />}
      /> */}
      <Route path="/activities/:id" element={<ActivityDetail />} />
      <Route path="/my-activities" element={<ProfessionalActivities />} />
      <Route path="/my-reservations" element={<MyReservations />} />


      <Route path="/payment/checkout-result/success" element={<CheckoutResult />} />
      <Route path="/payment/checkout-result/cancel" element={<CancelResult />} />

      {/* Errores */}
      <Route path="/error/:code" element={<Error />} />

      {/* Actividades (nuevas rutas) */}
      <Route path="/login" element={<Login />} />
      <Route path="/login/success" element={<LoginSuccess />} />
      <Route path="/registerprofessional" element={<RegisterProfessional />} />

      {/* Ruta de edición de perfil */}
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/edit-professional-profile" element={<EditProfessionalProfile />} />

      <Route path="/results" element={<Results />} />

      <Route path="*" element={<NotFound />} />


      {/* Recuperar Contraseña */}
      <Route path="/recovery-password" element={<RecoveryPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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