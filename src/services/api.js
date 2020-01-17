import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.102.109:3333"
});

export default api;
