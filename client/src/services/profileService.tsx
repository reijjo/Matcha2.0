import axios from "axios";
import { User } from "../types";

const baseUrl = "http://localhost:3001/api/profiles";

const getAllProfiles = (user: User) => {
  // return axios
  //   .get<Profile[]>(baseUrl)
  //   .then((response: { data: Profile[] }) => response.data);
  const req = axios.get(baseUrl, {
    params: user,
  });
  return req.then((response) => response.data);
};

const profileService = { getAllProfiles };

export default profileService;
