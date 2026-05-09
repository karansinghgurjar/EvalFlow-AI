import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getDashboardPath } from "../../utils/getDashboardPath";

function DashboardRedirect() {
  const { user } = useAuth();

  return <Navigate to={getDashboardPath(user?.role)} replace />;
}

export default DashboardRedirect;
