import React from "react";
import { BrowserRouter } from "react-router-dom";

import MainNavigation from "./components/Navigation/MainNavigation";
import AuthProvider from "./components/context/auth-context";
import AppRoutes from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthProvider>
          <MainNavigation />
          <main className="main-content">
            <AppRoutes />
          </main>
        </AuthProvider>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;
