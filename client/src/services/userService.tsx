import axios from "axios";
import { User } from "../types";

const baseUrl = "http://localhost:3001/api/users";

const getAllUsers = () => {
  return axios
    .get<User[]>(baseUrl)
    .then((response: { data: User[] }) => response.data);
};

const userService = { getAllUsers };

export default userService;
