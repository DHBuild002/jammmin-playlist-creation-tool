import React from "react";
import Track from "./Track";
import "./styles/TrackList.css";

const TrackList = ({ tracks }) => {
  // const [tracks, setTracks] = useState("");
  return (
    <div className="track-list">
      <h2>All Tracks</h2>
      {tracks.map((track) => (
        <Track key={track.id} track={track} />
      ))}
    </div>
  );
};

export default TrackList;
