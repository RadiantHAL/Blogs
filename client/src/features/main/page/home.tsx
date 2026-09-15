import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogsCard";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import { useEffect } from "react";
import { setBlogs, setError, setLoading } from "../redux/app/BlogsSlice";
import { getBlogs } from "../api/api";
import { Helmet } from "react-helmet-async";

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const blogs = await getBlogs(1, 10);
        dispatch(setBlogs(blogs));
      } catch (error) {
        dispatch(setError("Failed to fetch blogs"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchBlogs();
  }, [dispatch]);
    const { blogs, loading, error, search } = useSelector(
    (state: RootState) => state.blogs
  );
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
      </div>;

  if (error) return <p>{error}</p>;
  return (
    <div className="min-h-screen bg-gray-950">
      <Helmet>
        <title>Home | Blogly - Discover Latest Stories</title>
        <meta name="description" content="Explore the latest blogs and stories from our community on Blogly." />
      </Helmet>
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold text-white">
          Latest Blogs
        </h1>

        <div className="flex flex-col gap-6">
          {filteredBlogs.map((blog, index) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              priority={index < 2}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
