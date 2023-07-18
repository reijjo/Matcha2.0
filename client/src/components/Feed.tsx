/* eslint-disable @typescript-eslint/no-var-requires */
import { useEffect, useState } from "react";
import { Profile, User, Images } from "../utils/types";
import profileService from "../services/profileService";
import BigCard from "./BigCard";
import InfiniteScroll from "react-infinite-scroll-component";
import imageService from "../services/imageService";
import { calcCoordsDistance } from "../utils/utils";

const cancelIcon = require("../images/icons/cancel-16.png");

type FeedProps = {
  user: User | null;
  sort: boolean;
  setSort: React.Dispatch<React.SetStateAction<boolean>>;
  filter: boolean;
  setFilter: React.Dispatch<React.SetStateAction<boolean>>;
};

// const Feed = ({ user }: { user: User | null }) => {
const Feed = ({ user, sort, setSort, filter, setFilter }: FeedProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [images, setImages] = useState<Images[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [myProfile, setMyProfile] = useState<Profile>();

  const [sortByAge, setSortByAge] = useState<"young" | "old" | null>(null);
  const [sortByKm, setSortByKm] = useState<"near" | "far" | null>(null);
  const [sortByFame, setSortByFame] = useState<"min" | "max" | null>(null);
  const [sortByTags, setSortByTags] = useState<"common" | null>(null);

  const limit = 10;

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
  // console.log("FEED", profiles);

  useEffect(() => {
    if (user && user.status && user.status > 2) {
      fetchData(user);
      imageService.getAll().then((response) => {
        setImages(response);
      });
      profileService.getProfile(String(user.id)).then((response) => {
        console.log("MYRESP", response);
        setMyProfile(response);
      });
    }
  }, []);

  const handleSort = () => {
    setSort(!sort);
    setFilter(false);
  };

  const handleFiltering = () => {
    setSort(false);
    setFilter(!filter);
  };

  const profilesWithImages = profiles?.map((profile) => {
    const image = images.find(
      (img) => img.user_id === profile.user_id && img.avatar
    );

    // console.log("image", image);
    return {
      ...profile,
      image,
    };
  });

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age;
  };

  const sortProfiles = () => {
    let sorted = [...profilesWithImages];

    if (sortByAge === "young") {
      sorted.sort((a, b) => {
        const ageA = calculateAge(a.birthday);
        const ageB = calculateAge(b.birthday);
        return ageA - ageB;
      });
    } else if (sortByAge === "old") {
      sorted.sort((a, b) => {
        const ageA = calculateAge(a.birthday);
        const ageB = calculateAge(b.birthday);
        return ageB - ageA;
      });
    }

    if (sortByKm === "near") {
      sorted.sort((a, b) => {
        const myCoors = myProfile?.coordinates;
        if (myCoors && a.coordinates && b.coordinates) {
          const distanceA = calcCoordsDistance(myCoors, a.coordinates);
          const distanceB = calcCoordsDistance(myCoors, b.coordinates);
          return distanceA - distanceB;
        }
        return 0;
      });
    } else if (sortByKm === "far") {
      sorted.sort((a, b) => {
        const myCoors = myProfile?.coordinates;
        if (myCoors && a.coordinates && b.coordinates) {
          const distanceA = calcCoordsDistance(myCoors, a.coordinates);
          const distanceB = calcCoordsDistance(myCoors, b.coordinates);
          return distanceB - distanceA;
        }
        return 0;
      });
    }

    if (sortByFame === "min") {
      sorted.sort((a, b) => {
        return a.fame - b.fame;
      });
    } else if (sortByFame === "max") {
      sorted.sort((a, b) => {
        return b.fame - a.fame;
      });
    }

    if (sortByTags === "common" && myProfile) {
      sorted = sorted.filter((profile) => {
        const commonTags = profile.tags.filter((tag) =>
          myProfile.tags.includes(tag)
        );
        return commonTags.length > 0;
      });
    }
    return sorted;
  };

  const sortedProfiles = sortProfiles();

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
            {/* SORTING */}
            {sort && (
              <div className="sortingCard">
                <div className="sorting">
                  <div>Sort Profiles:</div>
                  <div>
                    <img
                      src={cancelIcon}
                      alt="cancel"
                      onClick={() => handleSort()}
                      className="cancel-icon"
                    />
                  </div>
                </div>
                <div className="sortGrid">
                  <div>
                    <b>By Age:</b>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <label>
                      <input
                        type="radio"
                        checked={sortByAge === "young"}
                        onChange={() => setSortByAge("young")}
                      />
                      Young
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={sortByAge === null}
                        onChange={() => setSortByAge(null)}
                      />
                      Clear
                    </label>
                    <label>
                      Old
                      <input
                        type="radio"
                        checked={sortByAge === "old"}
                        onChange={() => setSortByAge("old")}
                      />
                    </label>
                  </div>
                </div>
                <div className="sortGrid">
                  <div>
                    <b>By Distance:</b>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <label>
                      <input
                        type="radio"
                        checked={sortByKm === "near"}
                        onChange={() => setSortByKm("near")}
                      />
                      Near
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={sortByKm === null}
                        onChange={() => setSortByKm(null)}
                      />
                      Clear
                    </label>
                    <label>
                      Far
                      <input
                        type="radio"
                        checked={sortByKm === "far"}
                        onChange={() => setSortByKm("far")}
                      />
                    </label>
                  </div>
                </div>
                <div className="sortGrid">
                  <div>
                    <b>Common Tags:</b>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <label>
                      <input
                        type="radio"
                        checked={sortByTags === null}
                        onChange={() => setSortByTags(null)}
                      />
                      None
                    </label>
                    <label>
                      Common
                      <input
                        type="radio"
                        checked={sortByTags === "common"}
                        onChange={() => setSortByTags("common")}
                      />
                    </label>
                  </div>
                </div>
                <div className="sortGrid">
                  <div>
                    <b>By Fame:</b>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <label>
                      <input
                        type="radio"
                        checked={sortByFame === "min"}
                        onChange={() => setSortByFame("min")}
                      />
                      Min
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={sortByFame === null}
                        onChange={() => setSortByFame(null)}
                      />
                      Clear
                    </label>
                    <label>
                      Max
                      <input
                        type="radio"
                        checked={sortByFame === "max"}
                        onChange={() => setSortByFame("max")}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
            {/* FILTERING */}
            {filter && (
              <div className="sortingCard">
                <div className="sorting">
                  <div>Filter Profiles:</div>
                  <div>
                    <img
                      src={cancelIcon}
                      alt="cancel"
                      onClick={() => handleFiltering()}
                      className="cancel-icon"
                    />
                  </div>
                </div>
              </div>
            )}

            {sortedProfiles.map((profile) => (
              // {profilesWithImages?.map((profile) => (
              <BigCard
                key={profile.user_id}
                profile={profile}
                image={profile.image}
                myCoordinates={myProfile?.coordinates}
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
