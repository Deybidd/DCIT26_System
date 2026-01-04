import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const isLoggedIn = localStorage.getItem("studentLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/student/login" replace />;
  }

  return <>{children}</>;
}
