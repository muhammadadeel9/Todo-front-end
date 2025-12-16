import { getToken } from "@/lib/cookieutils";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
const token = getToken();
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};