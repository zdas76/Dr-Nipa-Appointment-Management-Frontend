import { AccessAlarmOutlined, AddCommentRounded, ChecklistRtl, FolderCopy, Forum, PersonalInjuryRounded, Summarize, } from "@mui/icons-material";
import AssistantManagement from "../pages/dashboard/assistant/Assistant";
import PatientManagement from "../pages/dashboard/patient/Patient";
import ConnectorManagement from "../pages/dashboard/connector/Connector";
import Dashboard from "../pages/dashboard/Dashboard";
import AppointmentManagement from "../pages/dashboard/Appoint/Appointment";
import ViewAssistantInfo from "../pages/dashboard/assistant/ViewAssistantInfo";
import ViewPatient from "../pages/dashboard/patient/ViewPatient";
import ViewConnectorInfo from "../pages/dashboard/connector/ViewConnectorInfo";
import ViewAppointmentinfo from "../pages/dashboard/Appoint/ViewAppointmentinfo";
import AppointmentList from "../pages/dashboard/Appoint/AppointmentList";
import SendSmsToPatient from "../pages/dashboard/sendSms/SendSmsToPatient";
import DailyReport from "../pages/dashboard/report/DailyReport";


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
    roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
    element: <AssistantManagement />,
  },
  {
    path: "add-assistant/:id",
    title: "View Assistant",
    icon: <AccessAlarmOutlined />,
    roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
    element: <ViewAssistantInfo />,
    hidden: true,
  },
  {
    path: "patient-management",
    title: "Patient Management",
    icon: <PersonalInjuryRounded />,
    roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
    element: <PatientManagement />,
  },
  {
    path: "patient-management/:patientId",
    title: "Patient Management",
    icon: <PersonalInjuryRounded />,
    roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
    element: <ViewPatient />,
    hidden: true,
  },
  {
    path: "connector-management",
    title: "Connector Management",
    icon: <PersonalInjuryRounded />,
    roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
    element: <ConnectorManagement />,
  },
  {
    path: "connector-management/:id",
    title: "View Connector",
    icon: <PersonalInjuryRounded />,
    roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
    element: <ViewConnectorInfo />,
    hidden: true,
  },
  {
    path: "appointment",
    title: "Add Appointment",
    icon: <AddCommentRounded />,
    roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
    element: <AppointmentManagement />,
  },
  {
    path: "appointment/:id",
    title: "Appointment Details",
    icon: <AddCommentRounded />,
    roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
    element: <ViewAppointmentinfo />,
    hidden: true,
  },
  {
    path: "patient-list",
    title: "Patient List",
    icon: <ChecklistRtl />,
    roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
    element: <AppointmentList />,
  },

  {
    path: "send-sms",
    title: "Send SMS",
    icon: <Forum />,
    roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
    element: <SendSmsToPatient />,

  },
  {
    path: "report",
    title: "Report",
    icon: <FolderCopy />,
    roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
    children: [
      {
        path: "daily-report",
        title: "Daily Report",
        icon: <Summarize />,
        roles: ["ADMIN", "ASSISTANT", "DOCTOR"],
        element: <DailyReport />,
      },
    ]
  }
];
