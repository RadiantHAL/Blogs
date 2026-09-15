import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import type { Blog } from "../types/type";
import { likeBlog, dislikeBlog } from "../api/api";
import { toast } from "react-hot-toast";
import { useAppSelector } from "../../../store";

type SideBarProps = {
  blog: Blog;
};

const SideBar = ({ blog }: SideBarProps) => {
  const user = useAppSelector((state) => state.auth.user);

  const [reaction, setReaction] = useState<"like" | "dislike" | null>(() => {
    if (!user?.id) return null;

    if (blog.likes?.some((id) => id.toString() === user.id)) {
      return "like";
    }

    if (blog.dislikes?.some((id) => id.toString() === user.id)) {
      return "dislike";
    }

    return null;
  });

  const handleLike = async () => {
    try {
      await likeBlog(blog._id);

      if (reaction === "like") {
        setReaction(null);
        toast.success("Unliked");
      } else {
        setReaction("like");
        toast.success("Liked!");
      }
    } catch (error) {
      toast.error("Failed to like blog");
    }
  };

  const handleDislike = async () => {
    try {
      await dislikeBlog(blog._id);

      if (reaction === "dislike") {
        setReaction(null);
        toast.success("Undisliked");
      } else {
        setReaction("dislike");
        toast.success("Disliked!");
      }
    } catch (error) {
      toast.error("Failed to dislike blog");
    }
  };

  return (
    <aside className="flex w-full items-center justify-between rounded-2xl border border-gray-800 bg-gray-900/80 px-4 py-2 shadow-lg backdrop-blur">
      {/* Like */}
      <button
        onClick={handleLike}
        className={`group relative rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${
          reaction === "like"
            ? "bg-blue-500/15"
            : "hover:bg-gray-800"
        }`}
      >
        <ThumbsUp
          size={22}
          className={`transition-all duration-300 ${
            reaction === "like"
              ? "fill-blue-500 text-blue-500 scale-110"
              : "text-gray-400 group-hover:text-blue-400"
          }`}
        />
      </button>

      {/* Dislike */}
      <button
        onClick={handleDislike}
        className={`group relative rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${
          reaction === "dislike"
            ? "bg-red-500/15"
            : "hover:bg-gray-800"
        }`}
      >
        <ThumbsDown
          size={22}
          className={`transition-all duration-300 ${
            reaction === "dislike"
              ? "fill-red-500 text-red-500 scale-110"
              : "text-gray-400 group-hover:text-red-400"
          }`}
        />
      </button>
    </aside>
  );
};

export default SideBar;