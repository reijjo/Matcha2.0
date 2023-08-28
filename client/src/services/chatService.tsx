import axios from "axios";
// import { User } from "../utils/types";

const baseUrl = "http://localhost:3001/api/chat";

const getAllMessages = () => {
  const req = axios.get(`${baseUrl}`);
  return req.then((response) => response.data);
};

const getChat = (me: number, other: number) => {
  console.log("ME", me, "OTHER", other);
  const req = axios.get(`${baseUrl}/${other}?me=${me}`);
  return req.then((response) => response.data);
};

const chatService = {
  getAllMessages,
  getChat,
};

export default chatService;
