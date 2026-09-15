import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import type { SearchForm } from "../types/type";
import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
  const { register, handleSubmit } = useForm<SearchForm>();

  const onSubmit = (data: SearchForm) => {
  };

  return (
    <nav className="flex items-center justify-between gap-6 border-b border-gray-800 bg-gray-950 px-6 py-4 text-white shadow-lg md:px-8">
      <Link
        to="/"
        className="shrink-0 text-2xl font-bold tracking-tight"
      >
        Blog
      </Link>

      {/* Search */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative hidden w-full max-w-2xl md:block"
      >
        <Search
          size={19}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          {...register("search")}
          type="text"
          placeholder="Search blogs..."
          className="w-full rounded-xl border border-gray-800 bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </form>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-3">

        {/* User */}
        <Link

  to="/dashboard/user"

  className="rounded-xl border border-gray-700 bg-gray-900 px-5 py-2.5 text-sm font-medium text-gray-200 transition-all duration-300 hover:border-gray-500 hover:bg-gray-800 hover:text-white"

>

  User

</Link>

        {/* Profile */}
        <ProfileMenu />

      </div>
    </nav>
  );
};

export default Navbar;