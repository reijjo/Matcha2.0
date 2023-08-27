import profileService from "../services/profileService";
import imageService from "../services/imageService";
import { Images, User, Profile } from "../utils/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { calcCoordsDistance } from "../utils/utils";

const Matches = ({ user }: { user: User | null }) => {
  const [matches, setMatches] = useState<User[]>();
  const [images, setImages] = useState<Images[]>();
  const [myProfile, setMyProfile] = useState<Profile | undefined>();
  const [profile2, setProfile2] = useState<Profile[]>();

  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    if (user) {
      profileService.getMatches(String(user.id)).then((response) => {
        setMatches(response.matches);
        setProfile2(response.matchesCoors);
      });
      imageService.getAll().then((response) => {
        setImages(response);
      });
      profileService.getProfile(String(user.id)).then((response) => {
        setMyProfile(response);
      });
    }
  }, []);

  const profilesWithImages = matches?.map((profile) => {
    console.log("profile", profile);
    const image = images?.find(
      (img) => img.user_id === profile.id && img.avatar
    );
    const coordinates = profile2?.find(
      (coor) => coor.user_id === profile.id && coor.coordinates
    );
    return {
      ...profile,
      image,
      coordinates,
    };
  });

  // console.log("lwholiked", whoLiked);
  // console.log("lookedCoors", profile2);
  // console.log("images", images);
  // console.log("myprofile", myProfile);

  if (!profilesWithImages || !myProfile) {
    return <div>Loading...</div>;
  }

  const startChat = () => {
    window.location.replace("/chat");
  };

  return (
    <div id="feed">
      <div className="overlaydark" />
      <div className="likedCard">
        <div className="cardHeader">
          <b style={{ fontSize: "larger" }}>Matches:</b>
        </div>
        <div className="smallCardList">
          {profilesWithImages.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              className="profileLink"
            >
              <div style={{ padding: "0.5vh 1vw" }}>{user.username}</div>
              <div style={{ flexGrow: "5" }}>
                <img
                  src={user.image?.path}
                  alt="asd"
                  className="cardImage"
                  style={{ height: "30vh", objectFit: "cover" }}
                />
              </div>
              <div>
                <button
                  className="loginlog"
                  onClick={startChat}
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                  style={{
                    backgroundColor: isHover ? "#634cab" : "",
                    color: isHover ? "#ffcda2" : "",
                  }}
                >
                  {/* <Link
                    to="/chat"
                    style={{ textDecoration: "none", color: "inherit" }}
                  > */}
                  Chat?
                  {/* </Link> */}
                </button>
              </div>
              <div style={{ padding: "0.5vh 1vw" }}>
                {user.coordinates
                  ? calcCoordsDistance(
                      myProfile?.coordinates,
                      user.coordinates?.coordinates
                    )
                  : "N / A"}{" "}
                km away.
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;
