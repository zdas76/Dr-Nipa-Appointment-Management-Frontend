import { AccessAlarmOutlined, AddCommentRounded, PersonalInjuryRounded, } from "@mui/icons-material";
import AssistantManagement from "../pages/dashboard/assistant/Assistant";
import PatientManagement from "../pages/dashboard/patient/Patient";
import ConnectorManagement from "../pages/dashboard/connector/Connector";
import Dashboard from "../pages/dashboard/Dashboard";
import AppointmentManagement from "../pages/dashboard/Appoint/Appiontment";


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
    path: "patient-management",
    title: "Patient Management",
    icon: <PersonalInjuryRounded />,
    // roles: ["ADMIN", "ASSISTANT"],
    element: <PatientManagement />,
  },
  {
    path: "connector-management",
    title: "Connector Management",
    icon: <PersonalInjuryRounded />,
    // roles: ["ADMIN", "ASSISTANT"],
    element: <ConnectorManagement />,
  },
  {
    path: "appointment",
    title: "Create Appointment",
    icon: <AddCommentRounded />,
    // roles: ["ADMIN", "ASSISTANT"],
    element: <AppointmentManagement />,
  }

];
