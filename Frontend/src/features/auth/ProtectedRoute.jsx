// components/ProtectedRoute.jsx
import { Navigate } from "react-router";
import { useAuthStore } from "../../store/auth.store";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuthStore();

  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return children;
};

export default ProtectedRoute;