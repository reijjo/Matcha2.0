import { Link } from "react-router-dom";
import { Coordinates, Images, Profile } from "../utils/types";
import { calcCoordsDistance } from "../utils/utils";

interface Props {
  profile: Profile;
  image?: Images;
  myCoordinates: Coordinates | undefined;
}

const BigCard = ({ profile, image, myCoordinates }: Props) => {
  const birthDate = new Date(profile.birthday);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  const match = (id: number) => {
    console.log("Like userId", id);
  };

  const pass = (id: number) => {
    console.log("Pass userId", id);
  };

  // console.log("Looking this profile", profile);
  // console.log("myCOoords", myCoordinates);

  if (!myCoordinates) {
    return <div>Loading...</div>;
  }

  return (
    <div className="feedCard">
      {/* <div className="feedCard"> */}
      <div className="cardHeader">
        <b style={{ fontSize: "larger" }}>{profile.username}</b>, age {age}
      </div>
      <div className="cardImage">
        <div
          style={{
            border: "1px solid purple",
            height: "100%",
            margin: "0 2vw",
            position: "relative",
          }}
        >
          <Link to={`/profile/${profile.user_id}`}>
            <img
              src={image?.path}
              alt="image"
              className="cardImg"
              // style={{ objectFit: "contain" }}
            />
          </Link>
        </div>
      </div>
      <div className="cardInfo">
        <div>Gender:</div> <div>{profile.gender}</div>
        <div>Location:</div> <div> {profile.location as string} </div>
        <div>Distance:</div>{" "}
        <div>{calcCoordsDistance(myCoordinates, profile.coordinates)} km </div>
        <div>Tags:</div> <div> {profile.tags.join(", ")}</div>
        <div>Fame:</div> <div> {profile.fame}</div>
        <div>Online:</div> <div> </div>
      </div>
      <div
        className="cardButtons"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <button className="matchButton" onClick={() => match(profile.user_id)}>
          Match
        </button>
        <button className="passButton" onClick={() => pass(profile.user_id)}>
          Pass
        </button>
      </div>
    </div>
  );
};

export default BigCard;
