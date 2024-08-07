/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('user');

    return (
        <>
            {token ? <Outlet /> : <Navigate to="/login" />}
        </>
    );
};

export default ProtectedRoute;