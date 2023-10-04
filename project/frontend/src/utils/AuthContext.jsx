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
        console.log("responseData", responseData.user);
        setUser(responseData.user);
        localStorage.setItem("user", JSON.stringify(responseData.user));
        setError(null);
      } else {
        // Handle login failure
        const responseData = await response.json();
        setError(responseData.error);

        console.error("Login failed");
      }
    } catch (error) {}
    setLoading(false);
  };

  const logoutUser = async () => {
    try {
      const response = await fetch(baseUrl + "user/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setToken(null);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const registerUser = async userInfo => {
    setError(null);
    // Send the registration data to the server
    try {
      const response = await fetch(baseUrl + "user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        // Registration successful, you can handle the response here
        console.log("Registration successful!");
        setSuccessFulRegistration(true);
        // TODO redirect to login page or login automatically
      } else {
        // Registration failed, handle error or show a message
        const errorData = await response.json();
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
