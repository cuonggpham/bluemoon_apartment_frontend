import "./DashBoard.css";
import Apartments from "./mainContent/Apartment";
import FeesAndFunds from "./mainContent/FeesAndFunds";
import Overview from "./mainContent/Overview";
import Resident from "./mainContent/Resident";
import Statistics from "./mainContent/Statistics";
import VehiclesProtected from "./mainContent/VehiclesProtected";
import PaymentRecording from "./mainContent/PaymentRecording";
import MonthlyFeeManagement from "./mainContent/MonthlyFeeManagement";
import UserManagement from "./mainContent/UserManagement";
import SideBar from "./sideBar/SideBar";
import { Routes, Route } from "react-router-dom";
import UtilityBills from "./mainContent/UtilityBills";

const DashBoard = () => {
  return (
    <div className="main-dashboard">
      <SideBar />
      <div className="dashboard-content" style={{ flex: 1 }}>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Overview />}></Route>
          <Route path="/residents" element={<Resident />}></Route>
          <Route path="/apartments" element={<Apartments />}></Route>
          <Route path="/fee-and-fund" element={<FeesAndFunds />}></Route>
          <Route path="/vehicles" element={<VehiclesProtected />}></Route>          
          <Route path="/payment-recording" element={<PaymentRecording />}></Route>
          <Route path="/monthly-fee" element={<MonthlyFeeManagement />}></Route>
          <Route path="/statistics" element={<Statistics />}></Route>
          <Route path="/utility-bills" element={<UtilityBills />}></Route>
          <Route path="/user-management" element={<UserManagement />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default DashBoard;
