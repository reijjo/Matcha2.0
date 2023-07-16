import { useEffect, useState } from "react";
import { Images, Profile, User } from "../types";
import { useParams } from "react-router-dom";
import profileService from "../services/profileService";
import imageService from "../services/imageService";

const UserCard = ({ user }: { user: User | null }) => {
  const [profile, setProfile] = useState<Profile>();
  const [images, setImages] = useState<Images[]>([]);
  const [avatar, setAvatar] = useState<Images>();

  const [bigImg, setBigImg] = useState<string | undefined>(avatar?.path);

  const { id } = useParams<string>();

  useEffect(() => {
    if (id) {
      profileService.getProfile(id).then((response) => {
        setProfile(response);
        console.log(response);
      });
      imageService.getImage(id).then((response) => {
        setImages(response);
        console.log("images", response);
      });
      imageService.getAvatar(id).then((response) => {
        setAvatar(response);
        setBigImg(avatar?.path);
        console.log("avatar", response);
      });
    }
  }, [id]);

  if (!profile || !images || !avatar || !user) {
    return <div>Loading profile...</div>;
  }

  const birthDate = new Date(profile.birthday);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  const handleClick = (imagePath: string) => {
    setBigImg(imagePath);
  };

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
            <img
              src={bigImg || avatar.path}
              // src={avatar.path}
              alt="image"
              className="cardImg"
              // style={{ objectFit: "contain" }}
            />
          </div>
        </div>
        <div className="cardInfo">
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
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
                style={{ width: "10vw", height: "10vh" }}
              />
            </div>
            {images.map((img) => (
              <div
                key={img.id}
                style={{ border: "1px solid black", display: "flex" }}
                onClick={() => handleClick(img.path)}
              >
                {" "}
                <img
                  src={img.path}
                  alt="userimage"
                  style={{ width: "10vw", height: "10vh" }}
                />
              </div>
            ))}
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
        <div className="cardInfo">
          <div>First Name:</div> <div>{profile.firstname}</div>
          <div>Last Name:</div> <div>{profile.lastname}</div>
          <div>About me:</div> <div>{profile.bio}</div>
        </div>

        <div
          className="cardButtons"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <button className="matchButton">Match</button>
          <button className="passButton">Pass</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
