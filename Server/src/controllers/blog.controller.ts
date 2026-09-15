import { Request, Response } from "express";
import blogModel from "../models/blog.model";
import userBlogModel from "../models/userBlog.model";
import commentModel from "../models/comment.model";
import { uploadToImageKit } from "../services/storage.service";
import { ParamsDictionary } from "express-serve-static-core";
import {convertImageToWebP,convertVideoToWebM} from "../services/media.service";
import { catchAsync } from "../utils/catchAsync";
import mongoose, { FilterQuery } from "mongoose";

/**
 * @name createBlogController
 * @description This function is used to create Blog
 * @access private
 */
export const createBlogController = catchAsync(async (
  req: Request,
  res: Response
) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  let blogTags: string[] = [];

  if (Array.isArray(tags)) {
    blogTags = tags
      .flatMap((tag: string) => tag.split(","))
      .map((tag: string) => tag.trim().toLowerCase())
      .filter(Boolean);
  } else if (typeof tags === "string") {
    blogTags = tags
      .split(",")
      .map((tag: string) => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  blogTags = [...new Set(blogTags)];

  if (blogTags.length === 0) {
    return res.status(400).json({
      message: "At least one tag is required",
    });
  }

  if (blogTags.length > 8) {
    return res.status(400).json({
      message: "Maximum 8 tags are allowed",
    });
  }

  const files = (req.files as Express.Multer.File[]) || [];
  const media: {
    url: string;
    fileId: string;
    name: string;
    mimeType: string;
  }[] = [];

  for (const file of files) {
    let convertedBuffer: Buffer;
    let mimeType: string;
    let fileName = file.originalname;

    if (file.mimetype.startsWith("image/")) {
      convertedBuffer = await convertImageToWebP(file.buffer);
      mimeType = "image/webp";
      fileName = file.originalname.replace(/\.[^/.]+$/, ".webp");
    } else if (file.mimetype.startsWith("video/")) {
      convertedBuffer = await convertVideoToWebM(file.buffer);
      mimeType = "video/webm";
      fileName = file.originalname.replace(/\.[^/.]+$/, ".webm");
    } else {
      continue;
    }

    const uploaded = await uploadToImageKit(convertedBuffer, fileName, mimeType);
    media.push(uploaded);
  }

  const blog = await blogModel.create({
    title: title.trim(),
    content: content.trim(),
    tags: blogTags,
    media,
    user: req.user.id,
    likes: [req.user.id], // Automatically like the blog if you are the creator
  });

  await userBlogModel.findOneAndUpdate(
    { user: req.user.id },
    { $push: { blogs: blog._id } },
    { upsert: true, returnDocument: 'after' }
  );

  return res.status(201).json({
    message: "Blog created successfully",
    blog,
  });
});

/**
 * @name displayBlogController
 * @description This function is used to display blogs
 * @access public
 */
interface BlogParams {
  page: string;
  limit: string;
}
export const displayBlogController = catchAsync(async (
  req: Request<BlogParams>,
  res: Response,
) => {
  const limit: number = parseInt(req.params.limit);
  const page: number = parseInt(req.params.page);
  if (!limit || !page || limit <= 0 || page <= 0) {
    return res.status(400).json({
      message: "Invalid page or limit",
    });
  }

  const userId = req.user?.id;

  const blogs = await blogModel
    .find()
    .populate("user", "username email")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  const blogsWithInteraction = blogs.map(blog => ({
    ...blog,
    isLiked: userId ? blog.likes.some(id => id.toString() === userId) : false,
    isDisliked: userId ? blog.dislikes.some(id => id.toString() === userId) : false,
  }));

  return res.status(200).json({
    message: "Blogs fetched successfully",
    blogs: blogsWithInteraction,
  });
});

/**
 * @name likeController
 * @description This function is used to like +1
 * @access private
 */
interface LikeParams extends ParamsDictionary {
  id: string;
}
export const likeController = catchAsync(async (
  req: Request<LikeParams>,
  res: Response,
) => {
  const blogId = req.params.id;
  const userId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: "Invalid Blog ID format" });
  }

  const blog = await blogModel.findById(blogId);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const alreadyLiked = blog.likes.some(id => id.toString() === userId);

  if (alreadyLiked) {
    // Toggle: Remove like
    await blogModel.findByIdAndUpdate(blogId, {
      $pull: { likes: userId },
    });
    res.status(200).json({ message: "Blog unliked successfully" });
  } else {
    // Add like and remove dislike
    const updatedBlog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId },
      },
      { new: true }
    ).lean();
    res.status(200).json({
      message: "Blog liked successfully",
      blog: updatedBlog,
    });
  }
});

/**
 * @name disLikeController
 * @description This function is used to dislike +1
 * @access private
 */
export const disLikeController = catchAsync(async (
  req: Request<LikeParams>,
  res: Response,
) => {
  const blogId = req.params.id;
  const userId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: "Invalid Blog ID format" });
  }

  const blog = await blogModel.findById(blogId);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const alreadyDisliked = blog.dislikes.some(id => id.toString() === userId);

  if (alreadyDisliked) {
    // Toggle: Remove dislike
    await blogModel.findByIdAndUpdate(blogId, {
      $pull: { dislikes: userId },
    });
    res.status(200).json({ message: "Blog undisliked successfully" });
  } else {
    // Add dislike and remove like
    const updatedBlog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId },
      },
      { new: true }
    ).lean();
    res.status(200).json({
      message: "Blog disliked successfully",
      blog: updatedBlog,
    });
  }
});

/**
 * @name displayIdBlogController
 * @description this function is used to display blog of give id
 * @access public
 */
interface BlogIdParams extends ParamsDictionary {
  id: string;
}
export const displayIdBlogController = catchAsync(async (
  req: Request<BlogIdParams>,
  res: Response,
) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog ID format" });
  }

  const blog = await blogModel.findById(id).lean();
  if (!blog) {
    return res.status(404).json({
      message: "Blog not found",
    });
  }
  const isLiked = userId
    ? blog.likes.some((likeId) => likeId.toString() === userId)
    : false;
  const isDisliked = userId
    ? blog.dislikes.some((dislikeId) => dislikeId.toString() === userId)
    : false;
  res.status(200).json({
    message: "Blog fetched successfully",
    blog: {
      ...blog,
      isLiked,
      isDisliked,
    },
  });
});

/**
 * @name createCommentController
 * @description This function is used to create a comment on a blog
 * @access private
 */
export const createCommentController = catchAsync(async (req: Request, res: Response) => {
  const { content, parentId } = req.body;
  const userId = req.user.id;

  if (!content || !parentId) {
    return res.status(400).json({ message: "Content and parentId are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    return res.status(400).json({ message: "Invalid Parent ID format" });
  }

  const comment = await commentModel.create({
    content,
    parent: new mongoose.Types.ObjectId(parentId),
    parentType: "Blog",
    user: userId,
  });

  res.status(201).json({
    message: "Comment added successfully",
    comment,
  });
});

/**
 * @name getCommentsController
 * @description This function is used to fetch comments for a blog
 * @access public
 */
interface IComment {
  _id: mongoose.Types.ObjectId;
  content: string;
  parent: mongoose.Types.ObjectId;
  parentType: "Blog" | "Comment";
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export const getCommentsController = catchAsync(async (req: Request, res: Response) => {
  const { blogId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: "Invalid Blog ID format" });
  }

  try {
    // 2. Explicitly type the filter as FilterQuery<IComment>
    const filter: FilterQuery<IComment> = {
      parent: new mongoose.Types.ObjectId(blogId),
      parentType: "Blog",
    };

    const comments = await commentModel
      .find(filter) // Now TypeScript knows exactly what 'filter' is
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error while fetching comments",
      error: error.message,
    });
  }
});
