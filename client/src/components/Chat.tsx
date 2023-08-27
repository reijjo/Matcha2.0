/* eslint-disable @typescript-eslint/no-var-requires */
import { User } from "../utils/types";
import { SyntheticEvent, useState } from "react";

const sendIcon = require("../images/icons/icons-send.png");
const photo = require("../images/testi.jpeg");

const Chat = ({ user }: { user: User | null }) => {
  const [msg, setMsg] = useState("");

  const handleMsg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMsg(value);
  };

  const sendMsg = (event: SyntheticEvent) => {
    event.preventDefault();
    console.log("jeee", msg);
    setMsg("");
  };

  console.log("CHAT USER", user);

  return (
    <div id="feed">
      <div className="overlaydark" />
      <div id="chat">
        <div className="chatContainer">
          <div className="chatNames">
            <div className="chatMatch">
              <div className="matchImg">
                <img src={photo} alt="userImg" />
              </div>
              <div className="matchName">Repefdsfsffs</div>
              <div className="matchMsg">
                <span>jeaaaKJSDjk KDJAkjdsaldj jladjkld</span>
              </div>
            </div>
            <div className="chatMatch">Repe</div>
          </div>
          <div className="chatMain">Chat main</div>
          <div className="chatText">
            <div className="textSend">
              <input
                type="text"
                placeholder="Your message..."
                onChange={handleMsg}
                value={msg}
              />
              <button type="button" title="send" onClick={sendMsg}>
                <img src={sendIcon} alt="send" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
