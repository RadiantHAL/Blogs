import { useState } from 'react'
import type { LoginForm } from '../types/type'
import { useForm, type SubmitHandler } from 'react-hook-form'
import AuthToggle from '../components/AuthToggle'
import Error from '../components/Error'
import { Eye, EyeOff } from 'lucide-react'
import Button from '../components/Button'
import api from '../api/api'
import axios from 'axios'
import { useAppDispatch,useAppSelector } from '../redux/app/hook'
import { useNavigate } from 'react-router-dom'
import { setLoading } from '../redux/app/loadingSlice'
import { setUser } from '../redux/app/authSlice'

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(
    (state) => state.auth.user
  );
     const {register,handleSubmit,formState:{errors},setError} = useForm<LoginForm>()
     const [showPassword, setShowPassword] = useState(false);
    const onSubmit:SubmitHandler<LoginForm> = async (data)=>{
        try {
          dispatch(setLoading(true));
    const response = await api.post("/login", data);
    dispatch(setUser(response.data.user));

  } catch (error) {
    if (axios.isAxiosError(error)){
    const message = error.response?.data?.message;
   if (message === "Invalid password") {
        setError("password", {
          type: "server",
          message: "Password is incorrect",
        });
      } else {
        setError("identifier", {
          type: "server",
          message: message || "Username or email is incorrect",
        });
      }}}
      finally{
        dispatch(setLoading(false));
        navigate("/dashboard");
      }
        }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 ">
      
      <div className="w-full max-w-md rounded-2xl bg-gray-800 p-8 shadow-2xl border border-gray-700">
        
      <h1 className="text-3xl font-bold tracking-tight text-white text-center mb-5">Welcome Back </h1>
      <AuthToggle/>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
         <input
      {...register("identifier",{
        required:{value:true, message:"Username is required"},
        minLength:{value:3, message:"Username must contain at least 3 characters" },
        maxLength:{value:150, message:"Username must be at most 150 characters" }
      }) } 
      placeholder="Username"
      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
      <Error error={errors.identifier}/>
      <div className="relative">
          <input 
          type={showPassword ? "text" : "password"}
    placeholder="Password"
          {...register("password",{
            required:{value:true, message:"Password is required"}
          } )}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <button
          onClick={() => setShowPassword(!showPassword)}
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          </div>
          <Error error={errors.password}/>
        <Button children="Sign In" type="submit"/>
        </form>
        </div>
    </div>
  )
}

export default Login
