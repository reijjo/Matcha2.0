import { useEffect, useState } from "react";
import { Images, Profile, User } from "../utils/types";
import { useParams } from "react-router-dom";
import profileService from "../services/profileService";
import imageService from "../services/imageService";
import { calcCoordsDistance, formatTimeStamp } from "../utils/utils";

const UserCard = ({ user }: { user: User | null }) => {
  const [profile, setProfile] = useState<Profile>();
  const [images, setImages] = useState<Images[]>([]);
  const [avatar, setAvatar] = useState<Images>();

  const [bigImg, setBigImg] = useState<string | undefined>(avatar?.path);
  const [myProfile, setMyProfile] = useState<Profile>();

  const { id } = useParams<string>();

  const like = async (id: number, myId: number) => {
    console.log("MYID", myId);
    console.log("Like userId", id);
    const ready = await profileService.addLiked(String(id), String(myId));
    console.log("ready", ready);
    if (ready) {
      window.location.replace("/feed");
    }
  };

  const pass = async (id: number, myId: number) => {
    console.log("MYID", myId);
    console.log("Like userId", id);
    const ready = await profileService.addPassed(String(id), String(myId));
    console.log("ready", ready);
    if (ready) {
      window.location.replace("/feed");
    }
  };

  useEffect(() => {
    if (id) {
      if (id === String(user?.id)) {
        window.location.replace("/me");
      } else {
        profileService.getProfile(id).then((response) => {
          setProfile(response);
        });
        imageService.getImage(id).then((response) => {
          setImages(response);
        });
        imageService.getAvatar(id).then((response) => {
          setAvatar(response);
          setBigImg(avatar?.path);
        });
        if (user) {
          profileService.getProfile(String(user.id)).then((response) => {
            setMyProfile(response);
          });
          console.log("id, userId", id, String(user.id));
          profileService.addStalked(id, String(user.id)).then((response) => {
            console.log("response", response);
          });
        }
      }
    }
  }, [id]);

  if (!profile || !images || !avatar || !user) {
    return <div>Loading profile...</div>;
  }

  const birthDate = new Date(profile.birthday);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  const distance = myProfile?.coordinates
    ? calcCoordsDistance(myProfile.coordinates, profile.coordinates)
    : undefined;

  const handleClick = (imagePath: string) => {
    setBigImg(imagePath);
  };

  console.log("THIS PROFILE", profile.isonline);

  return (
    <div id="feed">
      <div className="overlaydark" />
      <div className="userCard">
        <div className="cardHeader">
          <b style={{ fontSize: "larger" }}>{profile.username}</b>, age {age}
        </div>
        <div className="usercardImage">
          <div
            style={{
              border: "1px solid purple",
              height: "100%",
              margin: "0 2vw",
              position: "relative",
            }}
          >
            <img src={bigImg || avatar.path} alt="image" className="cardImg" />
          </div>
        </div>
        <div className="cardInfo">
          <div
            style={{
              display: "flex",

              justifyContent: "space-around",
              // display: "grid",
              gridColumn: "1 / span 2",
            }}
          >
            <div
              key={avatar.id}
              style={{ border: "1px solid black", display: "flex" }}
              onClick={() => handleClick(avatar.path)}
            >
              {" "}
              <img
                src={avatar.path}
                alt="userimage"
                style={{ width: "10vw", height: "10vh", maxWidth: "70px" }}
              />
            </div>
            {images.map((img) => (
              <div
                key={img.id}
                style={{
                  border: "1px solid black",
                  display: "grid",
                  maxWidth: "maxContent",
                  // display: "flex",
                  // flexDirection: "column",
                  // flexWrap: "wrap",
                }}
                onClick={() => handleClick(img.path)}
              >
                {" "}
                <img
                  src={img.path}
                  alt="userimage"
                  style={{ width: "10vw", height: "10vh", maxWidth: "70px" }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="cardInfo">
          <div>Gender:</div> <div>{profile.gender}</div>
          <div>Location:</div> <div> {profile.location as string} </div>
          <div>Distance:</div> <div>{distance} km</div>
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
        <div className="cardInfo">
          <div>First Name:</div> <div>{profile.firstname}</div>
          <div>Last Name:</div> <div>{profile.lastname}</div>
          <div>About me:</div> <div>{profile.bio}</div>
        </div>

        <div
          className="cardButtons"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <button
            className="matchButton"
            onClick={() => like(profile.user_id, user.id as number)}
          >
            Like
          </button>
          <button
            className="passButton"
            onClick={() => pass(profile.user_id, user.id as number)}
          >
            Pass
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
