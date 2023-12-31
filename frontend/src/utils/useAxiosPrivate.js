import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "./AuthContext";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { token } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config;
        if (error?.response.status === 403 && !prevRequest.send) {
          prevRequest.send = true;
          const newToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [token, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
