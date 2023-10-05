import axios from "../api/axios";

import { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [successFulRegistration, setSuccessFulRegistration] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const loginUser = async (userInfo) => {
    setLoading(true);
    try {
      const response = await axios.post("user/login", userInfo, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        // Handle successful login
        const responseData = response.data;
        setToken(responseData.accessToken);
        console.log("responseData", responseData.user);
        setUser(responseData.user);
        localStorage.setItem("user", JSON.stringify(responseData.user));
        setError(null);
      } else {
        // Handle login failure
        const responseData = response.data;
        setError(responseData.error);
  
        console.error("Login failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setLoading(false);
  };
  
  const logoutUser = async () => {
    try {
      console.log("logoutUser");

      const response = await axios.get("user/logout", {
        withCredentials: true,
      });

      console.log("response", response);
      if (response.status === 204) {
        localStorage.removeItem("user");
        setToken(null);
      }
    } catch (error) {
      console.log(error);
    }
  
    setLoading(false);
  };
  
  const registerUser = async (userInfo) => {
    setError(null);
    // Send the registration data to the server
    try {
      const response = await axios.post("user/register", userInfo, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        // Registration successful, you can handle the response here
        console.log("Registration successful!");
        setSuccessFulRegistration(true);
        // TODO redirect to the login page or log in automatically
      } else {
        // Registration failed, handle error or show a message
        const errorData = response.data;
        setError(errorData.error); // Set the error message from the backend
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setLoading(false);
  };
  
  const checkUserStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get("user/refresh", {
        withCredentials: true,
      });
  
      const responseData = response.data;
      setToken(responseData.accessToken);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const contextData = {
    token,
    user,
    error,
    successFulRegistration,
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
