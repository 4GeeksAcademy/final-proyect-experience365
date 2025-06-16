import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Register } from "./pages/Register";

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Página no encontrada</h1>}>
        {/* Página principal */}
        <Route index element={<Home />} />
        
        {/* Autenticación */}
        <Route path="/register" element={<Register />} />
        
        {/* Experiencias (similar a Airbnb) */}
        <Route path="/experiences" element={<ExperiencesList />} />
        <Route path="/experiences/:id" element={<ExperienceDetail />} />
        
        {/* Demo (puedes mantenerlo o eliminarlo) */}
        <Route path="/demo" element={<Demo />} />
        
        {/* Ruta para detalles individuales */}
        <Route path="/single/:theId" element={<Single />} />
        
        {/* Ruta de error personalizada */}
        <Route path="*" element={<NotFound />} />
      </Route>
    )
);

// Componentes temporales (deberás crearlos después)
function ExperiencesList() {
    return <div className="container py-5">Listado de experiencias</div>;
}

function ExperienceDetail() {
    return <div className="container py-5">Detalle de experiencia</div>;
}

function NotFound() {
    return (
        <div className="container text-center py-5">
            <h1>404 - Página no encontrada</h1>
            <p>La página que buscas no existe.</p>
        </div>
    );
}