export type TUser = {
  email: string;
  employeeId: string;
  role: string[];
  exp: number;
  iat: number;
  name: string;
};

export type TAssistant = {
  id?: number;
  email?: string;
  name: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  sex: "MALE" | "FEMALE" | "OTHER";
  contactNumber: string;
  users?: {
    id: number;
    email: string;
    userName: string;
    role: string;
    status: string;
  };
};
