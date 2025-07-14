import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/loginUser.js";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ModalLogin = () => {

  const Navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { store, dispatch } = useGlobalReducer()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const data = await loginUser(email, password);

      setMessage("Inicio de sesión exitoso.");
      localStorage.setItem("token", data.access_token);
      const user_to_store = JSON.stringify(data.user);
      console.log(data.user);
      dispatch({
        type: "SET_USER",
        payload: user_to_store
      })
      console.log("store.user", store.user);
      console.log("data.user", data.user);
      setTimeout(() => {
        window.location.reload();
      })
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Error al iniciar sesión.");
    }
    finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 200)

    }
  };

  return (
    <div
      className="modal fade"
      id="loginModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-light rounded-4 shadow">
          <div className="modal-header border-0">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-5">
            <div className="m-0">
              <h1
                className="modal-title fs-2 expLogin-t1 text-center"
                id="exampleModalLabel"
              >Iniciar Sesión
              </h1>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3 mt-2">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label fs-5 expLogin-t3 align-self-center mt-5 mb-2 ms-1"
                >Email
                </label>
                <input
                  type="email"
                  className="form-control rounded-pill"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputPassword1"
                  className="form-label fs-5 expLogin-t3 align-self-center mb-2 ms-1"
                >Contraseña
                </label>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  id="exampleInputPassword1"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-center expLogin-t2 mt-3" >
                  ¿Has olvidado tu contraseña?{" "}
                  <span
                    className="text-decoration-underline text-primary"
                    data-bs-dismiss="modal"
                    onClick={() => Navigate("/reset-password")}
                  >
                    Restablece aquí
                  </ span>
                </p>
              </div>
              <div className="mt-3 text-center">
                <button
                  type="submit"
                  className="btn expCard-btn rounded-pill mt-3 mb-3 border-0"
                  // style={{ background: "linear-gradient(300deg,rgba(12, 87, 117, 1) 0%, rgba(42, 123, 155, 1) 33%, rgba(87, 199, 133, 0.92) 63%, rgba(237, 221, 83, 0.74) 89%, rgba(255, 255, 255, 0) 100%)", }}
                  disabled={isLoading}
                >
                  {isLoading === 1 ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    >
                    </span>) : (
                    <span className="expCard-btn-txt"
                    >Iniciar Sesión
                    </span>
                  )}
                </button>
              </div>
            </form>
            <hr />
            <p className="text-center expLogin-t2">
              ¿No tienes cuenta?{" "}
              <span
                className="text-decoration-underline text-primary"
                style={{ cursor: "pointer" }}
                data-bs-dismiss="modal"
                onClick={() => Navigate("/register")}
              >
                Regístrate aquí
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};