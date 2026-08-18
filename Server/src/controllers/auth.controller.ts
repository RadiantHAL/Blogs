import userModel from "../models/user.model";
import userBlogModel from "../models/userBlog.model";
import { Request, Response } from "express";
import blacklistTokenModel from "../models/blacklist.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { error } from "node:console";

/**
 * @name registerUserController
 * @description This function is used to register a new user.
 * @access public
 */
export const registerUserController = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username, email and password" });
  }
  const existingUsername = await userModel.findOne({ username });

  if (existingUsername) {
    return res.status(400).json({
      field: "username",
      message: "Username already exists",
    });
  }
  const existingEmail = await userModel.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({
      field: "email",
      message: "Email already exists",
    });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });
  await userBlogModel.create({
    user: user._id,
    blogs: [],
    favoriteTags: [],
  });
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" },
  );
  res.cookie("token", token);
  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};
/**
 * @name loginUserController
 * @description This function is used to login a user.
 * @access public
 */
export const loginUserController = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier) {
    return res
      .status(400)
      .json({ message: "Please provide username or email" });
  }
  if (!password) {
    return res.status(400).json({ message: "Please provide password " });
  }

  const user = await userModel.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });

  // console.log("identifier:", identifier);
  // console.log("user:", user);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" },
  );
  res.cookie("token", token);
  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};
/**
 * @name logoutUserController
 * @description clear token from user cookie and add token in blacklist
 * @access public
 */
export const logoutUserController = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (token) {
    await blacklistTokenModel.create({ token });
  }
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};
/**
 * @name getMeController
 * @description get the current logged in user details
 * @access private
 */
export const getMeController = async (req: Request, res: Response) => {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  res.status(200).json({
    message: "User details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};
