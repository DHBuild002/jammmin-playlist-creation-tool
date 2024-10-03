import React from "react";
import Track from "./Track";
import "./styles/TrackList.css";

const TrackList = ({ tracks, onAdd, onRemove, isRemoval }) => {
  return (
    <div className="container">
      {tracks.map((track) => (
        <div className="trackContainer" key={track.localId}>
          <Track
            id={track.id}
            track={track}
            onRemove={onRemove}
            onAdd={onAdd}
            isRemoval={isRemoval}
          />
        </div>
      ))}
    </div>
  );
};

export default TrackList;
