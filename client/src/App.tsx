import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Verify from "./components/Verify";
import Login from "./components/Login";
import Feed from "./components/Feed";
import userService from "./services/userService";
import loginService from "./services/loginService";
import { User } from "./types";
import { useEffect, useState } from "react";

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState("");
  const [loggedUser, setLoggedUser] = useState<User[]>([]);

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
        if (logged) {
          setLoggedUser(logged);
        }
      });
    }
  }, []);

  console.log("logged user", loggedUser);

  return (
    <Router>
      <main>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:code/verify" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<Feed token={token} />} />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
};

export default App;
