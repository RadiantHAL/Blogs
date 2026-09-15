import { useState } from "react";
import Comments from "./Comments";
import SideBar from "./SideBar";
import type { Blog } from "../types/type";
import { optimizeImageUrl } from "../../../utils/imageKit";

type BlogCardProps = {
  blog: Blog;
  priority?: boolean;
};

const BlogCard = ({ blog, priority = false }: BlogCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = (blog.media || []).slice(0, 10);

  const nextImage = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, images.length - 1)
    );
  };

  const previousImage = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all duration-300 hover:border-gray-700 hover:shadow-xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white">
          {blog.title}
        </h2>

        <p className="mt-3 line-clamp-3 leading-7 text-gray-400">
          {blog.content}
        </p>

        {images.length > 0 && (
          <div className="relative mt-6 h-[500px] w-full rounded-xl">
            <div
              key={currentIndex}
              className="flex h-full w-full items-center justify-center animate-fade-in"
            >
              {images[currentIndex].mimeType.startsWith("image/") ? (
                <img
                  src={optimizeImageUrl(images[currentIndex].url)}
                  alt={blog.title}
                  className="h-full w-full object-contain"
                  loading={priority ? "eager" : "lazy"}
                  fetchpriority={priority ? "high" : "auto"}
                />
              ) : images[currentIndex].mimeType.startsWith("video/") ? (
                <video
                  src={images[currentIndex].url}
                  controls
                  className="h-full w-full object-contain"
                  preload={priority ? "metadata" : "none"}
                />
              ) : null}
            </div>

            {currentIndex > 0 && (
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-5 py-3 text-white"
              >
                ←
              </button>
            )}

            {currentIndex < images.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-5 py-3 text-white"
              >
                →
              </button>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-800 pt-4">
          <SideBar blog={blog} />
        </div>

        <div className="mt-6 border-t border-gray-800 pt-4">
          <Comments blog={blog} />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
