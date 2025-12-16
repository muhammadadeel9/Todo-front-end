import { getToken } from "@/lib/cookieutils";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
const token = getToken();
  if (token) {
    return <Navigate to="/tasks" replace />;
  }

  return <>{children}</>;
};