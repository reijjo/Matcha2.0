import axios from "axios";
import { User } from "../types";

const baseUrl = "http://localhost:3001/api/users";

const getAllUsers = () => {
  return axios
    .get<User[]>(baseUrl)
    .then((response: { data: User[] }) => response.data);
};

const regUser = (user: User) => {
  console.log("Axios user", user);
  const req = axios.post(`${baseUrl}`, user);
  return req.then((response) => response.data);
};

const userService = { getAllUsers, regUser };

export default userService;
