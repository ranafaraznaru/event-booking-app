import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  const providerValue = {
    token,
    userId,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
