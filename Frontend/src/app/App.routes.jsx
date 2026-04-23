import { createBrowserRouter } from "react-router";
import Dashboard from "../features/chat/Dashboard";
import AuthDashboard from "../features/auth/AuthDashboard";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import Profile from "../features/auth/Profile";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth",
    element: <AuthDashboard />,
  },
  {
    path:'/profile',
    element: (
    <ProtectedRoute>
    <Profile/>
    </ProtectedRoute>
    )
  }
]);

export default router;