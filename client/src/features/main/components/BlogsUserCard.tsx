import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { Blog } from "../types/type";

type BlogsUserCardProps = {
  blog: Blog;
};

const BlogsUserCard = ({ blog }: BlogsUserCardProps) => {
  const media = blog.media?.[0];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 text-white">
      <div className="aspect-video w-full overflow-hidden bg-gray-800">
        {media?.mimeType.startsWith("image/") ? (
          <img
            src={media.url}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        ) : media?.mimeType.startsWith("video/") ? (
          <video
            src={media.url}
            controls
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 text-xl font-bold">
          {blog.title}
        </h2>

        <p className="mt-2 line-clamp-3 min-h-[72px] text-gray-400">
          {blog.content}
        </p>

        <div className="mt-4 min-h-[32px]">
          <div className="flex flex-wrap gap-2">
            {blog.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center gap-5 border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2 text-gray-300">
            <ThumbsUp size={18} />
            <span>{blog.likes?.length ?? 0}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <ThumbsDown size={18} />
            <span>{blog.dislikes?.length ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsUserCard;