export function validateInput(
  username: string,
  password: string
): string | null {
  if (username.length < 3) return "Username must be at least 3 characters.";
  if (username.length > 50) return "Username cannot exceed 50 characters.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must include a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(password))
    return "Password must include a special character.";
  return null;
}

export function validateContent(titel: string, link: string, type: string) {
  if (titel.length === 0) return "Title required";
  if (link.length === 0) return "Link required";
  if (type.length === 0) return "Type required";
  return null;
}

import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const token = localStorage.getItem("Authorization");
  return token ? <>{children}</> : <Navigate to="/" replace />;
}
