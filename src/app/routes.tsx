import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/client/LoginPage";
import { ClientLayout } from "./components/client/ClientLayout";
import { ClientDashboard } from "./components/client/ClientDashboard";
import { BookingWizard } from "./components/client/BookingWizard";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { BranchManagement } from "./components/admin/BranchManagement";
import { ServicesManagement } from "./components/admin/ServicesManagement";
import { StaffManagement } from "./components/admin/StaffManagement";
import { ScheduleConfig } from "./components/admin/ScheduleConfig";

export const router = createBrowserRouter([
  { path: "/", Component: LoginPage },
  {
    path: "/client",
    Component: ClientLayout,
    children: [
      { index: true, Component: ClientDashboard },
      { path: "booking", Component: BookingWizard },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "branches", Component: BranchManagement },
      { path: "services", Component: ServicesManagement },
      { path: "staff", Component: StaffManagement },
      { path: "schedules", Component: ScheduleConfig },
    ],
  },
]);
