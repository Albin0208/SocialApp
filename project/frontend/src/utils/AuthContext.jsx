import axios from "../api/axios";
import { useContext, useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { SHA256 } from "crypto-js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    loginError: null,
    registerError: null,
  });
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [successFulRegistration, setSuccessFulRegistration] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const loginUser = async userInfo => {
    setLoading(true);
    try {
      const { password } = userInfo;

      const hashedPassword = SHA256(password).toString();

      const response = await axios.post("user/login", {
        username: userInfo.username,
        password: hashedPassword,
      });

      if (response.status === 200) {
        // Successful login
        const responseData = response.data;

        setToken(responseData.accessToken);
        setUser(responseData.user);
        // localStorage.setItem("user", JSON.stringify(responseData.user));
        console.log("Login successful");
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 404) {
        // Unauthorized: Incorrect credentials
        setError({ loginError: "Incorrect username or password." });
        console.error("Login failed: Incorrect username or password.");
      } else {
        // Handle other response status codes
        setError({ loginError: "An error occurred while logging in." });
        console.error("Login failed with status code:", error.response.status);
      }
    }
    setLoading(false);
  };

  const logoutUser = async () => {
    try {
      const response = await axios.get("user/logout");

      if (response.status === 204) {
        localStorage.removeItem("user");
        setToken(null);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const registerUser = async userInfo => {
    // Send the registration data to the server
    try {
      const { password } = userInfo;

      const hashedPassword = SHA256(password).toString();

      const response = await axios.post("user/register", {
        username: userInfo.username,
        password: hashedPassword,
      });

      if (response.status === 201) {
        setSuccessFulRegistration(true);

        // Sets a timeout for redirecting to the login page
        setTimeout(() => {
          setSuccessFulRegistration(false);
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 400) {
        setError({ registerError: "Username and password are required" }); // Set the error message from the backend
      } else if (error.response.status === 409) {
        setError({ registerError: "Username is already taken" }); // Set the error message from the backend
      }

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
      setUser(responseData.user);
      setToken(responseData.accessToken);
    } catch (error) {
      // console.log(error);
    }
    setLoading(false);
  };

  const reset = () => {
    setError({ loginError: null, registerError: null });
    setSuccessFulRegistration(false);
  };

  const contextData = {
    token,
    setToken,
    user,
    error,
    reset,
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
