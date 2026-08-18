import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AuthToggle = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const loginActive = pathname === "/login";
  const registerActive = pathname === "/register";

  useEffect(() => {
    if (!loginActive && !registerActive) {
      navigate("/login", { replace: true });
    }
  }, [loginActive, registerActive, navigate]);

  return (
    <div className="mt-6 mb-6 flex rounded-xl border border-gray-700 bg-gray-800 p-1">

      <button
        type="button"
        onClick={() => navigate("/login")}
        className={`flex-1 rounded-lg border py-2.5 text-sm transition ${
          loginActive
            ? "border-blue-500 bg-blue-600 font-semibold text-white shadow-md"
            : "border-transparent font-medium text-gray-400 hover:text-white"
        }`}
      >
        Login
      </button>

      <button
        type="button"
        onClick={() => navigate("/register")}
        className={`flex-1 rounded-lg border py-2.5 text-sm transition ${
          registerActive
            ? "border-blue-500 bg-blue-600 font-semibold text-white shadow-md"
            : "border-transparent font-medium text-gray-400 hover:text-white"
        }`}
      >
        Register
      </button>

    </div>
  );
};

export default AuthToggle;