/* eslint-disable @typescript-eslint/no-var-requires */
import { Link } from "react-router-dom";
import { User } from "../../types";
import { useState } from "react";

const expandIcon = require("../../images/icons8-expand-arrow-16.png");
const closeIcon = require("../../images/icons8-close-16.png");
const noNotification = require("../../images/icons8-notification-16.png");
// const yesNotification = require("../../images/notification-16.png");
const logotext = require("../../images/logotext.png");

const Navbar = ({ user }: { user: User | null }) => {
  const [isDropOpen, setIsDropOpen] = useState(false);

  const handleDropdown = () => {
    setIsDropOpen(!isDropOpen);
  };

  const logoutUser = () => {
    localStorage.removeItem("matchaToken");
    window.location.replace("/");
  };

  return (
    <nav>
      <div className="leftnav">
        <Link to={user ? "/feed" : "/"}>
          <img src={logotext} alt="logotext" className="logo" />
        </Link>
      </div>
      {user ? (
        <div className="rightnav">
          <Link to="/" className="registerlog" onClick={logoutUser}>
            <span>Logout</span>
          </Link>
          <Link to="#" className="notiflog">
            <img src={noNotification} alt="noNotifs" className="notif" />
          </Link>
          <Link to="#" className="loginlog" onClick={handleDropdown}>
            {user.username}{" "}
            <img
              src={isDropOpen ? closeIcon : expandIcon}
              alt="expand"
              title="show more"
            />
          </Link>
          {isDropOpen && (
            <div className="dropdown-content">
              {user.status && user.status < 3 ? (
                <span style={{ display: "none" }}></span>
              ) : (
                <>
                  <Link to="#">Matches</Link>

                  <hr />
                  <Link to="#">My Profile</Link>
                  <Link to="/settings">Settings</Link>
                  <hr />
                  <Link to="#">Your Stalkers</Link>
                  <Link to="#">Who Liked You</Link>
                  <Link to="#">Visited Profiles</Link>
                  <Link to="#">Liked Profiles</Link>
                  <hr />
                  <Link to="#" onClick={logoutUser}>
                    Logout
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="rightnav">
          <Link to="/register" className="register">
            Register
          </Link>
          <Link to="login" className="login">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
