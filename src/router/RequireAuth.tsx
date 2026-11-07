import { AUTH_TOKEN } from "@core/storage/authstorage";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  if (!AUTH_TOKEN()) {
    return <Navigate to="/auth/login/authourize" replace />;
  }
  return <Outlet />;
}
