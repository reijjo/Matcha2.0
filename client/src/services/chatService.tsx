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

const addChat = (me: number, other: number, message: string) => {
  console.log("AXIOS", me, other, message);
  const req = axios.post(`${baseUrl}/${other}?me=${me}`, { message });
  return req.then((response) => response.data);
};

const checkOnline = (other: number) => {
  const req = axios.get(`${baseUrl}/${other}/online`);
  return req.then((response) => response.data);
};

const addNotif = (me: number, other: number, message: string) => {
  const req = axios.post(`${baseUrl}/${other}/notif?me=${me}`, { message });
  return req.then((response) => response.data);
};

const chatService = {
  getAllMessages,
  getChat,
  addChat,
  checkOnline,
  addNotif,
};

export default chatService;
