import { Link } from "react-router-dom";
import { Coordinates, Images, Profile } from "../utils/types";
import { calcCoordsDistance, formatTimeStamp } from "../utils/utils";
import profileService from "../services/profileService";

interface Props {
  profile: Profile;
  image?: Images;
  myCoordinates: Coordinates | undefined;
  myId: number;
  onPass: () => void;
  onLike: () => void;
}

const BigCard = ({
  profile,
  image,
  myCoordinates,
  myId,
  onPass,
  onLike,
}: Props) => {
  const birthDate = new Date(profile.birthday);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  const like = (id: number, myId: number) => {
    profileService.addLiked(String(id), String(myId));
    console.log("MYID", myId);
    console.log("Like userId", id);
    onLike();
  };

  const pass = (id: number, myId: number) => {
    profileService.addPassed(String(id), String(myId));
    console.log("MYID", myId);
    console.log("Pass userId", id);
    onPass();
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
        <div>Online:</div>{" "}
        <div>
          {profile.isonline !== undefined && profile.isonline === true ? (
            <span className="blink_me"></span>
          ) : (
            formatTimeStamp(profile.online)
          )}
        </div>
      </div>
      <div
        className="cardButtons"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <button
          className="matchButton"
          onClick={() => like(profile.user_id, myId)}
        >
          Like
        </button>
        <button
          className="passButton"
          onClick={() => pass(profile.user_id, myId)}
        >
          Pass
        </button>
      </div>
    </div>
  );
};

export default BigCard;
