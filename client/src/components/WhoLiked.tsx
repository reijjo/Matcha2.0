import profileService from "../services/profileService";
import imageService from "../services/imageService";
import { Images, User, Profile } from "../utils/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { calcCoordsDistance } from "../utils/utils";

const WhoLiked = ({ user }: { user: User | null }) => {
  const [whoLiked, setWhoLiked] = useState<User[]>();
  const [images, setImages] = useState<Images[]>();
  const [myProfile, setMyProfile] = useState<Profile | undefined>();
  const [profile2, setProfile2] = useState<Profile[]>();

  useEffect(() => {
    if (user) {
      profileService.getLiked(String(user.id)).then((response) => {
        setWhoLiked(response.whoLiked);
        setProfile2(response.whoLikedCoors);
      });
      imageService.getAll().then((response) => {
        setImages(response);
      });
      profileService.getProfile(String(user.id)).then((response) => {
        setMyProfile(response);
      });
    }
  }, []);

  const profilesWithImages = whoLiked?.map((profile) => {
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

  console.log("lwholiked", whoLiked);
  console.log("lookedCoors", profile2);
  console.log("images", images);
  console.log("myprofile", myProfile);

  if (!profilesWithImages || !myProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div id="feed">
      <div className="overlaydark" />
      <div className="likedCard">
        <div className="cardHeader">
          <b style={{ fontSize: "larger" }}>Who liked you:</b>
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

export default WhoLiked;
