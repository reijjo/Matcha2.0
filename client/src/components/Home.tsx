import { Link } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logo = require("../images/logotext.png");

const Home = () => {
  return (
    <div id="home">
      <div className="overlay" />
      <div className="hometext">
        {/* <h1>Matcha!</h1> */}
        <div className="logo-container">
          <img src={logo} alt="logotext" title="matcha" />
        </div>
        <h3>
          The place where you are going to find your future husband / wife.
        </h3>
        <Link to="/register" className="regbutton">
          <div>Register Here!</div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
