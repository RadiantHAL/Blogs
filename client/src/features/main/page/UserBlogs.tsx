import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Heart,
  ThumbsDown,
  FileText,
} from "lucide-react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../auth/redux/app/hook";
import { getMe } from "../../auth/api/authApi";
import { getBlogs } from "../api/api";
import { setBlogs } from "../redux/app/BlogsSlice";
import BlogsUserCard from "../components/BlogsUserCard";

type TabType = "my-blogs" | "liked" | "disliked";

const UserBlogs = () => {
  const blogs = useAppSelector((state) => state.blogs.blogs);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("my-blogs");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getMe();
        setUserId(userResponse.user.id);
        const blogsResponse = await getBlogs(1, 100);
        dispatch(setBlogs(blogsResponse));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const myBlogs = blogs.filter(
    (blog) => String(blog.user?._id) === String(userId)
  );
  const likedBlogs = blogs.filter((blog) => blog.isLiked);
  const dislikedBlogs = blogs.filter((blog) => blog.isDisliked);

  const currentBlogs =
    activeTab === "my-blogs" ? myBlogs :
    activeTab === "liked" ? likedBlogs :
    dislikedBlogs;

  const tabConfig = {
    "my-blogs": { label: "My Blogs", icon: <FileText size={18} /> },
    "liked": { label: "Liked", icon: <Heart size={18} /> },
    "disliked": { label: "Disliked", icon: <ThumbsDown size={18} /> },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 transition hover:text-white"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </div>

          <Link
            to="/dashboard/create"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
          >
            <Plus size={18} />
            Create Blog
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {tabConfig[activeTab].label}
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {activeTab === "my-blogs"
                ? "Manage and view your blogs"
                : `Blogs you have ${activeTab === "liked" ? "liked" : "disliked"}`}
            </p>
          </div>

          <div className="flex gap-2 rounded-xl bg-gray-900 p-1 border border-gray-800">
            {(Object.keys(tabConfig) as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-gray-800 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tabConfig[tab].icon}
                {tabConfig[tab].label}
              </button>
            ))}
          </div>
        </div>

        {currentBlogs.length === 0 ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-gray-800 bg-gray-900/50 px-6 text-center">
            <h2 className="text-2xl font-semibold">
              {activeTab === "my-blogs" ? "No blogs yet" : "No blogs in this list"}
            </h2>
            <p className="mt-2 max-w-md text-gray-400">
              {activeTab === "my-blogs"
                ? "You haven't created any blogs yet. Start writing and share your ideas with others."
                : `You haven't ${activeTab === "liked" ? "liked" : "disliked"} any blogs yet.`}
            </p>
            {activeTab === "my-blogs" && (
              <Link
                to="/dashboard/create"
                className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500"
              >
                <Plus size={18} />
                Create your first blog
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentBlogs.map((blog) => (
              <BlogsUserCard
                key={blog._id}
                blog={blog}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserBlogs;
