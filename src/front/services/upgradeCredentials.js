export const updateCredetians = async (token) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/user/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

export const upgradePassword = async (token, newPassword) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/credentials/confirm-reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al actualizar la contraseña.");
    }
    return data.message || "Contraseña actualizada exitosamente.";
  } catch (error) {
    throw new Error(error.message);
  }
};
