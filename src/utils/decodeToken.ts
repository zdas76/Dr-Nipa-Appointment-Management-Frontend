import { jwtDecode } from "jwt-decode";
type CustomJwtPayload = {
  name: string;
  employeeId: string;
  email: string;
  scope: {
    role: string;
  };
  exp: number;
  iat: number;
  role: string;
  id: string;
};

export const decodeToken = (token: string): CustomJwtPayload => {
  return jwtDecode(token);
};
