import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/app/hook";
import { setLoading } from "../redux/app/loadingSlice";
import { setUser } from "../redux/app/authSlice";
import { useEffect, useState } from "react";
import { getMe } from "../services/api";
import Loading from "./Loading";

type ProtectedProps = {
  children: React.ReactNode;
};

const Protected = ({ children }: ProtectedProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.loading.isLoading);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getMe();
        dispatch(setUser(data.user));
        console.log("GET ME DATA:", data);
        console.log("GET ME USER:", data.user);
      } catch (error) {
        console.log("Not authenticated");
      } finally {
        dispatch(setLoading(false));
        setChecked(true);
      }
    };
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    console.log("UPDATED USER:", user);
  }, [user]);

  if (!checked || loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;


  return children;
};
}

export default Protected;
