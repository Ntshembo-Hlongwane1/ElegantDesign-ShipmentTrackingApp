import React from "react";
import { useSelector } from "react-redux";

const AdminMenu = () => {
  const { authStatus } = useSelector((state) => state.userAuthStatus);

  return (
    <div className="Admin">
      {authStatus && authStatus.auth_status === true ? (
        <div className="Admin__menu">
          <div className="menu__Dashboard">
            <h3>DashBoard</h3>
          </div>
          <div className="menu__logout">
            <h3>Logout</h3>
          </div>
        </div>
      ) : (
        <div className="Admin__menu">
          <div className="menu__signUp">
            <h3>SignUp</h3>
          </div>
          <div className="menu__signIn">
            <h3>SignIn</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
