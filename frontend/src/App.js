import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";

const App = () => {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation />
        <main className="main-content">
          <Routes>
            {/* <Redirect from="/" to="/auth" exact /> */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            {/* <Route path="/auth" component={AuthPage} /> */}
            <Route path="/auth" element={<AuthPage />} />
            {/* <Route path="/events" component={EventsPage} /> */}
            <Route path="/events" element={<EventsPage />} />
            {/* <Route path="/bookings" component={BookingsPage} /> */}
            <Route path="/bookings" element={<BookingsPage />} />
          </Routes>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;
