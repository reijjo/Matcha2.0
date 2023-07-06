import { Link } from "react-router-dom";
import { User } from "../types";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const expandArrow = require("../icons8-expand-arrow-16.png");

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
        <Link to="/">home</Link>
      </div>
      {user ? (
        <div className="rightnav">
          <Link to="/" className="registerlog" onClick={logoutUser}>
            Logout
          </Link>
          <Link to="#" className="loginlog" onClick={handleDropdown}>
            {user.username}{" "}
            <img src={expandArrow} alt="expand" title="show more" />
          </Link>
          {isDropOpen && (
            <div className="dropdown-content">
              <Link to="#">Matches</Link>
              <hr />
              <Link to="#">My Profile</Link>
              <Link to="#">Settings</Link>
              <hr />
              <Link to="#">Your Stalkers</Link>
              <Link to="#">Who Liked You</Link>
              <Link to="#">Visited Profiles</Link>
              <Link to="#">Liked Profiles</Link>
              <hr />
              <Link to="#">Logout</Link>
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
