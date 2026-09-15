import api from "./api";

export const logout = async () => {
  const response = await api.get("/logout");
  return response.data;
};