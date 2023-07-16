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
import { User } from "./types";
import { useEffect, useState } from "react";
import RegisterTwo from "./components/user/RegisterTwo";
import NewPw from "./components/user/NewPw";
import Settings from "./components/Settings";
import UserCard from "./components/UserCard";

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState("");
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  useEffect(() => {
    userService.getAllUsers().then((data: User[]) => {
      if (data) setUsers(data);
    });
  }, []);

  if (users) console.log("USERS", users);

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

  return (
    <Router>
      <main>
        <Navbar user={loggedUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:code/verify" element={<Verify />} />
          <Route path="/:code/forgot" element={<NewPw />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/login" element={<Login />} />
          {/* <PrivateRoute path="/feed" element={<Feed user={loggedUser} />} /> */}
          {/* <Route path="/feed" element={<Feed token={token} />} /> */}
          {/* <Route
            path="/feed"
            element={<PrivateRoute element={<Feed user={loggedUser} />} />}
          /> */}
          <Route
            path="/feed"
            element={<PrivateRoute element={<Feed user={loggedUser} />} />}
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
            element={<PrivateRoute element={<UserCard user={loggedUser} />} />}
          />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
};

export default App;
