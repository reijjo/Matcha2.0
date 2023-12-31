import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  RouteProps,
} from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Register from "./components/user/Register";
import Verify from "./components/user/Verify";
import Login from "./components/user/Login";
import Feed from "./components/Feed";
import Forgot from "./components/user/Forgot";
import userService from "./services/userService";
import loginService from "./services/loginService";
import { Message, User } from "./utils/types";
import { useEffect, useState } from "react";
import RegisterTwo from "./components/user/RegisterTwo";
import NewPw from "./components/user/NewPw";
import Settings from "./components/Settings";
import UserCard from "./components/UserCard";
import MyCard from "./components/MyCard";
import Stalkers from "./components/Stalkers";
import Looked from "./components/Looked";
import Liked from "./components/Liked";
import WhoLiked from "./components/WhoLiked";
import Matches from "./components/Matches";
import { io, Socket } from "socket.io-client";
import Chat from "./components/Chat";

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState("");
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [sort, setSort] = useState(false);
  const [filters, setFilters] = useState(false);
  // const [gotNotif, setGotNotif] = useState(false);
  const [socketNotif, setSocketNotif] = useState<string[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const socket1 = io("http://localhost:3001");
    setSocket(socket1);

    if (loggedUser && !socketConnected) {
      socket1.connect();
      socket1.on("connect", () => {
        socket1.emit("user_connected", loggedUser.id);
        setSocketConnected(true);
      });

      socket1.on("notification", (room: string, notification: string) => {
        // setSocketNotif(notification)
        console.log("Recieved notification APPTSX", room, notification);
      });

      socket1.on("message", (room: string, message: Message) => {
        console.log("GOT MESSAGE", message, "TO ROOM", room);
      });
    }

    return () => {
      if (socket1.connected) {
        socket1.disconnect();
        setSocketConnected(false);
      }
    };
  }, [loggedUser]);

  console.log("GOT NOTIIIF", socketNotif);
  console.log("SOCKET ROOMS??", socket);

  useEffect(() => {
    userService.getAllUsers().then((data: User[]) => {
      if (data) setUsers(data);
    });
  }, []);

  console.log("SOCKET CONNECTED", socketConnected);

  // if (users) console.log("USERS", users);

  useEffect(() => {
    const getToken: string = localStorage.getItem("matchaToken") || "";
    if (getToken) {
      setToken(getToken);
      loginService.getUserInfo(getToken).then((logged) => {
        if (logged.error) {
          console.log("logged", logged.error);
          // window.location.replace("/login");
        } else {
          setLoggedUser(logged);
        }
      });
    }
  }, [token]);

  // console.log("TOken", token);

  const PrivateRoute = ({ element }: RouteProps) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await loginService.getUserInfo(token);
          if (!response.error) {
            setAuthenticated(true);
          }
        } catch (error) {
          console.log("ERROR: ", error);
        } finally {
          setLoading(false);
        }
      };
      if (token) {
        checkAuth();
      } else {
        setLoading(false);
      }
    }, [token]);

    if (loading) {
      return <p>Loading...</p>;
    }

    return authenticated ? (
      // <Route {...rest} element={element} />
      <>{element}</>
    ) : (
      // <Route {...rest}>{element}</Route>
      <Navigate to="/login" />
    );
  };

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <main>
        <Navbar
          user={loggedUser}
          sort={sort}
          setSort={setSort}
          filter={filters}
          setFilter={setFilters}
          socket={socket}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:code/verify" element={<Verify />} />
          <Route path="/:code/forgot" element={<NewPw />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/feed"
            element={
              <PrivateRoute
                element={
                  <Feed
                    user={loggedUser}
                    sort={sort}
                    setSort={setSort}
                    filter={filters}
                    setFilter={setFilters}
                  />
                }
              />
            }
          />
          <Route
            path="/registerTwo"
            element={
              <PrivateRoute element={<RegisterTwo user={loggedUser} />} />
            }
          />
          <Route
            path="/settings"
            element={<PrivateRoute element={<Settings user={loggedUser} />} />}
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute
                element={<UserCard user={loggedUser} socket={socket} />}
              />
            }
          />
          <Route
            path="/me"
            element={<PrivateRoute element={<MyCard user={loggedUser} />} />}
          />
          <Route
            path="/looked"
            element={<PrivateRoute element={<Looked user={loggedUser} />} />}
          />
          <Route
            path="/stalkers"
            element={<PrivateRoute element={<Stalkers user={loggedUser} />} />}
          />
          <Route
            path="/liked"
            element={<PrivateRoute element={<Liked user={loggedUser} />} />}
          />
          <Route
            path="/wholiked"
            element={<PrivateRoute element={<WhoLiked user={loggedUser} />} />}
          />
          <Route
            path="/matches"
            element={<PrivateRoute element={<Matches user={loggedUser} />} />}
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute
                element={<Chat user={loggedUser} socket={socket} />}
              />
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>

        <Footer />
      </main>
    </Router>
  );
};

export default App;
