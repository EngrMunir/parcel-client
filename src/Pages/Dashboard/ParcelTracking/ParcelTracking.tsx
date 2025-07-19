import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { withCredentials: true });

type TrackingInfoType = {
  receiverName: string;
  agent: { name: string };
  tracks: { status: string; updatedAt: string }[];
  currentLatitude: number;
  currentLongitude: number;
};

const ParcelTracking = () => {
  const { parcelId } = useParams();
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfoType | null>(null);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

useEffect(() => {
  const fetchTrackingInfo = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/parcels/tracking/${parcelId}`,
        { withCredentials: true }
      );
      const data = res.data.data;
      setTrackingInfo(data);
      if (data?.currentLatitude && data?.currentLongitude) {
        setLocation({ lat: data.currentLatitude, lng: data.currentLongitude });
      }
    } catch (err) {
      console.error("Tracking info fetch error", err);
    }
  };

  fetchTrackingInfo();

  const listener = (data: any) => {
    if (data.parcelId === parcelId) {
      setLocation({ lat: data.latitude, lng: data.longitude });
    }
  };


  socket.on("parcelLocationUpdated", listener);

  return () => {
    socket.off("parcelLocationUpdated", listener);
  };
}, [parcelId]);


  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">📍 Real-Time Parcel Tracking</h2>

      <div className="mb-4">
        <p><strong>Receiver:</strong> {trackingInfo?.receiverName || "N/A"}</p>
        <p><strong>Agent:</strong> {trackingInfo?.agent?.name || "N/A"}</p>
        <p><strong>Status:</strong> {trackingInfo?.tracks?.slice(-1)[0]?.status || "Unknown"}</p>
      </div>

      <iframe
        width="100%"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_MAPS_KEY}&q=${location.lat},${location.lng}`}
      />
    </div>
  );
};

export default ParcelTracking;
