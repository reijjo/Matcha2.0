import axios from "axios";
import { Login } from "../types";

const baseUrl = "http://localhost:3001/api/login";

const logIn = (user: Login) => {
  console.log("Axios LoginUSer", user);
  const req = axios.post(`${baseUrl}`, user);
  return req.then((response) => response.data);
};

const getUserInfo = (token: string) => {
  const req = axios.get(`${baseUrl}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return req.then((response) => response.data);
};

const loginService = { logIn, getUserInfo };

export default loginService;
