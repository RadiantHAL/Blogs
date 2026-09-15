import { useForm, type SubmitHandler } from "react-hook-form";
import type { RegisterForm } from "../types/type";
import Error from "../components/Error";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../components/Button";
import AuthToggle from "../components/AuthToggle";
import api from "../api/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score - 1] ?? "Weak" };
}
const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm<RegisterForm>();
  const password = watch("password");
  const navigate = useNavigate();
  const { score, label } = getStrength(password || "");
  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      const { ConfimPassword, ...userData } = data;
      const response = await api.post("register", userData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const field = error.response?.data?.field;

        const message = error.response?.data?.message;

        if (field === "username") {
          setError("username", {
            type: "server",
            message,
          });
        }
        if (field === "email") {
          setError("email", {
            type: "server",
            message,
          });
        }
      }
    }finally{
      navigate("/dashboard");
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showComfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 ">
      <div className="w-full max-w-md rounded-2xl bg-gray-800 p-8 shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold tracking-tight text-white text-center mb-5">
          Create an Account{" "}
        </h1>
        <AuthToggle />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            {...register("username", {
              required: { value: true, message: "Username is required" },
              minLength: {
                value: 3,
                message: "Username must contain at least 3 characters",
              },
              maxLength: {
                value: 150,
                message: "Username must be at most 150 characters",
              },
            })}
            placeholder="Username"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <Error error={errors.username} />
          <input
            {...register("email", {
              required: { value: true, message: "Email is required" },
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Please enter a valid email",
              },
            })}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <Error error={errors.email} />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: { value: true, message: "Username is required" },
              })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => {
                  let color = "bg-gray-700";

                  if (level <= score) {
                    if (score === 1) color = "bg-red-500";
                    else if (score === 2) color = "bg-orange-500";
                    else if (score === 3) color = "bg-yellow-500";
                    else if (score === 4) color = "bg-green-500";
                  }

                  return (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full ${color}`}
                    />
                  );
                })}
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Strength:{" "}
                <span
                  className={
                    score === 1
                      ? "text-red-500"
                      : score === 2
                        ? "text-orange-500"
                        : score === 3
                          ? "text-yellow-500"
                          : "text-green-500"
                  }
                >
                  {label}
                </span>
              </p>
            </div>
          )}
          <Error error={errors.password} />

          <div className="relative">
            <input
              type={showComfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("ConfimPassword", {
                required: {
                  value: true,
                  message: "Confirm pasword is required",
                },
                validate: (value, formValues) =>
                  value === formValues.password || "Passwords do not match",
              })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={() => setShowConfirmPassword(!showPassword)}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showComfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Error error={errors.ConfimPassword} />
          <Button children="Sign Up" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Register;
