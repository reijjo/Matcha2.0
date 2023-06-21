import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Login from "./components/Login";
import userService from "./services/userService";
import { User } from "./types";
import { useEffect, useState } from "react";

const App = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    userService.getAllUsers().then((data: User[]) => {
      setUsers(data);
    });
  }, []);

  console.log("USERS", users);

  return (
    <Router>
      <main>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
};

export default App;
