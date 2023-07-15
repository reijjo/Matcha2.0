import { SyntheticEvent, useEffect, useState } from "react";
import { User, Notification } from "../../types";
import userService from "../../services/userService";
import { useParams } from "react-router-dom";
import Notify from "../common/Notify";

const NewPw = () => {
  const [user, setUser] = useState<User>();
  const [password, setPassword] = useState("");
  const [pwLenFocus, setPwLenFocus] = useState(false);
  const [pwLenMsg, setPwLenMsg] = useState<null | string>(null);
  const [pwSpecialFocus, setPwSpecialFocus] = useState(false);
  const [pwSpecialMsg, setPwSpecialMsg] = useState<null | string>(null);
  const [pwCapitalFocus, setPwCapitalFocus] = useState(false);
  const [pwCapitalMsg, setPwCapitalMsg] = useState<null | string>(null);
  const [pwNumFocus, setPwNumFocus] = useState(false);
  const [pwNumMsg, setPwNumMsg] = useState<null | string>(null);
  const [confPassword, setConfPassword] = useState("");
  const [confirmPwFocus, setConfirmPwFocus] = useState(false);
  const [confirmPwMsg, setConfirmPwMsg] = useState<null | string>(null);

  const [notification, setNotification] = useState<Notification>({
    message: "",
    style: {},
    success: false,
  });

  const { code } = useParams<{ code: string }>();

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

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);

    if (value.length < 8 || value.length > 30) {
      setPwLenMsg("8-30 characters.");
    } else {
      setPwLenMsg(null);
    }

    if (!/\d/.test(value)) {
      setPwNumMsg("At least one number.");
    } else {
      setPwNumMsg(null);
    }

    if (!/[A-Z]/.test(value)) {
      setPwCapitalMsg("At least one Uppercase letter.");
    } else {
      setPwCapitalMsg(null);
    }

    if (!/[!._\-@#*$]/.test(value)) {
      setPwSpecialMsg("At least one special character (!._-@#*$)");
    } else {
      setPwSpecialMsg(null);
    }
  };

  const handleConfPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setConfPassword(value);

    if (value !== password) {
      setConfirmPwMsg("Passwords doesn't match.");
    } else {
      setConfirmPwMsg(null);
    }
  };

  const newPassword = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const newPw = {
        password: password,
        confPassword: confPassword,
        username: user?.username,
      };

      const res = await userService.changePw(code as string, newPw);
      console.log("Reg User", res);

      setNotification(res.notification);
      setTimeout(() => {
        setNotification({ message: "", style: {}, success: false });
      }, 10000);
    } catch (error: unknown) {
      console.log("Error", error);
    }
    console.log("cooool");
  };

  return (
    <div id="register">
      <div className="overlay" />
      <form className="registerForm" onSubmit={newPassword}>
        <div
          style={{ textAlign: "center", width: "100%", marginBottom: "1vh" }}
        >
          <strong style={{ fontSize: "3vh" }}>Welcome {user?.email}</strong>
        </div>
        {user ? (
          <div className="grid-container">
            <Notify {...notification} />
            <div style={{ gridColumn: "1 / span 2", textAlign: "center" }}>
              Change your password!
            </div>
            <div>Your Username:</div>
            <div>
              <b>{user.username}</b>
            </div>
            <div>Password</div>
            <input
              type="password"
              placeholder="Password..."
              autoComplete="off"
              required={true}
              value={password}
              name="password"
              onChange={handlePasswordChange}
              onFocus={() => {
                setPwLenFocus(true);
                setPwNumFocus(true);
                setPwCapitalFocus(true);
                setPwSpecialFocus(true);
              }}
              onBlur={() => {
                setPwLenFocus(false);
                setPwNumFocus(false);
                setPwCapitalFocus(false);
                setPwSpecialFocus(false);
              }}
            />
            {pwLenFocus && pwLenMsg && (
              <div className="regmsg">
                <li>{pwLenMsg}</li>
              </div>
            )}
            {pwNumFocus && pwNumMsg && (
              <div className="regmsg">
                <li>{pwNumMsg}</li>
              </div>
            )}
            {pwCapitalFocus && pwCapitalMsg && (
              <div className="regmsg">
                <li>{pwCapitalMsg}</li>
              </div>
            )}
            {pwSpecialFocus && pwSpecialMsg && (
              <div className="regmsg">
                <li>{pwSpecialMsg}</li>
              </div>
            )}
            <div>Confirm Password</div>
            <input
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              required={true}
              value={confPassword}
              name="confPassword"
              onChange={handleConfPasswordChange}
              onFocus={() => {
                setConfirmPwFocus(true);
              }}
              onBlur={() => {
                setConfirmPwFocus(false);
              }}
            />
            {confirmPwFocus && confirmPwMsg && (
              <div className="regmsg">
                <li>{confirmPwMsg}</li>
              </div>
            )}
            <button className="regformbutton" type="submit">
              Ok!
            </button>
          </div>
        ) : (
          <div className="grid-container">
            <div>No such username!</div>
            <div>Register yourself!</div>

            <button
              className="regformbutton"
              type="button"
              style={{ gridColumn: "1 / span 2" }}
              onClick={() => (window.location.href = "/register")}
            >
              Register
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewPw;
