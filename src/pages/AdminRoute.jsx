import { useContext } from "react";

import { Navigate } from "react-router";
import { AuthContext } from "../components/context/AuthContext";

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="text-center mt-20 text-2xl">Loading...</div>;

    if (user) {
        return children;
    }

    return <Navigate to="/login"></Navigate>;
};

export default AdminRoute;