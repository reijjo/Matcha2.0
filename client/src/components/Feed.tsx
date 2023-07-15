import { useEffect, useState } from "react";
import { Profile, User, Images } from "../types";
import profileService from "../services/profileService";
import BigCard from "./BigCard";

const Feed = ({ user }: { user: User | null }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [images, setImages] = useState<Images[]>([]);

  useEffect(() => {
    if (user && user.status && user.status < 3) {
      window.location.replace("/registerTwo");
    }
  }, []);
  console.log("FEED token", user);

  useEffect(() => {
    if (user && user.status && user.status > 2) {
      profileService.getAllProfiles(user).then((response) => {
        setProfiles(response.profile);
        setImages(response.images);
        console.log("resp", response);
      });
    }
  }, []);

  const profilesWithImages = profiles?.map((profile) => {
    const image = images.find((img) => img.user_id === profile.user_id);

    return {
      ...profile,
      image,
    };
  });

  return (
    <div>
      {user ? (
        <div id="feed">
          <div className="overlaydark" />
          {profilesWithImages?.map((profile) => (
            // <div key={profile.user_id} className="feedstuff">
            // <div key={profile.user_id} className="feedCard">
            //   {/* <div className="feedCard"> */}
            //   <div>{profile.username}</div>
            //   <div>
            //     <img
            //       src={profile.image?.path}
            //       alt="image"
            //       style={{ height: "50px", width: "50px" }}
            //     />
            //   </div>
            // </div>
            <BigCard
              key={profile.user_id}
              profile={profile}
              image={profile.image}
            />
            // </div>
          ))}
        </div>
      ) : (
        <p>oisko tokenii</p>
      )}
    </div>
  );
};

export default Feed;
