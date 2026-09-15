import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { addBlog } from "../redux/app/BlogsSlice";
import type { AppDispatch } from "../../../store";
import api from "../api/api";
import axios from "axios";

type BlogForm = {
  title: string;
  content: string;
};

const CreateBlog: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogForm>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [media, setMedia] = useState<File[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const title = watch("title");
  const content = watch("content");

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (
      tags.some(
        (existingTag) =>
          existingTag.toLowerCase() === tag.toLowerCase()
      )
    ) {
      setTagInput("");
      return;
    }

    if (tags.length >= 8) {
      setError("Maximum 8 tags allowed.");
      return;
    }

    setTags((prev) => [...prev, tag.toLowerCase()]);
    setTagInput("");
    setError("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) =>
      prev.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleMediaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type.startsWith("video/")
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Only images and videos are allowed.");
      return;
    }

    if (media.length + validFiles.length > 10) {
      setError("Maximum 10 media files allowed.");
      return;
    }

    setMedia((prev) => [...prev, ...validFiles]);
    setError("");
  };

  const removeMedia = (index: number) => {
    setMedia((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: BlogForm) => {
    setError("");
    setSuccess("");

    if (tags.length === 0) {
      setError("At least one tag is required.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", data.title.trim());
      formData.append("content", data.content.trim());
      formData.append("tags", tags.join(","));

      media.forEach((file) => {
        formData.append("media", file);
      });

      const response = await api.post("/create", formData);

      dispatch(addBlog(response.data.blog));

      reset();
      setTags([]);
      setTagInput("");
      setMedia([]);
      setPreview(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess("Blog published successfully!");

      setTimeout(() => {
        navigate("/dashboard/user");
      }, 500);
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Failed to create blog."
        );
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-7">
          <h1 className="text-3xl font-bold">
            Create a Blog
          </h1>

          <p className="mt-2 text-gray-400">
            Share your thoughts, ideas and knowledge.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-xl md:p-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-800 bg-green-950/40 px-4 py-3 text-sm text-green-400">
              {success}
            </div>
          )}

          {preview ? (
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-sm text-gray-400">
                  Preview
                </p>

                <h1 className="text-3xl font-bold">
                  {title || "Untitled Blog"}
                </h1>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-700 px-3 py-1.5 text-sm text-gray-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="whitespace-pre-wrap break-words text-base leading-8 text-gray-200">
                {content || "No content yet."}
              </div>

              {media.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {media.map((file, index) => {
                    const url = URL.createObjectURL(file);

                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900"
                      >
                        {file.type.startsWith("image/") ? (
                          <img
                            src={url}
                            alt={file.name}
                            className="h-64 w-full object-cover"
                          />
                        ) : (
                          <video
                            src={url}
                            controls
                            className="h-64 w-full object-cover"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-gray-700 pt-6">
                <button
                  type="button"
                  onClick={() => setPreview(false)}
                  className="rounded-xl border border-gray-600 bg-gray-700 px-5 py-3 font-medium hover:bg-gray-600"
                >
                  Back to Edit
                </button>

                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Publishing..."
                    : "Publish"}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div>
                <div className="mb-2 flex justify-between">
                  <label
                    htmlFor="title"
                    className="text-sm font-semibold text-gray-200"
                  >
                    Title
                  </label>

                  <span className="text-xs text-gray-500">
                    {title.length}/150
                  </span>
                </div>

                <input
                  id="title"
                  type="text"
                  maxLength={150}
                  placeholder="Enter an interesting title..."
                  {...register("title", {
                    required: "Title is required.",
                    minLength: {
                      value: 3,
                      message:
                        "Title must contain at least 3 characters.",
                    },
                    maxLength: {
                      value: 150,
                      message:
                        "Title cannot exceed 150 characters.",
                    },
                  })}
                  className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                {errors.title && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <label
                    htmlFor="content"
                    className="text-sm font-semibold text-gray-200"
                  >
                    Content
                  </label>

                  <span className="text-xs text-gray-400">
                    {content.length}/5000
                  </span>
                </div>

                <textarea
                  id="content"
                  maxLength={5000}
                  placeholder="Write your blog content here..."
                  {...register("content", {
                    required: "Content is required.",
                    minLength: {
                      value: 10,
                      message:
                        "Content must contain at least 10 characters.",
                    },
                    maxLength: {
                      value: 5000,
                      message:
                        "Content cannot exceed 5000 characters.",
                    },
                  })}
                  className="min-h-5 field-sizing-content w-full resize-none rounded-2xl border border-gray-600 bg-gray-700 px-5 py-4 text-base leading-7 text-gray-100 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                {errors.content && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="tagInput"
                  className="mb-2 block text-sm font-semibold text-gray-200"
                >
                  Tags
                </label>

                <div className="min-h-[52px] w-full rounded-xl border border-gray-600 bg-gray-700 px-3 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 rounded-full bg-gray-600 px-3 py-1.5 text-sm text-gray-200"
                      >
                        #{tag}

                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    <input
                      id="tagInput"
                      type="text"
                      value={tagInput}
                      onChange={(e) =>
                        setTagInput(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder={
                        tags.length === 0
                          ? "Type a tag and press Enter..."
                          : "Add another tag..."
                      }
                      className="min-w-[180px] flex-1 bg-transparent px-2 py-1 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Press Enter to add a tag • Maximum 8
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Media
                </label>

                <label
                  htmlFor="media"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-600 bg-gray-700/60 px-6 py-10 text-center hover:border-blue-500"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-600 text-2xl">
                    +
                  </div>

                  <p className="font-medium">
                    Click to upload media
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Images and videos only
                  </p>

                  <p className="mt-3 text-xs text-gray-500">
                    {media.length}/10 files selected
                  </p>

                  <input
                    ref={fileInputRef}
                    id="media"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                </label>

                {media.length > 0 && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {media.map((file, index) => {
                      const url = URL.createObjectURL(file);

                      return (
                        <div
                          key={`${file.name}-${index}`}
                          className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900"
                        >
                          {file.type.startsWith("image/") ? (
                            <img
                              src={url}
                              alt={file.name}
                              className="h-52 w-full object-cover"
                            />
                          ) : (
                            <video
                              src={url}
                              controls
                              className="h-52 w-full object-cover"
                            />
                          )}

                          <div className="flex items-center justify-between px-3 py-2">
                            <p className="max-w-[70%] truncate text-xs text-gray-300">
                              {file.name}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                removeMedia(index)
                              }
                              className="text-xs text-red-400"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-700 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setPreview(true)}
                  className="rounded-xl border border-gray-600 bg-gray-700 px-6 py-3 font-medium hover:bg-gray-600"
                >
                  Preview
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Publishing..."
                    : "Publish Blog"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;