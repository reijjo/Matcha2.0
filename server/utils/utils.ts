import { JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
  username: string;
}

const isUserPayload = (token: unknown): token is UserPayload => {
  return typeof token === "object" && token !== null && "username" in token;
};

const parseDecodedToken = (token: unknown): UserPayload => {
  if (!isUserPayload(token)) {
    throw new Error("Invalid token payload");
  }

  return token;
};

export default parseDecodedToken;
