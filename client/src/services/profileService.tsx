import axios from "axios";
import { Profile } from "../types";

const baseUrl = "http://localhost:3001/api/profiles";

const getAllProfiles = () => {
  // return axios
  //   .get<Profile[]>(baseUrl)
  //   .then((response: { data: Profile[] }) => response.data);
  const req = axios.get(baseUrl);
  return req.then((response) => response.data);
};

const profileService = { getAllProfiles };

export default profileService;
