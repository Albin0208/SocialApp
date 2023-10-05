import axios from "axios";
import { useContext, useState, useEffect, createContext } from "react";
import { baseUrl } from "../shared";

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
      const response = await axios.post(baseUrl + "user/login", userInfo, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        const responseData = response.data;
        setToken(responseData.accessToken);
        console.log("responseData", responseData.user);
        setUser(responseData.user);
        localStorage.setItem("user", JSON.stringify(responseData.user));
        setError(null);
      } else {
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
      const response = await axios.get(baseUrl + "user/logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
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
    try {
      const response = await axios.post(baseUrl + "user/register", userInfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        console.log("Registration successful!");
        setSuccessFulRegistration(true);
      } else {
        const errorData = response.data;
        setError(errorData.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setLoading(false);
  };
  
  const checkUserStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + "user/refresh", {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        const responseData = response.data;
        setToken(responseData.accessToken);
      }
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
