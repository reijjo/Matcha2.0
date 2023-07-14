import { useEffect } from "react";
import { User } from "../types";
// import { Token } from "../types";

// const Feed = ({ token }: Token) => {
//   console.log("FEED token", token);
//   return <div>{token ? <p>tokenit kunnossa!</p> : <p>oisko tokenii</p>}</div>;
// };

const Feed = ({ user }: { user: User | null }) => {
  useEffect(() => {
    if (user && user.status && user.status < 3) {
      window.location.replace("/registerTwo");
    }
  }, []);
  console.log("FEED token", user);

  return (
    <div>
      {user ? (
        <div id="register">
          <div className="overlay" />
          <div className="registerForm">hei</div>
        </div>
      ) : (
        <p>oisko tokenii</p>
      )}
    </div>
  );
};

export default Feed;
