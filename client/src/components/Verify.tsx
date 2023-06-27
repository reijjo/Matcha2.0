import { useEffect, useState } from "react";
import userService from "../services/userService";
import { User } from "../types";
import { useParams } from "react-router-dom";

const Verify = () => {
  const [user, setUser] = useState<User>();

  const { code } = useParams<string>();

  console.log("code?", code);

  useEffect(() => {
    if (code) {
      userService.verifyUser(code).then((response) => {
        if (response.username) {
          setUser(response);
        }
        console.log("RESP", response);
      });
    }
  }, [code]);

  return (
    <div id="register">
      <div className="overlay" />
      <div className="registerForm">
        <div
          style={{ textAlign: "center", width: "100%", marginBottom: "1vh" }}
        >
          <strong style={{ fontSize: "3vh" }}>Verified?</strong>
        </div>
        {user ? (
          <div className="grid-container">
            <div style={{ gridColumn: "1 / span 2" }}>
              Wohoo! You are succesfully registered to Matcha!
            </div>
            <div>Your Username:</div>
            <div>
              <b>{user.username}</b>
            </div>
            <button
              className="regformbutton"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button>
          </div>
        ) : (
          <div className="grid-container">
            <div>No such username!</div>
            <div>Register yourself!</div>

            <button
              className="regformbutton"
              style={{ gridColumn: "1 / span 2" }}
              onClick={() => (window.location.href = "/register")}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
