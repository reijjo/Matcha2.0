import { SyntheticEvent, useEffect, useState } from "react";
import {
  Gender,
  Looking,
  User,
  Coordinates,
  Notification,
  // Tags,
} from "../types";
import userService from "../services/userService";
import Notify from "./Notify";
import imageService from "../services/imageService";

const RegisterTwo = ({ user }: { user: User | null }) => {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
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

  const [notification, setNotification] = useState<Notification>({
    message: "",
    style: {},
    success: false,
  });
  const [locationMsg, setLocationMsg] = useState(false);
  const [firstCoor, setFirstCoor] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (user && user.status && user.status !== 2) {
      window.location.replace("/feed");
    } else if (user && user.status && user.status === 2) {
      userService.getIpApi().then((response) => {
        setCity(response.city);
        setCountry(response.country_name);
        setCoordinates({ x: response.longitude, y: response.latitude });
        setTimeout(() => {
          setFirstCoor(true);
        }, 1000);
      });
    }
  }, []);

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

  const finishProfile = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const userProfile = {
        user_id: user?.id,
        username: user?.username,
        firstname: user?.firstname,
        lastname: user?.lastname,
        email: user?.email,
        birthday: user?.birthday,
        password: user?.password,
        location: `${city}, ${country}`,
        coordinates: coordinates,
        gender: gender,
        seeking: seeking,
        bio: bio,
        tags: allTags,
      };
      console.log("ok", userProfile);
    } catch (error: unknown) {
      console.log("New Profile Error:", error);
    }
  };

  const addTag = (tag: string) => {
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

  console.log("All TAGS", allTags);

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
      // setImageUrl(imageData.url);
      console.log("imagggdata", imageData);
    }
    // } catch (error: unknown) {
    //   console.log("image upload frontend error", error);
    // }
  };

  return (
    <div id="register">
      <div className="overlay" />
      <form className="registerForm" onSubmit={finishProfile}>
        <div style={{ textAlign: "left", width: "100%", marginBottom: "1vh" }}>
          <strong style={{ fontSize: "3vh" }}>Finish your profile.</strong>
        </div>
        <div className="grid-container">
          <div>City, Country</div>
          <input
            type="text"
            required={true}
            name="location"
            value={!city && !country ? "..." : `${city}, ${country}`}
            readOnly
          />
          {/* COORDINATES */}
          <div>Coordinates</div>
          <input
            type="text"
            name="coordinates"
            readOnly
            required={true}
            value={`${coordinates.x}, ${coordinates.y}`}
          />
          {locationMsg ? <Notify {...notification} /> : null}
          <div>Update Coordinates</div>
          <button className="locationButton" onClick={getLocation}>
            Get Location!
          </button>

          {/* GENDER */}
          <div>Your Gender</div>
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

          {/* LOOKING */}
          <div>What are you looking for?</div>
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

          {/* BIO */}
          <div>Tell a bit of yourself:</div>
          <textarea
            style={{ resize: "none" }}
            rows={4}
            cols={30}
            placeholder="1-160 characters."
            name="bioarea"
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

          {/* TAGS */}
          <div>Add tags that describes you</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              type="text"
              name="tagsfield"
              placeholder="vegan, ig_model etc..."
              autoComplete="off"
              style={{ padding: "0.5vw", flexGrow: "1", marginRight: "1vw" }}
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
            <button className="locationButton" onClick={() => addTag(tag)}>
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
          {/* IMAGE */}
          <div>Add a photo</div>
          <button className="custom-file-input">
            <label htmlFor="fileInput">Add</label>
          </button>
          <input
            type="file"
            id="fileInput"
            className="file-input"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div style={{ gridColumn: "1 / span 2" }}>
            (without a photo you cant see other profiles)
          </div>

          <button className="regformbutton2" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterTwo;
