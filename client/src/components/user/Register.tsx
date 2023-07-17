import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import Notify from "../common/Notify";
import { Notification } from "../../utils/types";
import userService from "../../services/userService";

const Register = () => {
  const [username, setUsername] = useState("");
  const [usernameLenFocus, setUsernameLenFocus] = useState(false);
  const [usernameLenMsg, setUsernameLenMsg] = useState<null | string>(null);
  const [usernameValidFocus, setUsernameValidFocus] = useState(false);
  const [usernameValidMsg, setUsernameValidMsg] = useState<null | string>(null);

  const [email, setEmail] = useState("");

  const [firstname, setFirstname] = useState("");
  const [firstnameLenFocus, setFirstnameLenFocus] = useState(false);
  const [firstnameLenMsg, setFirstnameLenMsg] = useState<null | string>(null);
  const [firstnameValidFocus, setFirstnameValidFocus] = useState(false);
  const [firstnameValidMsg, setFirstnameValidMsg] = useState<null | string>(
    null
  );

  const [lastname, setLastname] = useState("");
  const [lastnameLenFocus, setLastnameLenFocus] = useState(false);
  const [lastnameLenMsg, setLastnameLenMsg] = useState<null | string>(null);
  const [lastnameValidFocus, setLastnameValidFocus] = useState(false);
  const [lastnameValidMsg, setLastnameValidMsg] = useState<null | string>(null);

  const [date, setDate] = useState("");
  const [dateFocus, setDateFocus] = useState(false);
  const [dateMsg, setDateMsg] = useState<null | string>(null);

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

  // useEffect(() => {
  //   setNotification({
  //     message: "hihuu",
  //     style: { color: "red" },
  //   } as Notification);
  // }, []);

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const nameRegex = /^[a-zA-Z0-9!._\-@#*$]+$/;
    setUsername(value);

    if (value.length < 3 || value.length > 30) {
      setUsernameLenMsg("3-30 characters.");
    } else {
      setUsernameLenMsg(null);
    }

    if (!nameRegex.test(value)) {
      setUsernameValidMsg("Only letters, numbers and characters (!._-@#*$)");
    } else {
      setUsernameValidMsg(null);
    }
    // console.log("username", value);
  };

  const handleFirstname = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const nameRegex = /^[a-zA-Z-]+$/;
    setFirstname(value);

    if (value.length < 2 || value.length > 15) {
      setFirstnameLenMsg("2 - 15 characters.");
    } else {
      setFirstnameLenMsg(null);
    }

    if (!nameRegex.test(value)) {
      setFirstnameValidMsg("Only letters and '-' allowed.");
    } else {
      setFirstnameValidMsg(null);
    }
  };

  const handleLastname = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const nameRegex = /^[a-zA-Z-]+$/;
    setLastname(value);

    if (value.length < 2 || value.length > 30) {
      setLastnameLenMsg("2 - 30 characters.");
    } else {
      setLastnameLenMsg(null);
    }

    if (!nameRegex.test(value)) {
      setLastnameValidMsg("Only characters and '-' allowed");
    } else {
      setLastnameValidMsg(null);
    }
  };

  const handleDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDate(value);

    const selectedDate = new Date(event.target.value);
    const enuffAge = new Date();

    enuffAge.setFullYear(enuffAge.getFullYear() - 18);

    if (selectedDate > enuffAge) {
      setDateMsg("Only for ages 18+.");
    } else {
      setDateMsg(null);
    }
  };

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

  const registerUser = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const user = {
        username: username,
        email: email,
        firstname: firstname,
        lastname: lastname,
        birthday: date,
        password: password,
        confPassword: confPassword,
      };
      const res = await userService.regUser(user);
      console.log("Reg User", res);
      setNotification(res.notification);
      setTimeout(() => {
        setNotification({ message: "", style: {}, success: false });
      }, 10000);
    } catch (error: unknown) {
      console.log("Error", error);
    }
  };

  return (
    <div id="register">
      <div className="overlay" />
      <form className="registerForm" onSubmit={registerUser}>
        <div style={{ textAlign: "left", width: "100%", marginBottom: "1vh" }}>
          <strong style={{ fontSize: "3vh" }}>Register</strong>
        </div>
        <div className="grid-container">
          <Notify {...notification} />
          {/* USERNAME */}
          <div>Username</div>
          <input
            type="text"
            placeholder="Username..."
            autoComplete="off"
            required={true}
            value={username}
            name="username"
            onChange={handleUsername}
            onFocus={() => {
              setUsernameLenFocus(true);
              setUsernameValidFocus(true);
            }}
            onBlur={() => {
              setUsernameLenFocus(false);
              setUsernameValidFocus(false);
            }}
          />
          {usernameLenFocus && usernameLenMsg && (
            <div className="regmsg">
              <li>{usernameLenMsg}</li>
            </div>
          )}
          {usernameValidFocus && usernameValidMsg && (
            <div className="regmsg">
              <li>{usernameValidMsg}</li>
            </div>
          )}
          {/* EMAIL */}
          <div>Email</div>
          <input
            type="email"
            placeholder="Email..."
            autoComplete="off"
            required={true}
            value={email}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
          />
          {/* FIRST NAME */}
          <div>First Name</div>
          <input
            type="text"
            placeholder="First Name..."
            autoComplete="off"
            required={true}
            value={firstname}
            onChange={handleFirstname}
            name="firstname"
            onFocus={() => {
              setFirstnameLenFocus(true);
              setFirstnameValidFocus(true);
            }}
            onBlur={() => {
              setFirstnameLenFocus(false);
              setFirstnameValidFocus(false);
            }}
          />
          {firstnameLenFocus && firstnameLenMsg && (
            <div className="regmsg">
              <li>{firstnameLenMsg}</li>
            </div>
          )}
          {firstnameValidFocus && firstnameValidMsg && (
            <div className="regmsg">
              <li>{firstnameValidMsg}</li>
            </div>
          )}
          {/* LAST NAME */}
          <div>Last Name</div>
          <input
            type="text"
            placeholder="Last Name..."
            autoComplete="off"
            required={true}
            value={lastname}
            name="lastname"
            onChange={handleLastname}
            onFocus={() => {
              setLastnameLenFocus(true);
              setLastnameValidFocus(true);
            }}
            onBlur={() => {
              setLastnameLenFocus(false);
              setLastnameValidFocus(false);
            }}
          />
          {lastnameLenFocus && lastnameLenMsg && (
            <div className="regmsg">
              <li>{lastnameLenMsg}</li>
            </div>
          )}
          {lastnameValidFocus && lastnameValidMsg && (
            <div className="regmsg">
              <li>{lastnameValidMsg}</li>
            </div>
          )}
          {/* DATE OF BIRTH */}
          <div>Date Of Birth</div>
          <input
            type="date"
            required={true}
            value={date}
            name="date"
            onChange={handleDate}
            onFocus={() => {
              setDateFocus(true);
            }}
            onBlur={() => {
              setDateFocus(false);
            }}
          />
          {dateFocus && dateMsg && (
            <div className="regmsg">
              <li>{dateMsg}</li>
            </div>
          )}
          {/* PASSWORDS */}
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
            Register
          </button>
        </div>
        <div style={{ marginTop: "1vh" }}>
          Already have an account?{" "}
          <Link
            style={{
              textDecoration: "none",
              color: "var(--dapurple)",
              fontWeight: "bold",
            }}
            to="/login"
          >
            Log in!
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
