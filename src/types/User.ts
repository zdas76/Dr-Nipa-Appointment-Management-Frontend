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

export type TPatient = {
  id?: number;
  patientId: number,
  name: string;
  age: number;
  sex: "MALE" | "FEMALE" | "OTHER";
  contactNumber: string;
  address: string;
  isDeleted: boolean;

};

export type TConnector = {
  id?: number;
  name: string;
  contactNumber: string;
  email?: string;
  diagnosticName?: string;
  newPatientAmount: number;
  oldPatientAmount: number;
  isDeleted: boolean;

};

export type TAppointment = {
  id?: number;
  patientId: number;
  visitingDate: string;
  patientType: "NEW" | "OLD";
  status?: "BOOKED" | "PRESENT" | "ABSENT" | "VISITED";
  visitingTime?: string;
  connectorId?: number | null;
  visitingFee?: number | null;
  weight?: number | null;
  booldPusher?: string | null;
  bloodGroup?: string | null;
  discount?: number | null;
  paymentStatus?: "PAID" | "UNPAID" | "PARTIALLY_PAID";
  patient?: TPatient;
  connector?: TConnector;
  patientInfo?: {
    name: string;
    contactNumber: string;
    sex: "MALE" | "FEMALE" | "OTHER";
  };
  connectorInfo?: {
    name: string;
    contactNumber: string;
    diagnosticName: string;
    phoneNumber: string;
  };
};

export type TAppointmentList = {
  data: TAppointment[] | null;
}
