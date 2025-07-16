export const sendEmail = async (email) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/credentials/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  let data = {};
  try {
    data = await response.json();
  } catch {
    throw new Error("Respuesta inválida del servidor.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Error al iniciar sesión.");
  }

  return data;
};
