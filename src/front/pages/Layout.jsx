import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { ModalLogin } from "../components/ModalLogin"
import { Loading } from "../components/Loading"
import { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { meUser } from "../services/loginUser"
import { toast } from "react-toastify";

export const Layout = () => {
    const { store, dispatch } = useGlobalReducer();
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/favorite/user`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) throw new Error("Error al cargar favoritos");
            const data = await response.json();
            dispatch({ type: "handleFavorites", payload: data });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const getSession = async () => {
            try {
                if (token) {
                    const session = await meUser(token);
                    dispatch({
                        type: "SET_USER",
                        payload: session.user
                    });
                    dispatch({
                        type: "SET_SESSION",
                        payload: true
                    });
                    await fetchFavorites();
                }
            } catch (error) {
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        };

        getSession();
    }, [token, dispatch]);

    if (loading) {
        return (
            <Loading />

        );
    }

    return (
        <ScrollToTop>
            <Navbar />
            <Outlet />
            <ModalLogin />
            <Footer />
        </ScrollToTop>
    );
};