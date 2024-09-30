import React from "react";
import Track from "./Track";
import "./styles/TrackList.css";

const TrackList = ({ tracks, onAdd, onRemove }) => {
  return (
    <>
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
    </>
  );
};

export default TrackList;
