import axios from "axios"
import type { AuthResponse } from "../types/type";
const api = axios.create({
baseURL:"http://localhost:3000",
withCredentials: true,
 headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})
export default api



export const getMe = async () => {
  const response = await api.get<AuthResponse>("/api/auth/get-me");
  console.log("GET ME:", response.data);
  return response.data;
};