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

  const [passedProfiles, setPassedProfiles] = useState<number[]>([]);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);

  const [notifSent, setNotifSent] = useState(false);
  const [gotProfile, setGotProfile] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const { id } = useParams<string>();

  // console.log("USER", user);
  console.log("buttonClickec", buttonClicked);

  useEffect(() => {
    const fetchProfileData = async (id: string) => {
      try {
        if (!gotProfile) {
          const response = await profileService.getProfile(id);
          setProfile(response);
          setGotProfile(true);
        }
      } catch (error) {
        console.error("Error fetching Profile Data", error);
      }
    };

    const fetchImageData = async (id: string) => {
      try {
        const imgResponse = await imageService.getImage(id);
        setImages(imgResponse);

        const avatarResponse = await imageService.getAvatar(id);
        setAvatar(avatarResponse);
        setBigImg(avatar?.path);
      } catch (error) {
        console.error("Error fetching Image Data", error);
      }
    };

    const fetchOtherData = async (id: string) => {
      if (user && profile) {
        try {
          const myProfileResponse = await profileService.getProfile(
            String(user.id)
          );
          setMyProfile(myProfileResponse);
          console.log(id);
          if (
            !notifSent &&
            profile.isonline === false &&
            myProfile?.username !== undefined
          ) {
            const message = `${myProfile?.username} looked your profile!`;
            const response = await profileService.addNotifications(
              id,
              String(user.id),
              message
            );
            if (response === "OK") {
              setNotifSent(true);
              console.log('OK"', response);
            } else {
              setNotifSent(true);

              console.log("WHAT THE HELL", response);
            }
            console.log("responseTHIS ONE", response);
          }

          const passedResponse = await profileService.getPassed(
            String(user.id)
          );
          const passedIds = passedResponse.map(
            (profile: { passed_id: number }) => profile.passed_id
          );
          setPassedProfiles(passedIds);

          const likedResponse = await profileService.getLiked(String(user.id));
          const likedIds = likedResponse.regular.map(
            (profile: { liked_id: number }) => profile.liked_id
          );
          setLikedProfiles(likedIds);
        } catch (error) {
          console.error("Error fetching Other Data", error);
        }
        await profileService.addStalked(id, String(user.id));
      }
    };

    if (id) {
      if (id === String(user?.id)) {
        window.location.replace("/me");
      } else {
        fetchProfileData(id);
        fetchImageData(id);
        setGotProfile(false);
        fetchOtherData(id);
      }
    }
  }, [id, profile]);

  if (!profile || !images || !avatar || !user) {
    // setTimeout(() => {
    return <div>Loading profile...</div>;
    // }, 500);
  }

  const birthDate = new Date(profile.birthday);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  const distance = myProfile?.coordinates
    ? calcCoordsDistance(myProfile.coordinates, profile.coordinates)
    : undefined;

  const handleClick = (imagePath: string) => {
    setBigImg(imagePath);
  };

  const isLiked = likedProfiles.includes(profile.user_id);
  const isPassed = passedProfiles.includes(profile.user_id);

  const like = async (id: number, myId: number) => {
    console.log("Likebutton stuff userId", id);
    console.log("Likebutton stuff MYID", myId);

    // await profileService.addLiked(String(id), String(myId)).then(() => {
    //   console.log("ADD LIKE DONE");
    // });
    const iLike = await profileService.addLiked(String(id), String(myId));
    if (iLike) {
      setButtonClicked(true);
    }
  };

  const pass = async (id: number, myId: number) => {
    console.log("passbutton stuff userId", id);
    console.log("passbutton stuff MYID", myId);

    const ready = await profileService.addPassed(String(id), String(myId));
    if (ready) {
      setButtonClicked(true);
    }
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
        {!isLiked && !isPassed && !buttonClicked && (
          <div
            className="cardButtons"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <button
              className="matchButton"
              onClick={
                () => like(profile.user_id, user.id as number)
                // console.log(
                //   "like Profile Id and My Id",
                //   profile.user_id,
                //   user.id
                // )
              }
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
        )}
      </div>
    </div>
  );
};

export default UserCard;

// profileService.getProfile(id).then((response) => {
//   setProfile(response);
// });
// imageService.getImage(id).then((response) => {
//   setImages(response);
// });
// imageService.getAvatar(id).then((response) => {
//   setAvatar(response);
//   setBigImg(avatar?.path);
// });
// if (user && profile) {
// profileService.getProfile(String(user.id)).then((response) => {
//   setMyProfile(response);
// });
// profileService.addStalked(id, String(user.id)).then((response) => {
//   console.log("response", response);
// });
// if (profile.isonline === false && myProfile?.username !== undefined) {
//   const message = `${myProfile?.username} looked your profile!`;
//   profileService
//     .addNotifications(id, String(user.id), message)
//     .then((response) => {
//       console.log("NOTIFICATION response", response);
//     });
// }
// profileService.getPassed(String(user.id)).then((response) => {
//   // console.log("passed", response);
//   const passedIds = response.map(
//     (profile: { passed_id: number }) => profile.passed_id
//   );
//   setPassedProfiles(passedIds);
// });
// profileService.getLiked(String(user.id)).then((response) => {
//   const likedIds = response.regular.map(
//     (profile: { liked_id: number }) => profile.liked_id
//   );
//   setLikedProfiles(likedIds);
// });
// }
