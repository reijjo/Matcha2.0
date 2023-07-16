import axios from "axios";
import { User } from "../types";

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

const profileService = { getAllProfiles, getProfile };

export default profileService;
