import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div id="home">
      <div className="overlay" />
      <div className="hometext">
        <h1>Matcha!</h1>
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
