import { AccessAlarmOutlined, AddCommentRounded, PersonalInjuryRounded, } from "@mui/icons-material";
import AssistantManagement from "../pages/dashboard/assistant/Assistant";
import PatientManagement from "../pages/dashboard/patient/Patient";
import ConnectorManagement from "../pages/dashboard/connector/Connector";
import Dashboard from "../pages/dashboard/Dashboard";
import AppointmentManagement from "../pages/dashboard/Appoint/Appointment";
import ViewAssistantInfo from "../pages/dashboard/assistant/ViewAssistantInfo";
import ViewPatient from "../pages/dashboard/patient/ViewPatient";
import ViewConnectorInfo from "../pages/dashboard/connector/ViewConnectorInfo";
import ViewAppointmentinfo from "../pages/dashboard/Appoint/ViewAppointmentinfo";


export interface RouteConfig {
  path?: string;
  index?: boolean;
  element?: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  roles?: string[];
  children?: RouteConfig[];
  hidden?: boolean;
}

export const dashboardRoutes: RouteConfig[] = [
  {
    index: true,
    element: <Dashboard />,
    roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
    hidden: true,
  },
  {
    path: "add-assistant",
    title: "Assistant Management",
    icon: <AccessAlarmOutlined />,
    // roles: ["ADMIN"],
    element: <AssistantManagement />,
  },
  {
    path: "add-assistant/:id",
    title: "View Assistant",
    icon: <AccessAlarmOutlined />,
    // roles: ["ADMIN"],
    element: <ViewAssistantInfo />,
    hidden: true,
  },
  {
    path: "patient-management",
    title: "Patient Management",
    icon: <PersonalInjuryRounded />,
    // roles: ["ADMIN", "ASSISTANT"],
    element: <PatientManagement />,
  },
  {
    path: "patient-management/:id",
    title: "Patient Management",
    icon: <PersonalInjuryRounded />,
    // roles: ["ADMIN", "ASSISTANT"],
    element: <ViewPatient />,
    hidden: true,
  },
  {
    path: "connector-management",
    title: "Connector Management",
    icon: <PersonalInjuryRounded />,
    // roles: ["ADMIN", "ASSISTANT"],
    element: <ConnectorManagement />,
  },
  {
    path: "connector-management/:id",
    title: "View Connector",
    icon: <PersonalInjuryRounded />,
    // roles: ["ADMIN", "ASSISTANT"],
    element: <ViewConnectorInfo />,
    hidden: true,
  },
  {
    path: "appointment",
    title: "Appointment List",
    icon: <AddCommentRounded />,
    // roles: ["ADMIN", "ASSISTANT"],
    element: <AppointmentManagement />,
  },
  {
    path: "appointment/:id",
    title: "Appointment Details",
    icon: <AddCommentRounded />,
    // roles: ["ADMIN", "ASSISTANT"],
    element: <ViewAppointmentinfo />,
    hidden: true,
  }
];
