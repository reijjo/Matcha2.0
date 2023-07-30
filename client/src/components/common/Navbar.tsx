/* eslint-disable @typescript-eslint/no-var-requires */
import { Link, useLocation } from "react-router-dom";
import { User } from "../../utils/types";
import { useRef, useState, useEffect } from "react";
import loginService from "../../services/loginService";

const expandIcon = require("../../images/icons/icons8-expand-arrow-16.png");
const closeIcon = require("../../images/icons/icons8-close-16.png");
const noNotification = require("../../images/icons/icons8-notification-16.png");
// const yesNotification = require("../../images/icons/notification-16.png");
const filt = require("../../images/icons/hamburger-16.png");
const logotext = require("../../images/logotext.png");

type NavBarProps = {
  user: User | null;
  sort: boolean;
  setSort: React.Dispatch<React.SetStateAction<boolean>>;
  filter: boolean;
  setFilter: React.Dispatch<React.SetStateAction<boolean>>;
};

// const Navbar = ({ user }: { user: User | null }) => {
const Navbar = ({ user, sort, setSort, filter, setFilter }: NavBarProps) => {
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterButtonRef = useRef<HTMLAnchorElement>(null);
  const location = useLocation();

  const handleSort = () => {
    setSort(!sort);
    setFilter(false);
  };

  const handleFiltering = () => {
    setSort(false);
    setFilter(!filter);
  };

  useEffect(() => {
    if (filterButtonRef.current) {
      const filterButtonRect = filterButtonRef.current.getBoundingClientRect();
      const filterContentElement = document.querySelector(
        ".filter-content"
      ) as HTMLElement;
      if (filterContentElement) {
        filterContentElement.style.left = `${filterButtonRect.left}px`;
      }
    }
  }, [isFilterOpen]);

  const handleDropdown = () => {
    setIsDropOpen(!isDropOpen);
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const logoutUser = async () => {
    if (user) {
      const response = await loginService.logout(user);
      console.log("REPOSPOS", response);
      localStorage.removeItem("matchaToken");
      window.location.replace("/");
    }
  };

  const showFilterButton = location.pathname === "/feed";

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
          {showFilterButton && (
            <Link
              to="#"
              className="loginlog2"
              onClick={handleFilter}
              ref={filterButtonRef}
            >
              <span>Filters</span>
              <img
                src={isFilterOpen ? closeIcon : filt}
                alt="expand"
                title="show filters"
                className="loginlog2img"
              />
            </Link>
          )}

          {isFilterOpen && (
            <div className="filter-content">
              {user.status && user.status < 3 ? (
                <span style={{ display: "none" }}></span>
              ) : (
                <>
                  <Link
                    to="#"
                    onClick={() => {
                      handleSort();
                      setIsFilterOpen(false);
                    }}
                  >
                    Sort
                  </Link>
                  <Link
                    to="#"
                    onClick={() => {
                      handleFiltering();
                      setIsFilterOpen(false);
                    }}
                  >
                    Filter
                  </Link>
                </>
              )}
            </div>
          )}
          <Link to="#" className="notiflog">
            <img src={noNotification} alt="noNotifs" className="notif" />
          </Link>
          <Link to="#" className="loginlog" onClick={handleDropdown}>
            <span>{user.username} </span>
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
                  <Link to="/matches" onClick={() => setIsDropOpen(false)}>
                    Matches
                  </Link>
                  <Link to="/feed" onClick={() => setIsDropOpen(false)}>
                    Feed
                  </Link>

                  <hr />
                  <Link to="/me" onClick={() => setIsDropOpen(false)}>
                    My Profile
                  </Link>
                  <Link to="/settings" onClick={() => setIsDropOpen(false)}>
                    Settings
                  </Link>
                  <hr />
                  <Link to="/stalkers" onClick={() => setIsDropOpen(false)}>
                    Your Stalkers
                  </Link>
                  <Link to="/wholiked" onClick={() => setIsDropOpen(false)}>
                    Who Liked You
                  </Link>
                  <Link to="/looked" onClick={() => setIsDropOpen(false)}>
                    Visited Profiles
                  </Link>
                  <Link to="/liked" onClick={() => setIsDropOpen(false)}>
                    Liked Profiles
                  </Link>
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
