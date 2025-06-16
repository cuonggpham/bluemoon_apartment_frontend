import { Navigate } from "react-router-dom";
import { isManager } from "../../../utils/authUtils";
import Vehicles from "./Vehicles";

const VehiclesProtected = () => {
  if (!isManager()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Vehicles />;
};

export default VehiclesProtected; 