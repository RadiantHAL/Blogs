import axios from "axios"
import type { Blog } from "../types/type";

const api = axios.create({
  baseURL: "http://localhost:3000/api/blog",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

export const getBlogs = async (
  page: number,
  limit: number
): Promise<Blog[]> => {
  const response = await api.get(`/display/${page}/${limit}`);
  return response.data.blogs;
};

export const likeBlog = async (id: string) => {
    const response = await api.patch(`/${id}/like`);
    return response.data;
}

export const dislikeBlog = async (id: string) => {
    const response = await api.patch(`/${id}/dislike`);
    return response.data;
}

export const createComment = async (data: { content: string, parentId: string }) => {
    const response = await api.post('/comment', data);
    return response.data;
}

export const getComments = async (blogId: string) => {
    const response = await api.get(`/comments/${blogId}`);
    return response.data.comments;
}

export default api
