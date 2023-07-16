import { useEffect, useState } from "react";
import { Profile, User, Images } from "../types";
import profileService from "../services/profileService";
import BigCard from "./BigCard";
import InfiniteScroll from "react-infinite-scroll-component";
import imageService from "../services/imageService";

const Feed = ({ user }: { user: User | null }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [images, setImages] = useState<Images[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const limit = 1;

  const fetchData = async (user: User) => {
    try {
      const fetchWithDelay = async () => {
        const data = await profileService.getAllProfiles(user, limit, offset);
        if (data.profile.length < limit) {
          setHasMore(false);
        }

        setProfiles((prevProfiles) => [...prevProfiles, ...data.profile]);
        setOffset((prevOffset) => prevOffset + limit);
        if (initialLoad) {
          setInitialLoad(false);
        }
      };

      if (initialLoad) {
        fetchWithDelay();
      } else {
        setTimeout(fetchWithDelay, 2000);
      }
    } catch (error: unknown) {
      console.log("Error fetching profiles", error);
    }
  };

  useEffect(() => {
    if (user && user.status && user.status < 3) {
      window.location.replace("/registerTwo");
    }
  }, []);
  console.log("FEED token", user);

  useEffect(() => {
    // if (user && user.status && user.status > 2) {
    //   profileService.getAllProfiles(user).then((response) => {
    //     setProfiles(response.profile);
    //     setImages(response.images);
    //     console.log("resp", response);
    //   });
    // }
    if (user && user.status && user.status > 2) {
      fetchData(user);
      imageService.getAll().then((response) => {
        setImages(response);
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
        <InfiniteScroll
          dataLength={profilesWithImages.length}
          next={() => fetchData(user)}
          hasMore={hasMore}
          loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
          endMessage={
            <h4 style={{ textAlign: "center" }}>No more profiles to load.</h4>
          }
        >
          <div id="feed">
            <div className="overlaydark" />
            {profilesWithImages?.map((profile) => (
              <BigCard
                key={profile.user_id}
                profile={profile}
                image={profile.image}
              />
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <p>oisko tokenii</p>
      )}
    </div>
  );
};

export default Feed;
