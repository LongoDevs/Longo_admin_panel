import axios from "axios";
import {jwtDecode} from "jwt-decode";
//const API_URL = import.meta.env.VITE_API_URL;
const API_URL =
  "https://africa-south1-longo-79a99.cloudfunctions.net/api/api/admin";

interface DecodedToken {
  exp: number;
}

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("longo_token");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          // Token expired
          sessionStorage.removeItem("longo_token");
          sessionStorage.removeItem("longo_user");
          window.location.href = "/login"; 
          return Promise.reject(
            new Error("Session expired. Redirecting to login.")
          );
        }
        config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        sessionStorage.removeItem("longo_token");
        sessionStorage.removeItem("longo_user");
        window.location.href = "/login";
        return Promise.reject(
          new Error("Invalid token. Redirecting to login.")
        );
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
