import { createBrowserRouter } from "react-router";
import Root from "../pages/Root/Root";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import RoutinePage from "../pages/RoutinePage";

import Login from "../pages/Login";
import AdminRoute from "../pages/AdminRoute";
import AdminDashboard from "../pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <RoutinePage />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "admin",
        element: <AdminRoute><AdminDashboard /></AdminRoute>
      }
    ]
  },
]);