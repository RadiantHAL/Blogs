import { Request,Response,NextFunction} from "express"
import jwt from "jsonwebtoken"
import blacklistTokenModel from "../models/blacklist.model";

interface MyJwtPayload {
  id: string;
  username: string;
}
export const authUser = async (req:Request,res:Response,next:NextFunction)=>{
    const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  const isTokenBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isTokenBlacklisted) {
        return res.status(401).json({ message: "Token is invalid" });
    }
    
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });

  }
}