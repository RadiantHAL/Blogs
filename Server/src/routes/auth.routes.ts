import {Router} from "express"
import { getMeController, loginUserController, logoutUserController, registerUserController } from "../controllers/auth.controller"
import { authUser } from "../middleware/auth.middleware"

const authRouter = Router()
/**
 * @route Post /api/auth/register
 * @description Register a new user
 * @access public 
*/
authRouter.post('/register',registerUserController)
/**
 * @route Post /api/auth/login
 * @description login user email and password
 * @access public
 */
authRouter.post('/login',loginUserController)
/**
 * @route Get /api/auth/logout
 * @description clear token from user cookie and add token in blacklist
 * @access public
 */
authRouter.get('/logout',logoutUserController)
/**
 * @route Get api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get('/get-me',authUser,getMeController)
export default authRouter