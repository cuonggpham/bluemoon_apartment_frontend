import "./sideBar.css";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { isManager, isAccountant, getCurrentUserRoles, getCurrentUser, ROLES } from "../../../utils/authUtils";

const SideBar = () => {
  const [extended, setExtended] = useState(false);
  const [name, setName] = useState("");
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
    
    // Get user roles
    const roles = getCurrentUserRoles();
    setUserRoles(roles);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    toast.success("Logout successful!");
    navigate("/");
  };

  const isActiveLink = (path: string) => {
    if (path === "/dashboard/" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard/" && location.pathname.includes(path.replace("/dashboard", ""))) return true;
    return false;
  };

  // Define menu items with role requirements
  const allMenuItems = [
    { path: "/dashboard/", icon: "bx bxs-grid-alt", name: "Dashboard", tooltip: "Dashboard", roles: [ROLES.MANAGER, ROLES.ACCOUNTANT] },
    { path: "/dashboard/residents", icon: "bx bx-user", name: "Resident Management", tooltip: "Resident Management", roles: [ROLES.MANAGER] },
    { path: "/dashboard/apartments", icon: "bx bxs-home", name: "Apartment Management", tooltip: "Apartment Management", roles: [ROLES.MANAGER] },
    { path: "/dashboard/vehicles", icon: "bx bxs-car", name: "Vehicle Management", tooltip: "Vehicle Management", roles: [ROLES.MANAGER] },
    { path: "/dashboard/user-management", icon: "bx bx-group", name: "User Management", tooltip: "User Management", roles: [ROLES.MANAGER] },
    { path: "/dashboard/fee-and-fund", icon: "bx bx-money-withdraw", name: "Fee and Fund", tooltip: "Fee and Fund", roles: [ROLES.ACCOUNTANT, ROLES.MANAGER] },
    { path: "/dashboard/payment-recording", icon: "bx bx-credit-card", name: "Payment Recording", tooltip: "Payment Recording", roles: [ROLES.ACCOUNTANT, ROLES.MANAGER] },
    { path: "/dashboard/monthly-fee", icon: "bx bx-receipt", name: "Monthly Fee Management", tooltip: "Monthly Fee Management", roles: [ROLES.ACCOUNTANT, ROLES.MANAGER] },
    { path: "/dashboard/statistics", icon: "bx bx-folder", name: "Statistics", tooltip: "Statistics", roles: [ROLES.MANAGER, ROLES.ACCOUNTANT] },
    { path: "/dashboard/utility-bills", icon: "bx bxs-bolt", name: "Utility Bills", tooltip: "Utility Bills", roles: [ROLES.ACCOUNTANT, ROLES.MANAGER] },
  ];

  // Filter menu items based on user roles
  const menuItems = allMenuItems.filter(item => 
    item.roles.some(role => userRoles.includes(role))
  );

  return (
    <div className={extended ? "sidebar active" : "sidebar"}>
      <div className="logo_content">
        <div className="logo">
          <div className="logo_name">TagaApate.</div>
        </div>
        <i
          className="bx bx-menu"
          id="btn"
          onClick={() => setExtended((prev) => !prev)}
        ></i>
      </div>
      
      <ul className="nav_list">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link 
              to={item.path}
              className={isActiveLink(item.path) ? "active" : ""}
            >
              <i className={item.icon}></i>
              <span className="links_name">{item.name}</span>
            </Link>
            <span className="tooltip">{item.tooltip}</span>
          </li>
        ))}
      </ul>
        <div className="profile_content">
        <div className="profile">
          <i className="bx bx-user profile-icon-collapsed"></i>
          <div className="profile_details">
            <img
              src="https://i.pinimg.com/564x/5e/7b/9c/5e7b9c338994683cdadd9b52d95223cc.jpg"
              alt="Admin profile"
            />
            <div className="name_role">
              <div className="name">{name || "Unknown User"}</div>
              <div className="role">
                {isManager() ? "Manager" : isAccountant() ? "Accountant" : "User"}
              </div>
            </div>
          </div>
          <i
            title="Logout"
            className="bx bx-log-out"
            id="log_out"
            onClick={handleLogout}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
