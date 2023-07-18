/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { Images, Profile, User } from "../utils/types";
import profileService from "../services/profileService";
import imageService from "../services/imageService";
import { Link } from "react-router-dom";

const MyCard = ({ user }: { user: User | null }) => {
  const [profile, setProfile] = useState<Profile>();
  const [images, setImages] = useState<Images[]>([]);
  const [avatar, setAvatar] = useState<Images>();

  const [bigImg, setBigImg] = useState<string | undefined>(avatar?.path);
  const [looked, setLooked] = useState<User[]>();
  const [stalkers, setStalkers] = useState<User[]>();

  const id = user?.id;

  useEffect(() => {
    if (id) {
      profileService.getProfile(String(id)).then((response) => {
        setProfile(response);
      });
      imageService.getImage(String(id)).then((response) => {
        setImages(response);
        console.log("images", response);
      });
      imageService.getAvatar(String(id)).then((response) => {
        setAvatar(response);
        setBigImg(avatar?.path);
        console.log("avatar", response);
      });
      profileService.getStalked(String(id)).then((response) => {
        setLooked(response.looked);
        setStalkers(response.stalkers);
        console.log("hihuu", response);
      });
    }
  }, [id]);

  if (!profile || !images || !avatar || !user) {
    return <div>Loading profile...</div>;
  }

  const birthDate = new Date(profile.birthday);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  // const lookedMap = looked?.map((user) => user.username);

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
          {/* <div>Distance:</div> <div>{distance} km</div> */}
          <div>Tags:</div> <div> {profile.tags.join(", ")}</div>
          <div>Fame:</div> <div> {profile.fame}</div>
        </div>
        <div className="cardInfo">
          <div>First Name:</div> <div>{profile.firstname}</div>
          <div>Last Name:</div> <div>{profile.lastname}</div>
          <div>About Me:</div> <div>{profile.bio}</div>
          <div>Looked Profiles:</div>{" "}
          <div>
            {looked?.map((user) => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                style={{ textDecoration: "none", color: "var(--dapurple)" }}
              >
                {user.username},{" "}
              </Link>
            ))}
          </div>
          <div>Who Looked You:</div>{" "}
          <div>
            {" "}
            {stalkers?.map((user) => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                style={{ textDecoration: "none", color: "var(--dapurple)" }}
              >
                {user.username},{" "}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCard;
