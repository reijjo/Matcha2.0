import { useEffect, useState } from "react";
import { Profile, User, Images } from "../types";
import profileService from "../services/profileService";
import BigCard from "./BigCard";
// import InfiniteScroll from "react-infinite-scroll-component";

const Feed = ({ user }: { user: User | null }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [images, setImages] = useState<Images[]>([]);
  // const [offset, setOffset] = useState(0);
  // const [hasMore, setHasMore] = useState(true);
  // const [initialLoad, setInitialLoad] = useState(true);

  // const limit = 10;

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
          {/* <InfiniteScroll
            dataLength={profilesWithImages.length}
            next={fetchData}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more profiles to load.</p>}
          > */}
          {profilesWithImages?.map((profile) => (
            <BigCard
              key={profile.user_id}
              profile={profile}
              image={profile.image}
            />
            // </div>
          ))}
          {/* </InfiniteScroll> */}
        </div>
      ) : (
        <p>oisko tokenii</p>
      )}
    </div>
  );
};

export default Feed;
