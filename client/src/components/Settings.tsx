import { SyntheticEvent, useEffect, useState } from "react";
import {
  Images,
  Profile,
  User,
  Notification,
  Gender,
  Looking,
  Coordinates,
} from "../types";
import userService from "../services/userService";
import imageService from "../services/imageService";
import Notify from "./common/Notify";
import { Link, useNavigate } from "react-router-dom";

const Settings = ({ user }: { user: User | null }) => {
  const [profile, setProfile] = useState<Profile[]>([]);
  const [images, setImages] = useState<Images[]>([]);

  const [username, setUsername] = useState("");
  const [usernameLenFocus, setUsernameLenFocus] = useState(false);
  const [usernameLenMsg, setUsernameLenMsg] = useState<null | string>(null);
  const [usernameValidFocus, setUsernameValidFocus] = useState(false);
  const [usernameValidMsg, setUsernameValidMsg] = useState<null | string>(null);

  const [email, setEmail] = useState("");

  const [firstname, setFirstname] = useState("");
  const [firstnameLenFocus, setFirstnameLenFocus] = useState(false);
  const [firstnameLenMsg, setFirstnameLenMsg] = useState<null | string>(null);
  const [firstnameValidFocus, setFirstnameValidFocus] = useState(false);
  const [firstnameValidMsg, setFirstnameValidMsg] = useState<null | string>(
    null
  );

  const [lastname, setLastname] = useState("");
  const [lastnameLenFocus, setLastnameLenFocus] = useState(false);
  const [lastnameLenMsg, setLastnameLenMsg] = useState<null | string>(null);
  const [lastnameValidFocus, setLastnameValidFocus] = useState(false);
  const [lastnameValidMsg, setLastnameValidMsg] = useState<null | string>(null);

  const [date, setDate] = useState("");
  const [dateFocus, setDateFocus] = useState(false);
  const [dateMsg, setDateMsg] = useState<null | string>(null);

  const [country, setCountry] = useState("");

  const [city, setCity] = useState("");

  const [coordinates, setCoordinates] = useState<Coordinates>({ x: 0, y: 0 });
  const [gender, setGender] = useState<Gender>(Gender.Male);

  const [seeking, setSeeking] = useState<Looking>(Looking.Male);

  const [bio, setBio] = useState("");
  const [bioLenMsg, setBioLenMsg] = useState<null | string>(null);
  const [bioLenFocus, setBioLenFocus] = useState(false);
  const [bioValidFocus, setBioValidFocus] = useState(false);
  const [bioValidMsg, setBioValidMsg] = useState<null | string>(null);

  const [tag, setTag] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagLenMsg, setTagLenMsg] = useState<null | string>(null);
  const [tagLenFocus, setTagLenFocus] = useState(false);
  const [tagValidMsg, setTagValidMsg] = useState<null | string>(null);
  const [tagValidFocus, setTagValidFocus] = useState(false);

  const [locationMsg, setLocationMsg] = useState(false);
  const [firstCoor, setFirstCoor] = useState(false);

  const [notification, setNotification] = useState<Notification>({
    message: "",
    style: {},
    success: false,
  });

  const [imgNotify, setImgNotify] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [userId, setUserId] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      userService.getSettings(user?.id).then((response) => {
        setProfile(response.profile);
        setImages(response.image);
        console.log("profresp", response);
        if (profile.length > 0 && images.length > 0) {
          setUsername(profile[0]?.username);
          setEmail(profile[0]?.email);
          setFirstname(profile[0]?.firstname);
          setLastname(profile[0]?.lastname);
          setDate(profile[0]?.birthday);
          setGender(profile[0]?.gender);
          setSeeking(profile[0]?.seeking);
          setBio(profile[0]?.bio);
          setAllTags(profile[0]?.tags);
          setUserId(profile[0]?.user_id);
        }
      });
    }
  }, [profile.length, imgNotify, avatar]);

  useEffect(() => {
    if (user && user.status) {
      userService.getIpApi().then((response) => {
        setCity(response.city);
        setCountry(response.country_name);
        setCoordinates({ x: response.longitude, y: response.latitude });
        setTimeout(() => {
          setFirstCoor(true);
        }, 1000);
      });
    }
  }, [profile.length]);

  useEffect(() => {
    if (firstCoor) {
      if (coordinates.x !== 0 && coordinates.y !== 0) {
        userService.openCage(coordinates).then((response) => {
          // console.log("NEWWW COOORO", response);
          if (response.suburb && response.city && response.country) {
            setCity(`${response.suburb} / ${response.city}`);
            setCountry(response.country);
          } else if (response.city && response.country) {
            setCity(`${response.city}`);
            setCountry(response.country);
          }
        });
      }
    }
  }, [coordinates]);

  console.log("profile", profile);

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const nameRegex = /^[a-zA-Z0-9!._\-@#*$]+$/;
    setUsername(value);

    if (value.length < 3 || value.length > 30) {
      setUsernameLenMsg("3-30 characters.");
    } else {
      setUsernameLenMsg(null);
    }

    if (!nameRegex.test(value)) {
      setUsernameValidMsg("Only letters, numbers and characters (!._-@#*$)");
    } else {
      setUsernameValidMsg(null);
    }
    // console.log("username", value);
  };

  const handleFirstname = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const nameRegex = /^[a-zA-Z-]+$/;
    setFirstname(value);

    if (value.length < 2 || value.length > 15) {
      setFirstnameLenMsg("2 - 15 characters.");
    } else {
      setFirstnameLenMsg(null);
    }

    if (!nameRegex.test(value)) {
      setFirstnameValidMsg("Only letters and '-' allowed.");
    } else {
      setFirstnameValidMsg(null);
    }
  };

  const handleLastname = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const nameRegex = /^[a-zA-Z-]+$/;
    setLastname(value);

    if (value.length < 2 || value.length > 30) {
      setLastnameLenMsg("2 - 30 characters.");
    } else {
      setLastnameLenMsg(null);
    }

    if (!nameRegex.test(value)) {
      setLastnameValidMsg("Only characters and '-' allowed");
    } else {
      setLastnameValidMsg(null);
    }
  };

  const handleDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDate(value);

    const selectedDate = new Date(event.target.value);
    const enuffAge = new Date();

    enuffAge.setFullYear(enuffAge.getFullYear() - 18);

    if (selectedDate > enuffAge) {
      setDateMsg("Only for ages 18+.");
    } else {
      setDateMsg(null);
    }
  };

  const addTag = (tag: string) => {
    const tagRegex = /^[a-zA-Z0-9-_]+$/;

    if (!tagRegex.test(tag)) {
      return;
    }

    if (allTags.length < 5) {
      setAllTags((prevTags) => [...prevTags, `#${tag}`]);
      setTag("");
      console.log("tag", tag);
    } else {
      console.log("max 5 tags");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setAllTags((prevTags) =>
      prevTags.filter((tag, index) => index !== indexToRemove)
    );
  };

  const getLocation = () => {
    console.log("button clicked!");
    setLocationMsg(true);
    setNotification({
      message: "Locating...",
      style: { color: "blue" },
      success: false,
    });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (pos.coords) {
          const { latitude, longitude } = pos.coords;
          setCoordinates({ x: longitude, y: latitude });
          console.log("Coordinates found!", coordinates);
          setNotification({
            message: "Location updated!",
            style: { color: "green" },
            success: false,
          });
          setTimeout(() => {
            setLocationMsg(false);
            setNotification({ message: "", style: {}, success: false });
          }, 5000);
        } else {
          console.log("Unable to get location.");
        }
      },
      (error) => {
        if (error) {
          setLocationMsg(true);
          setNotification({
            message: "Geolocation access denied.",
            style: { color: "red" },
            success: false,
          });
          setTimeout(() => {
            setLocationMsg(false);
            setNotification({ message: "", style: {}, success: false });
          }, 5000);
        }
        console.log("Geolocation error:", error);
      }
    );
  };

  const handleGender = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setGender(value as Gender);
  };

  const handleLooking = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSeeking(value as Looking);
  };

  const handleBio = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setBio(value);

    if (value.length < 2 || value.length > 160) {
      setBioLenMsg("2-160 characters, thanks.");
    } else {
      setBioLenMsg(null);
    }

    if (/[']/.test(value)) {
      setBioValidMsg("' isn't allowed.");
    } else {
      setBioValidMsg(null);
    }
  };

  const handleTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const tagRegex = /^[a-zA-Z0-9-_]+$/;

    setTag(value.toLowerCase());

    if (value.length < 1 || value.length > 20) {
      setTagLenMsg("1-20 characters.");
    } else {
      setTagLenMsg(null);
    }

    if (!tagRegex.test(value)) {
      setTagValidMsg("Only letters and numbers and (-_) allowed.");
    } else {
      setTagValidMsg(null);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // try {
    const imageFile = event.target.files?.[0];
    if (imageFile) {
      const imageData = await imageService.uploadImage(imageFile, user?.id);
      setImgNotify(true);
      setNotification({
        message: imageData?.notification?.message,
        style: imageData?.notification?.style,
        success: imageData?.notification?.success,
      });
      setTimeout(() => {
        setImgNotify(false);
        setNotification({ message: "", style: {}, success: false });
      }, 5000);
      console.log("imageData", imageData);
    }
    // } catch (error: unknown) {
    //   console.log("image upload frontend error", error);
    // }
  };

  const handleImageDelete = (id: number) => {
    console.log("taa lahtee", id);
    imageService.deleteImage(id).then((response) => {
      setImgNotify(true);
      setNotification({
        message: response?.notification?.message,
        style: response?.notification?.style,
        success: response?.notification?.success,
      });
      setTimeout(() => {
        setImgNotify(false);
        setNotification({ message: "", style: {}, success: false });
      }, 1500);
      console.log(response);
    });
  };

  // const profilepic = images.find((pic) => pic.avatar === true);
  // setAvatar(profilepic);

  const handleAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log("value", value);
    const res = await imageService.updateProfilePic(Number(value));
    setAvatar(value);
    setNotification(res.notification);
    setTimeout(() => {
      setNotification({ message: "", style: {}, success: false });
    }, 2000);
  };

  const updateProfile = (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const profile = {
        user_id: userId,
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        birthday: date,
        location: `${city}, ${country}`,
        coordinates: coordinates,
        gender: gender,
        seeking: seeking,
        bio: bio,
        tags: allTags,
      };

      userService.newSettings(profile).then((response) => {
        setNotification(response.notification);
        setTimeout(() => {
          setNotification({ message: "", style: {}, success: false });
          navigate("/feed");
        }, 2000);
        console.log(response);
      });

      console.log("ihuhu");
    } catch (error: unknown) {
      console.log("Update error", error);
    }
  };

  return (
    <div id="register">
      <div className="overlay" />
      <form className="registerForm" onSubmit={updateProfile}>
        <div style={{ textAlign: "left", width: "100%", marginBottom: "1vh" }}>
          <strong style={{ fontSize: "3vh" }}>Settings</strong>
        </div>
        <div className="settingsGrid">
          {/* USERNAME */}
          <div>
            <fieldset>
              <legend>Username</legend>
              <input
                type="text"
                placeholder="Username..."
                autoComplete="off"
                required={true}
                value={username}
                name="username"
                onChange={handleUsername}
                onFocus={() => {
                  setUsernameLenFocus(true);
                  setUsernameValidFocus(true);
                }}
                onBlur={() => {
                  setUsernameLenFocus(false);
                  setUsernameValidFocus(false);
                }}
              />
              {usernameLenFocus && usernameLenMsg && (
                <div className="regmsg">
                  <li>{usernameLenMsg}</li>
                </div>
              )}
              {usernameValidFocus && usernameValidMsg && (
                <div className="regmsg">
                  <li>{usernameValidMsg}</li>
                </div>
              )}
            </fieldset>
          </div>
          {/* EMAIL */}
          <div>
            {" "}
            <fieldset>
              <legend>Email</legend>
              <input
                type="email"
                placeholder="Email..."
                autoComplete="off"
                required={true}
                value={email}
                name="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </fieldset>
          </div>
          {/* FIRSTNAME */}
          <div>
            <fieldset>
              <legend>First Name</legend>
              <input
                type="text"
                placeholder="First Name..."
                autoComplete="off"
                required={true}
                value={firstname}
                onChange={handleFirstname}
                name="firstname"
                onFocus={() => {
                  setFirstnameLenFocus(true);
                  setFirstnameValidFocus(true);
                }}
                onBlur={() => {
                  setFirstnameLenFocus(false);
                  setFirstnameValidFocus(false);
                }}
              />
              {firstnameLenFocus && firstnameLenMsg && (
                <div className="regmsg">
                  <li>{firstnameLenMsg}</li>
                </div>
              )}
              {firstnameValidFocus && firstnameValidMsg && (
                <div className="regmsg">
                  <li>{firstnameValidMsg}</li>
                </div>
              )}
            </fieldset>
          </div>
          {/* LASTNAME */}
          <div>
            <fieldset>
              <legend>Last Name</legend>
              <input
                type="text"
                placeholder="Last Name..."
                autoComplete="off"
                required={true}
                value={lastname}
                name="lastname"
                onChange={handleLastname}
                onFocus={() => {
                  setLastnameLenFocus(true);
                  setLastnameValidFocus(true);
                }}
                onBlur={() => {
                  setLastnameLenFocus(false);
                  setLastnameValidFocus(false);
                }}
              />
              {lastnameLenFocus && lastnameLenMsg && (
                <div className="regmsg">
                  <li>{lastnameLenMsg}</li>
                </div>
              )}
              {lastnameValidFocus && lastnameValidMsg && (
                <div className="regmsg">
                  <li>{lastnameValidMsg}</li>
                </div>
              )}
            </fieldset>
          </div>
          {/* BIRTHDAY */}
          <div>
            <fieldset>
              <legend>Date Of Birth</legend>
              <input
                type="date"
                required={true}
                value={date}
                name="date"
                onChange={handleDate}
                onFocus={() => {
                  setDateFocus(true);
                }}
                onBlur={() => {
                  setDateFocus(false);
                }}
              />
              {dateFocus && dateMsg && (
                <div className="regmsg">
                  <li>{dateMsg}</li>
                </div>
              )}
            </fieldset>
          </div>
          {/* CITY, COUNTRY */}
          <div>
            <fieldset>
              <legend>City, Country</legend>
              <input
                type="text"
                required={true}
                name="location"
                value={!city && !country ? "..." : `${city}, ${country}`}
                readOnly
              />
            </fieldset>
          </div>
          {/* COORDINATES */}
          <div>
            <fieldset>
              <legend>Coordinates</legend>
              <input
                type="text"
                name="coordinates"
                readOnly
                required={true}
                value={`${coordinates.x}, ${coordinates.y}`}
              />
              {locationMsg ? <Notify {...notification} /> : null}
            </fieldset>
          </div>
          {/* UPDATE COORDINATES */}
          <div>
            <fieldset>
              <legend>Update Coordinates</legend>
              <button
                className="locationButton"
                type="button"
                onClick={getLocation}
                style={{ width: "90%" }}
              >
                Get Location!
              </button>
            </fieldset>
          </div>
          {/* GENDER */}
          <div>
            <fieldset>
              <legend>Gender</legend>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>
                  <input
                    type="radio"
                    name="gendermale"
                    value={Gender.Male}
                    checked={gender === Gender.Male}
                    onChange={handleGender}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="genderfemale"
                    value={Gender.Female}
                    checked={gender === Gender.Female}
                    onChange={handleGender}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="genderother"
                    value={Gender.Other}
                    checked={gender === Gender.Other}
                    onChange={handleGender}
                  />
                  Other
                </label>
              </div>
            </fieldset>
          </div>
          {/* LOOKING */}
          <div>
            <fieldset>
              <legend>Looking</legend>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>
                  <input
                    type="radio"
                    name="lookingmale"
                    value={Looking.Male}
                    checked={seeking === Looking.Male}
                    onChange={handleLooking}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="lookingfemale"
                    value={Looking.Female}
                    checked={seeking === Looking.Female}
                    onChange={handleLooking}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="lookingboth"
                    value={Looking.Both}
                    checked={seeking === Looking.Both}
                    onChange={handleLooking}
                  />
                  Both
                </label>
              </div>
            </fieldset>
          </div>
          {/* BIO */}
          <div className="spangrid">
            <fieldset>
              <legend>Bio</legend>
              <textarea
                style={{ resize: "none" }}
                rows={4}
                cols={30}
                placeholder="1-160 characters."
                name="bioarea"
                value={bio}
                onChange={handleBio}
                onFocus={() => {
                  setBioLenFocus(true);
                  setBioValidFocus(true);
                }}
                onBlur={() => {
                  setBioLenFocus(false);
                  setBioValidFocus(false);
                }}
              ></textarea>
              {bioLenFocus && bioLenMsg && (
                <div className="regmsg">
                  <li>{bioLenMsg}</li>
                </div>
              )}
              {bioValidFocus && bioValidMsg && (
                <div className="regmsg">
                  <li>{bioValidMsg}</li>
                </div>
              )}
            </fieldset>
          </div>
          {/* TAGS */}
          <div className="spangrid">
            <fieldset>
              <legend>Tags</legend>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <input
                  type="text"
                  name="tagsfield"
                  placeholder="vegan, ig_model etc..."
                  autoComplete="off"
                  style={{
                    padding: "0.5vw",
                    flexGrow: "1",
                    marginRight: "1vw",
                  }}
                  value={tag}
                  onChange={handleTag}
                  onFocus={() => {
                    setTagLenFocus(true);
                    setTagValidFocus(true);
                  }}
                  onBlur={() => {
                    setTagLenFocus(false);
                    setTagValidFocus(false);
                  }}
                />
                <button
                  className="locationButton"
                  type="button"
                  onClick={() => addTag(tag)}
                >
                  Add
                </button>
              </div>
              {tagLenFocus && tagLenMsg && (
                <div className="regmsg">
                  <li>{tagLenMsg}</li>
                </div>
              )}
              {tagValidFocus && tagValidMsg && (
                <div className="regmsg">
                  <li>{tagValidMsg}</li>
                </div>
              )}
              {allTags.length > 0 ? (
                <div style={{ gridColumn: "1 / span 2" }}>
                  {allTags.map((tag, index) => {
                    return (
                      <div
                        key={tag}
                        style={{
                          display: "inline-block",
                          margin: "5px",
                          padding: "5px",
                          border: "1px solid #ccc",
                          backgroundColor: "var(--peach)",
                          borderRadius: "5px",
                        }}
                      >
                        <span>{tag}</span>
                        <span
                          style={{
                            marginLeft: "10px",
                            cursor: "pointer",
                            color: "red",
                          }}
                          onClick={() => removeTag(index)}
                        >
                          x
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </fieldset>
          </div>
          {/* PASSWORD */}
          <div className="spangrid">
            <fieldset>
              <legend>Change password?</legend>
              Click{" "}
              <Link
                to={`/${user?.verifycode}/forgot`}
                style={{
                  textDecoration: "none",
                  fontSize: "larger",
                  color: "var(--green)",
                }}
              >
                here
              </Link>{" "}
              to change password.
            </fieldset>
          </div>
          {/* PHOTOOOS */}
          <div className="spangrid">
            <fieldset>
              <legend>Photos</legend>
              <button className="custom-file-input" type="button">
                <label htmlFor="fileInput">Add</label>
              </button>
              <input
                type="file"
                id="fileInput"
                className="file-input"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {/* {imgNotify && <Notify {...notification} />} */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  gridColumn: "1 / span 2",
                }}
              >
                {images.map((images) => (
                  <div key={images.id}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <label>
                        <div>Profile pic</div>
                        <input
                          type="radio"
                          name="profilePic"
                          value={images.id}
                          checked={images.avatar}
                          onChange={handleAvatar}
                        />{" "}
                      </label>
                    </div>
                    <div
                      style={
                        images.avatar === true
                          ? {
                              border: "2px solid var(--dapurple)",
                              display: "flex",
                              position: "relative",
                            }
                          : {
                              border: "1px solid black",
                              display: "flex",
                              position: "relative",
                            }
                      }
                      key={images.id}
                    >
                      <img
                        src={images.path}
                        alt="userimage"
                        style={{ width: "10vw", height: "10vh" }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          top: "1px",
                          right: "5px",
                          cursor: "pointer",
                          color: "red",
                          fontSize: "1.5rem",
                          // backgroundColor: "var(--peach)",
                          // fontWeight: "bold",
                        }}
                        onClick={() => handleImageDelete(images.id)}
                      >
                        x
                      </div>
                    </div>
                  </div>
                ))}
                {images.length === 0 && (
                  <div>(without a photo you cant see other profiles)</div>
                )}
              </div>
            </fieldset>
          </div>

          <Notify {...notification} />
          <button
            className="settingsbutton"
            type="submit"
            style={{ padding: "2vh" }}
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
