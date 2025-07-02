import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const CancelResult = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/activities");
    }, 3000); // Redirige después de 3 segundos

    return () => clearTimeout(timer); // Limpieza por si el componente se desmonta
  }, [navigate]);

  return (
    <div className="container py-5 text-center">
      <h2 className="text-danger">Pago cancelado</h2>
      <p>La transacción fue cancelada o no se completó correctamente.</p>
    </div>
  );
};