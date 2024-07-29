import React from "react";
import Track from "./Track";
import "./styles/TrackList.css";

const TrackList = ({ tracks }) => {
  return (
    <div className="track-list">
      {tracks.map((track) => (
        <div key={track.id} className="trackContainer">
          <Track key={track.id} track={track} />
        </div>
      ))}
    </div>
  );
};

export default TrackList;
