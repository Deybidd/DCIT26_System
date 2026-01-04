import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ProtectedInstructorRoute({ children }: Props) {
  const isLoggedIn = localStorage.getItem("instructorLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/instructor/login" replace />;
  }

  return <>{children}</>;
}