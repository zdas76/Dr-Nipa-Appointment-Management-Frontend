import React from "react";

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children }: Props) {
  // const dispatch = useAppDispatch();

  // const token = useAppSelector((state) => state.auth.token);

  // if (!token) {
  //   dispatch(logOut());
  //   return <Navigate to="/login" replace />;
  // }

  // const rawUser = decodeToken(token as string);
  // const decodedUser: TUser = {
  //   ...rawUser,
  //   role: Array.isArray(rawUser.role) ? rawUser.role : [rawUser.role],
  // };

  // // Role check
  // if (
  //   roles?.length &&
  //   !decodedUser.role.some((r: string) => roles.includes(r))
  // ) {
  //   dispatch(logOut());
  //   return <Navigate to="/login" replace />;
  // }

  return children;
}
