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
};

const finishRegister = (stuff: object) => {
  const req = axios.post(`${baseUrl}/regTwo`, stuff);
  return req.then((response) => response.data);
};

const forgotPw = (email: object) => {
  console.log("AXIOS EMAIL", email);
  const req = axios.post(`${baseUrl}/forgot`, email);
  return req.then((response) => response.data);
};

const changePw = (code: string, newPw: object) => {
  const req = axios.post(`${baseUrl}/${code}/forgot`, newPw);
  return req.then((response) => response.data);
};

const userService = {
  getAllUsers,
  regUser,
  verifyUser,
  getIpApi,
  openCage,
  finishRegister,
  forgotPw,
  changePw,
};

export default userService;
