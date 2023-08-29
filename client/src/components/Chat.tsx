/* eslint-disable @typescript-eslint/no-var-requires */
import chatService from "../services/chatService";
import imageService from "../services/imageService";
import profileService from "../services/profileService";
import { User, Images, Message } from "../utils/types";
import { useEffect, useState, useRef } from "react";

const sendIcon = require("../images/icons/icons-send.png");
const photo = require("../images/testi.jpeg");

const Chat = ({ user }: { user: User | null }) => {
  const [msg, setMsg] = useState("");
  const [matches, setMatches] = useState<User[]>([]);
  const [images, setImages] = useState<Images[]>();
  const [chat, setChat] = useState<number>();
  const [getMessages, setGetMessages] = useState<Message[]>([]);
  const [getChat, setGetChat] = useState<{
    chat: Message[];
    myName: User;
    otherName: User;
  }>({
    chat: [],
    myName: {} as User,
    otherName: {} as User,
  });

  const chatMainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getMatches = async () => {
      try {
        const myMatches = await profileService.getMatches(String(user?.id));
        setMatches(myMatches.matches);
      } catch (error) {
        console.log("Error getting matches", error);
      }
    };

    const getImages = async () => {
      const allImg = await imageService.getAll();
      setImages(allImg);
    };

    const getMessages = async () => {
      const allChat = await chatService.getAllMessages();
      setGetMessages(allChat);
    };

    if (user?.id !== undefined) {
      getMatches();
      getImages();
      getMessages();
    }
  }, [user?.id]);

  useEffect(() => {
    if (chatMainRef.current) {
      chatMainRef.current.scrollTop = chatMainRef.current.scrollHeight;
    }
  }, [getChat]);

  const withImages = matches.map((mtch) => {
    const avatar = images?.find((ava) => {
      return mtch.id === ava.user_id && ava.avatar === true;
    });
    return {
      ...mtch,
      avatar,
    };
  });

  const handleMsg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMsg(value);
  };

  const sendMsg = async (me: number, other: number, message: string) => {
    // event.preventDefault();
    // const addToChat = await
    chatService.addChat(me, other, message);
    // console.log("ADD TO CHAT???", addToChat);
    console.log("jeee", msg);
    console.log("CHAT PARTNER", chat);
    setMsg("");
  };

  const startChat = async (me: number, other: number) => {
    setChat(other);
    const chatmsg = await chatService.getChat(me, other);
    setGetChat(chatmsg);
    console.log("extra", chatmsg);
  };

  // console.log("CHAT USER", user);
  console.log(
    "MY MATCHES",
    matches.map((who) => who)
  );
  // console.log("IMAMGES", images);
  console.log("MEssages", getMessages);
  // console.log("WHO AM I CHATTING WITH", chat);
  console.log("getCHAT", getChat);

  if (!withImages) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div id="feed">
      <div className="overlaydark" />
      <div id="chat">
        <div className="chatContainer">
          {/* CHAT NAMES */}
          <div className="chatNames">
            {/* <div
              className="chatMatch"
              onClick={() => setChat(user?.id || undefined)}
            >
              <div className="matchImg">
                <img src={photo} alt="userImg" />
              </div>
              <div className="matchName">Repefdsfsffs</div>
              <div className="matchMsg">
                <span>jeaaaKJSDjk KDJAkjdsaldj jladjkld</span>
              </div>
            </div> */}
            {withImages.map((mtch) => (
              <div
                key={mtch.id}
                className="chatMatch"
                onClick={() => startChat(Number(user?.id), Number(mtch.id))}
              >
                <div className="matchImg">
                  <img src={mtch.avatar?.path || sendIcon} alt="userImg" />
                </div>
                <div className="matchName">{mtch.username}</div>
                <div className="matchMsg">
                  <span>jeaaaKJSDjk KDJAkjdsaldj jladjkld</span>
                </div>
              </div>
            ))}
          </div>

          {/* MAIN CHAT */}
          <div className="chatMain" ref={chatMainRef}>
            {!chat ? (
              <div className="startChatting">Who you want to chat with...?</div>
            ) : (
              <div className="chatMessagesContainer">
                {getChat.chat.some(
                  (message) =>
                    (message.to_id === chat &&
                      message.sender_id === user?.id) ||
                    (message.to_id === user?.id && message.sender_id === chat)
                ) ? (
                  <div className="chatMessages">
                    {getChat.chat.map((message) => (
                      <div
                        key={message.id}
                        className={`message ${
                          message.sender_id === user?.id
                            ? "my-message"
                            : "other-message"
                        }`}
                      >
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <div className="messageSender">
                            {message.sender_id === user?.id
                              ? "Me:"
                              : `${getChat.otherName.username}:`}
                          </div>
                          <div className="messageContent">
                            {message.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="startChatting">
                    Send a message to {getChat.otherName.username} already.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MESSAGE BOX */}
          <div className="chatText">
            <div className="textSend">
              <input
                type="text"
                placeholder="Your message..."
                onChange={handleMsg}
                value={msg}
                disabled={!chat}
              />
              <button
                type="button"
                title="send"
                onClick={() =>
                  sendMsg(Number(user?.id), Number(chat), String(msg))
                }
                hidden={!chat}
              >
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
