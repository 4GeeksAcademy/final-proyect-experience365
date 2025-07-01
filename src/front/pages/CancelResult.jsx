import { Link } from "react-router-dom";

export const CancelResult = () => {
  return (
    <div className="container py-5 text-center">
      <h2 className="text-danger">Pago cancelado</h2>
      <p>La transacción fue cancelada o no se completó correctamente.</p>
      <Link to="/activities" className="btn btn-outline-primary mt-3">
        Volver a las actividades
      </Link>
    </div>
  );
};