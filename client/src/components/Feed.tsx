import { User } from "../types";
// import { Token } from "../types";

// const Feed = ({ token }: Token) => {
//   console.log("FEED token", token);
//   return <div>{token ? <p>tokenit kunnossa!</p> : <p>oisko tokenii</p>}</div>;
// };

const Feed = ({ user }: { user: User | null }) => {
  console.log("FEED token", user);

  return <div>{user ? <p>tokenit kunnossa!</p> : <p>oisko tokenii</p>}</div>;
};

export default Feed;
