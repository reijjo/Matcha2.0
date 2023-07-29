import { Coordinates } from "./types";

const degreesToRadions = (degrees: number) => {
  const radians = (degrees * Math.PI) / 180;
  return radians;
};

export const calcCoordsDistance = (
  myCoors: Coordinates,
  otherCoors: Coordinates
) => {
  const myLat = degreesToRadions(myCoors.y);
  const myLng = degreesToRadions(myCoors.x);
  const otherLat = degreesToRadions(otherCoors.y);
  const otherLng = degreesToRadions(otherCoors.x);

  const radius = 6571;

  const distanceInKm: number =
    Math.acos(
      Math.sin(myLat) * Math.sin(otherLat) +
        Math.cos(myLat) * Math.cos(otherLat) * Math.cos(myLng - otherLng)
    ) * radius;

  return Math.floor(distanceInKm);
};

export const formatTimeStamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const milliseconds = now.getTime() - date.getTime();
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 60);

  if (minutes < 1) {
    return "Seconds ago.";
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago.`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago.`;
  } else {
    return `${days} day${days === 1 ? "" : "s"} ago.`;
  }
  // const options: Intl.DateTimeFormatOptions = {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  //   hour: "numeric",
  //   minute: "numeric",
  //   second: "numeric",
  //   // timeZoneName: "short",
  // };
  // return date.toLocaleString(undefined, options);
};
