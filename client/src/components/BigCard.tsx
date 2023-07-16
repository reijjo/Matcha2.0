import { Link } from "react-router-dom";
import { Images, Profile } from "../types";

interface Props {
  profile: Profile;
  image?: Images;
}

const BigCard = ({ profile, image }: Props) => {
  const birthDate = new Date(profile.birthday);
  const age = new Date().getFullYear() - birthDate.getFullYear();

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
        <div>Distance:</div> <div> </div>
        <div>Tags:</div> <div> {profile.tags.join(", ")}</div>
        <div>Fame:</div> <div> {profile.fame}</div>
        <div>Online:</div> <div> </div>
      </div>
      <div
        className="cardButtons"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <button className="matchButton">Match</button>
        <button className="passButton">Pass</button>
      </div>
    </div>
  );
};

export default BigCard;
