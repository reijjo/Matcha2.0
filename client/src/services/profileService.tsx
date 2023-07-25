import axios from "axios";
import { User } from "../utils/types";

const baseUrl = "http://localhost:3001/api/profiles";

const getAllProfiles = (user: User, limit: number, offset: number) => {
  // return axios
  //   .get<Profile[]>(baseUrl)
  //   .then((response: { data: Profile[] }) => response.data);
  // const req = axios.get(baseUrl, {
  //   params: { user, limit, offset },
  // });
  const req = axios.get(`${baseUrl}?limit=${limit}&offset=${offset}`, {
    params: user,
  });
  return req.then((response) => response.data);
};

const getProfile = (id: string) => {
  const req = axios.get(`${baseUrl}/profile/${id}`);
  return req.then((response) => response.data);
};

const getStalked = (id: string) => {
  const params = { id };
  const req = axios.get(`${baseUrl}/me`, { params });
  return req.then((response) => response.data);
};

const addStalked = (id: string, userId: string) => {
  console.log("axsio", id, userId);
  const req = axios.post(`${baseUrl}/profile/${id}`, { userId: userId });
  return req.then((response) => response.data);
};

const addPassed = (id: string, userId: string) => {
  console.log("axsio PASSED", id, userId);
  const req = axios.post(`${baseUrl}/profile/${id}/pass`, { userId: userId });
  return req.then((response) => response.data);
};

const getPassed = (userId: string) => {
  const req = axios.get(`${baseUrl}/profile/${userId}/pass`);
  return req.then((response) => response.data);
};

const addLiked = (id: string, userId: string) => {
  console.log("axsio LIKED", id, userId);
  const req = axios.post(`${baseUrl}/profile/${id}/like`, { userId: userId });
  return req.then((response) => response.data);
};

const getLiked = (userId: string) => {
  const req = axios.get(`${baseUrl}/profile/${userId}/like`);
  return req.then((response) => response.data);
};

const profileService = {
  getAllProfiles,
  getProfile,
  getStalked,
  addStalked,
  addPassed,
  getPassed,
  addLiked,
  getLiked,
};

export default profileService;
