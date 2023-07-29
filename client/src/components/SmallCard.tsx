import { Link } from "react-router-dom";
import { Coordinates, Images, Profile, User } from "../utils/types";
import { calcCoordsDistance } from "../utils/utils";

export interface Extra extends User {
  image: Images;
  coordinates: Coordinates;
}

interface Props {
  user: Extra;
  myProfile: Profile;
}

const SmallCard = ({ user, myProfile }: Props) =>
  // { user, myProfile, calcCoordsDistance }: Props
  {
    return (
      <Link to={`/profile/${user.id}`} className="profileLink">
        {/* <Link key={user.id} to={`/profile/${user.id}`} className="profileLink"> */}
        <div style={{ padding: "0.5vh 1vw" }}>{user.username}</div>
        <div style={{ flexGrow: "5" }}>
          <img
            src={user.image?.path}
            alt="asd"
            className="cardImage"
            style={{
              height: "30vh",
              objectFit: "cover",
            }}
          />
        </div>
        <div style={{ padding: "0.5vh 1vw" }}>
          {user.coordinates
            ? calcCoordsDistance(myProfile?.coordinates, user.coordinates)
            : "N / A"}{" "}
          km away.
        </div>
      </Link>
    );
  };

export default SmallCard;
