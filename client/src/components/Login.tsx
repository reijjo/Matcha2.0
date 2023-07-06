import { SyntheticEvent, useState } from "react";
import { Notification } from "../types";
import Notify from "./Notify";
import loginService from "../services/loginService";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  const [notification, setNotification] = useState<Notification>({
    message: "",
    style: {},
    success: false,
  });
  const [username, setUsername] = useState("");
  const [passwd, setPasswd] = useState("");

  // const navigate = useNavigate();

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUsername(value);
  };

  const handlePasswd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPasswd(value);
  };

  const logMeIn = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const user = {
        username: username,
        password: passwd,
      };
      const res = await loginService.logIn(user);
      console.log("RESP", res);
      setNotification(res.notification);
      if (res.notification.success) {
        localStorage.setItem("matchaToken", res.token);
        setTimeout(() => {
          // navigate("/feed");
          window.location.replace("/feed");
        }, 3000);
      }
      setTimeout(() => {
        setNotification({ message: "", style: {}, success: false });
      }, 10000);
    } catch (error: unknown) {
      console.log("ERROR on login: ", error);
    }
    console.log("WOhoo logged in!");
  };

  return (
    <div id="register">
      <div className="overlay" />
      <form className="registerForm" onSubmit={logMeIn}>
        <div style={{ textAlign: "left", width: "100%", marginBottom: "1vh" }}>
          <strong style={{ fontSize: "3vh" }}>Login</strong>
        </div>
        <div className="grid-container">
          <Notify {...notification} />
          {/* USERNAME */}
          <div>Username</div>
          <input
            type="text"
            name="logUser"
            value={username}
            autoComplete="off"
            onChange={handleUsername}
          />
          <div>Password</div>
          <input
            type="password"
            name="logPasswd"
            value={passwd}
            autoComplete="off"
            onChange={handlePasswd}
          />
          <button className="regformbutton" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
