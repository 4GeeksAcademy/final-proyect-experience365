// src/services/authService.js

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Función para iniciar sesión
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

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
// Función para verificar si la sesión está iniciada en el navegador
export const meUser = async (token) => {
  const response = await fetch(`${API_URL}/api/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

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
