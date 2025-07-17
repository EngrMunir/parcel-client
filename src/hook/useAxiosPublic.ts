import axios from "axios";

// You can toggle between environments using environment variables
const baseURL = 'http://localhost:3000';

const axiosPublic = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
