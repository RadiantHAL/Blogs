import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Blog } from "../../types/type";

type BlogsState = {
  blogs: Blog[];
};

const initialState: BlogsState = {
  blogs: [],
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = action.payload;
    },

    addBlog: (state, action: PayloadAction<Blog>) => {
      state.blogs.unshift(action.payload);
    },

    removeBlog: (state, action: PayloadAction<string>) => {
      state.blogs = state.blogs.filter(
        (blog) => blog._id !== action.payload
      );
    },
  },
});

export const {
  setBlogs,
  addBlog,
  removeBlog,
} = blogsSlice.actions;

export default blogsSlice.reducer;