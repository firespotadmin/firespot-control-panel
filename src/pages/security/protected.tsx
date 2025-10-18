// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "@/layouts/loading";

const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // Simulate token check delay (you can replace this with real API validation)
        setTimeout(() => {
            if (token) {
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
            }
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (!authenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
