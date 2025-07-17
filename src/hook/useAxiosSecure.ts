import axios from "axios";
import { useNavigate } from "react-router-dom";


// Axios instance
const axiosSecure = axios.create({
  baseURL: 'http://localhost:3000',
});

let interceptorsAttached = false;

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  if (!interceptorsAttached) {
    // Request interceptor
    axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          await logOut();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    interceptorsAttached = true;
  }

  return axiosSecure;
};

export default useAxiosSecure;
