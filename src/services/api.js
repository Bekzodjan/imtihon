import axios from "axios";

const api = axios.create({
  baseURL: "", // Backend URL-ni moslang
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
