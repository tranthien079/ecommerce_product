import axios from "axios";
import { base_url } from "../utils/base_url";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

export const instance = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    toast.error(error.response.data.message || 'Có lỗi xảy ra');
    return Promise.reject(error.response.data);
  }
);
