import { useContext, useState, useEffect, createContext } from "react";
import { baseUrl } from "../shared";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  // const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const loginUser = async userInfo => {
    setLoading(true);
    try {
      const response = await fetch(baseUrl + "user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        // Handle successful login
        const responseData = await response.json();
        setToken(responseData.accessToken);
      } else {
        // Handle login failure
        console.error("Login failed");
      }
    } catch (error) {}
    setLoading(false);
  };

  const logoutUser = () => {
    // TODO Add logout logic
  };

  const registerUser = userInfo => {
    // TODO Add register logic
  };

  const checkUserStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(baseUrl + "user/refresh", {
        method: "GET",
        credentials: "include",
      });

      const responseData = await response.json();
      setToken(responseData.accessToken);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const contextData = {
    // user,
    token,
    setToken,
    loading,
    registerUser,
    loginUser,
    logoutUser,
    checkUserStatus,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
