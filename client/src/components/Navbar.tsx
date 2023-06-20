import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <div className="leftnav">
        <Link to="/">home</Link>
      </div>
      <div className="rightnav">
        <Link to="/register" className="register">
          Register
        </Link>
        <Link to="login" className="login">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
