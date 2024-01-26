import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../pages/Auth";
import BookingsPage from "../pages/Bookings";
import EventsPage from "../pages/Events";
import { AuthContext } from "../components/context/auth-context";

const AppRoutes = () => {
  const { token, userId } = useContext(AuthContext);

  return (
    <Routes>
      {!token && <Route path="/" element={<Navigate to="/auth" replace />} />}
      {token && <Route path="/" element={<Navigate to="/events" replace />} />}
      {token && (
        <Route path="/auth" element={<Navigate to="/events" replace />} />
      )}

      {!token && <Route path="/auth" element={<AuthPage />} />}
      <Route path="/events" element={<EventsPage />} />
      {token && <Route path="/bookings" element={<BookingsPage />} />}
    </Routes>
  );
};

export default AppRoutes;
