import React from "react";
import Track from "./Track";
import "./styles/TrackList.css";

const TrackList = ({ tracks, onAdd, onRemove }) => {
  return (
    <div className="track-list">
      {tracks.map((track) => (
        <div className="trackContainer">
          <Track
            id={track.id}
            track={track}
            onRemove={onRemove}
            onAdd={onAdd}
            isRemoval={true}
          />
        </div>
      ))}
    </div>
  );
};

export default TrackList;
