import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { ModalLogin } from "../components/ModalLogin"
import { Loading } from "../components/Loading"

import { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

import { meUser } from "../services/loginUser"

export const Layout = () => {

    const { store, dispatch } = useGlobalReducer();
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            getSession();
        } else {
            setLoading(false);
        }
    }, []);

    const getSession = async () => {
        try {
            const session = await meUser(token);
            dispatch({
                type: "SET_USER",
                payload: session.user
            })
            dispatch({
                type: "SET_SESSION",
                payload: true
            })
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                ></span>
            </div>
        )
        // <Loading />

    }
    return (
        // Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
        <ScrollToTop>
            <Navbar />
            <Outlet />
            <ModalLogin />
            <Footer />
        </ScrollToTop>
    )
}