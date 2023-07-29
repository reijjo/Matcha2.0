import axios, { AxiosError } from "axios";
import { Login, User } from "../utils/types";

const baseUrl = "http://localhost:3001/api/login";

const logIn = (user: Login) => {
  console.log("Axios LoginUSer", user);
  const req = axios.post(`${baseUrl}`, user);
  return req.then((response) => response.data);
};

const getUserInfo = async (token: string) => {
  try {
    const response = await axios.get(`${baseUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (
      // (error as AxiosError).response &&
      (error as AxiosError)?.response?.status === 401
    ) {
      // Handle unauthorized error
      console.log("Unauthorized");
      return { error: "Unahtorized" };
      // You can redirect the user to the login page or perform any other action here
    } else {
      // Handle other errors
      console.log("Error:", (error as Error).message);
    }
    throw error;
  }
};

const logout = async (user: User) => {
  console.log("axios user", user.id);
  const req = axios.put(`${baseUrl}/logout`, { userId: user.id });
  return req.then((response) => response);
};

const loginService = { logIn, getUserInfo, logout };

export default loginService;
