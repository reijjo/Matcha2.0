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

  return Math.floor(distanceInKm * 100) / 100;
};
