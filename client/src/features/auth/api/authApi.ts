import api from "./api";
import type { AuthResponse } from "../types/type";
export const getMe = async () => {
  const response = await api.get<AuthResponse>("/get-me");
  return response.data;
};