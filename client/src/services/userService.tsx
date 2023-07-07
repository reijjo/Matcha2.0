import axios from "axios";
import { Coordinates, User } from "../types";

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

const verifyUser = (code: string) => {
  const req = axios.get(`${baseUrl}/${code}/verify`);
  return req.then((response) => response.data);
};

const getIpApi = () => {
  const req = axios.get(`${baseUrl}/ipapi`);
  return req.then((response) => response.data);
};

const openCage = (coors: Coordinates) => {
  const req = axios.get(`${baseUrl}/opencage`, {
    params: coors,
  });
  return req.then((response) => response.data.results[0].components);
  console.log("Axios coors", coors);
};

const userService = { getAllUsers, regUser, verifyUser, getIpApi, openCage };

export default userService;
