import { Token } from "../types";

const Feed = ({ token }: Token) => {
  console.log("FEED token", token);
  return (
    <div>
      <p>oisko tokenii</p>
    </div>
  );
};

export default Feed;
