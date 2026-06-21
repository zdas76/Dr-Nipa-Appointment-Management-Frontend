/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBrowserRouter } from "react-router";
import App from "../App";
import Login from "../pages/UtilsPate/Login";
import Dashboardlayout from "./DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import { dashboardRoutes, type RouteConfig } from "./routerConfig";
import ChangePassword from "../pages/Profile/ChangePassword";
import Profile from "../pages/Profile/Profile";
import ProfileLayout from "./ProfileLayout";
import PrintPage from "../pages/dashboard/Appoint/PrintPage";

const generateRoutes = (routes: RouteConfig[]): any[] => {
  let generated: any[] = [];

  routes.forEach((route) => {
    if (route.children) {
      if (route.path && route.element) {
        // If grouping item has path/element (rare in this case), add it
        generated.push({
          path: route.path,
          element: route.roles ? (
            <ProtectedRoute roles={route.roles}>{route.element}</ProtectedRoute>
          ) : (
            route.element
          ),
        });
      }
      // Recurse
      generated = generated.concat(generateRoutes(route.children));
    } else {
      // Leaf node
      if (route.path || route.index) {
        generated.push({
          path: route.path,
          index: route.index,
          element: route.roles ? (
            <ProtectedRoute roles={route.roles}>{route.element}</ProtectedRoute>
          ) : (
            route.element
          ),
        });
      }
    }
  });
  return generated;
};

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/print-page",
    element: (
      <PrintPage />
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute roles={["ADMIN", "DOCTOR", "ASSISTANT"]}>
        <ProfileLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Profile />,
      },
      {
        path: "/profile/change-password",
        element: <ChangePassword />,
      },

    ]
  },
  {
    path: "/dashboard",
    errorElement: <Dashboardlayout />,
    element: (
      <ProtectedRoute roles={["ADMIN", "DOCTOR", "ASSISTANT"]}>
        <Dashboardlayout />
      </ProtectedRoute>
    ),
    children: generateRoutes(dashboardRoutes),
  },
]);
