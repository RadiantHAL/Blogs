import {Router} from "express"

import multer from "multer";
import { authUser, userCheck, optionalAuth } from "../middleware/auth.middleware";
import { createBlogController, disLikeController, displayBlogController, displayIdBlogController, likeController, createCommentController, getCommentsController } from "../controllers/blog.controller";

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize:10 * 1024 * 1024,
        files: 10,
    },
    fileFilter:
        (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  }
})
const blogRouter = Router()
/**
 * @route Post /api/blog/create
 */
blogRouter.post('/create',authUser,userCheck,upload.array("media",10),createBlogController)
/**
 * @route Get /api/blog/display/:page/:limit
 */
blogRouter.get('/display/:page/:limit', optionalAuth, displayBlogController)
/**
 * @route
 */
blogRouter.patch("/:id/like",authUser,likeController)
/**
 * @route
 */
blogRouter.patch("/:id/dislike",authUser,disLikeController)
/**
 * @route
 */
blogRouter.get("/display/:id", optionalAuth, displayIdBlogController)

/**
 * @route Post /api/blog/comment
 */
blogRouter.post('/comment', authUser, createCommentController)

/**
 * @route Get /api/blog/comments/:blogId
 */
blogRouter.get('/comments/:blogId', optionalAuth, getCommentsController)

export default blogRouter
