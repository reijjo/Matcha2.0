import { SyntheticEvent, useState } from "react";
import Notify from "../common/Notify";
import { Notification } from "../../types";
import userService from "../../services/userService";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState<Notification>({
    message: "",
    style: {},
    success: false,
  });

  const sendMail = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const send = {
        email: email,
      };

      const sending = await userService.forgotPw(send);
      setNotification(sending.notification);
      console.log("SENDIIING", sending);
      setTimeout(() => {
        setNotification({ message: "", style: {}, success: false });
      }, 5000);
    } catch (error: unknown) {
      console.log("WHat the hell with the email??");
    }
    console.log("email", email);
  };

  return (
    <div id="register">
      <div className="overlay" />
      <form className="registerForm" onSubmit={sendMail}>
        <div style={{ textAlign: "left", width: "100%", marginBottom: "1vh" }}>
          <strong style={{ fontSize: "3vh" }}>Forgot your password?</strong>
        </div>
        <div className="grid-container">
          <div style={{ margin: "1vh", gridColumn: "1 / span 2" }}>
            No worries! Just enter your email.
          </div>
          <Notify {...notification} />
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
          <button className="regformbutton" type="submit">
            Send!
          </button>
        </div>
      </form>
    </div>
  );
};

export default Forgot;
