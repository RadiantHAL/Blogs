import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Blog } from "../../types/type";




interface BlogState {
    blogs: Blog[];
    search: string
    loading: boolean;
    error: string | null;
}
const initialState:BlogState={
  blogs: [],
  loading: false,
  error: null,
  search: "",
}
const blogsSlice = createSlice({
    name:"blog",
    initialState,
    reducers:{
        setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = action.payload;
    },
    addBlog: (state, action: PayloadAction<Blog>) => {
      state.blogs.push(action.payload);
    },
    setSearch: (state, action: PayloadAction<string>) => {
  state.search = action.payload;
},
    removeBlog: (state, action: PayloadAction<string>) => {
      state.blogs = state.blogs.filter(
        (blog) => blog._id !== action.payload
      );
    },
    clearBlogs: (state) => {
      state.blogs = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
})
export const {

  setBlogs,

  addBlog,

  removeBlog,

  clearBlogs,

  setLoading,

  setError,

  setSearch

} = blogsSlice.actions;

export default blogsSlice.reducer;