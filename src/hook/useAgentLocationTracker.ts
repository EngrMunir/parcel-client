import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

interface Props {
  parcelId: string;
  trackingEnabled: boolean;
}

const useAgentLocationTracker = ({ parcelId, trackingEnabled }: Props) => {
  useEffect(() => {
    let watchId: number;

    if (trackingEnabled && parcelId) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            socket.emit("locationUpdate", {
              parcelId,
              latitude,
              longitude,
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 10000,
          }
        );
      } else {
        console.warn("Geolocation is not supported by this browser.");
      }
    }

    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [parcelId, trackingEnabled]);
};

export default useAgentLocationTracker;
