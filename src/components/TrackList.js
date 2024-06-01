import React from "react";
import Track from "./Track";
import "./styles/TrackList.css";

const TrackList = ({ tracks, onAdd }) => {
  return (
    <div className="track-list">
      {tracks.map((track) => (
        <Track key={track.id} track={track} onAdd={onAdd} />
      ))}
    </div>
  );
};

export default TrackList;
