import { useEffect, useState } from "react";
import {
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Moon,
  Globe,
  Languages,
  Shield,
  Keyboard,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../../auth/api/authApi";
import { logout } from "../../auth/api/Logout";

type UserData = {
  id: string;
  name?: string;
  username?: string;
  email?: string;
};

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        setUser(response.user);
      } catch (error) {
      }
    };

    fetchUser();
  }, []);

  const firstLetter =
    user?.name?.charAt(0).toUpperCase() ||
    user?.username?.charAt(0).toUpperCase() ||
    "U";

  const handleLogout = async () => {
    try {
      await logout();

      setUser(null);
      setOpen(false);

      navigate("/login");
    } catch (error) {
    }
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 p-1.5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-lg font-semibold text-white">
          {firstLetter}
        </div>

        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 text-white shadow-2xl">
          
          {/* User Info */}
          <div className="flex gap-4 p-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-2xl font-semibold">
              {firstLetter}
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-semibold">
                {user?.name || user?.username || "User"}
              </h2>

              <p className="truncate text-gray-400">
                @{user?.username || "user"}
              </p>

              <Link
                to="/dashboard/profile"
                onClick={() => setOpen(false)}
                className="mt-2 block text-blue-400 hover:text-blue-300"
              >
                View your profile
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-700" />

          {/* Menu */}
          <div className="p-2">
            <Link
              to="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-lg p-3 hover:bg-gray-800"
            >
              <User size={22} />
              <span>Profile</span>
            </Link>

            <Link
              to="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-lg p-3 hover:bg-gray-800"
            >
              <Settings size={22} />
              <span>Settings</span>
            </Link>

            <button className="flex w-full items-center gap-4 rounded-lg p-3 text-left hover:bg-gray-800">
              <Moon size={22} />
              <span className="flex-1">Appearance</span>
              <ChevronRight size={20} />
            </button>

            <button className="flex w-full items-center gap-4 rounded-lg p-3 text-left hover:bg-gray-800">
              <Languages size={22} />
              <span className="flex-1">Language</span>
              <ChevronRight size={20} />
            </button>

            <button className="flex w-full items-center gap-4 rounded-lg p-3 text-left hover:bg-gray-800">
              <Globe size={22} />
              <span className="flex-1">Location</span>
              <ChevronRight size={20} />
            </button>

            <button className="flex w-full items-center gap-4 rounded-lg p-3 text-left hover:bg-gray-800">
              <Shield size={22} />
              <span>Privacy</span>
            </button>

            <button className="flex w-full items-center gap-4 rounded-lg p-3 text-left hover:bg-gray-800">
              <Keyboard size={22} />
              <span>Keyboard shortcuts</span>
            </button>

            <div className="my-2 border-t border-gray-700" />

            <Link
              to="/dashboard/help"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-lg p-3 hover:bg-gray-800"
            >
              <HelpCircle size={22} />
              <span>Help</span>
            </Link>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-4 rounded-lg p-3 text-left text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={22} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;