import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";

export default function ProtectedRoute() {
  const { user, fetchMe } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const verify = async () => {
      await fetchMe();
      setChecked(true);
    };
    verify();
  }, [fetchMe]);

  if (!checked) return null; 

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
