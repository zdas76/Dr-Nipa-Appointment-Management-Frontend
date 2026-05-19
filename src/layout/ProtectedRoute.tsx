import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logOut } from "../redux/features/authSlice";
import { Navigate } from "react-router";
import { decodeToken } from "../utils/decodeToken";
import type { TUser } from "../types/User";

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);

  if (!token) {
    dispatch(logOut());
    return <Navigate to="/login" replace />;
  }

  const rawUser = decodeToken(token as string);
  const decodedUser: TUser = {
    ...rawUser,
    role: Array.isArray(rawUser.role) ? rawUser.role : [rawUser.role],
  };

  if (roles && decodedUser.role.some((r: string) => !roles.includes(r))) {
    dispatch(logOut());
    return <Navigate to="/login" replace />;
  }

  return children;
}
