import { useState, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import type { Blog } from "../types/type";
import { getComments, createComment } from "../api/api";
import { toast } from "react-hot-toast";

type Comment = {
  _id: string;
  content: string;
  user: {
    username: string;
    email: string;
  };
  createdAt: string;
};

type CommentsProps = {
  blog: Blog;
};

const Comments = ({ blog }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchComments = async () => {
    if (!blog?._id) return;

    setIsFetching(true);
    try {
      console.log(`Fetching comments for blog: ${blog._id}`);
      const data = await getComments(blog._id);
      console.log("Fetched comments:", data);
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blog?._id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsLoading(true);
    try {
      console.log("Posting comment:", { content: commentText, parentId: blog._id });
      await createComment({
        content: commentText,
        parentId: blog._id,
      });
      setCommentText("");
      toast.success("Comment posted!");
      // Re-fetch comments to update the list
      await fetchComments();
    } catch (error: any) {
      console.error("Error posting comment:", error);
      const errMsg = error.response?.data?.message || "Failed to post comment";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-400">
        <MessageSquare size={20} />
        <h3 className="text-sm font-semibold">Comments ({comments.length})</h3>
      </div>

      <form onSubmit={handlePostComment} className="flex gap-3">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || !commentText.trim()}
          className="rounded-xl bg-blue-600 p-2 text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>

      <div className="space-y-4">
        {isFetching && comments.length === 0 ? (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-all hover:bg-gray-900"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400">
                  @{comment.user?.username || 'anonymous'}
                </span>
                <span className="text-[10px] text-gray-500">
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
