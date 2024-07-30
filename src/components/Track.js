import React from "react";

import "./styles/Track.css";

const Track = ({ track, onAdd, onRemove }) => {
  const handleAdd = () => {
    onAdd(track);
  };
  const handleRemove = () => {
    onRemove(track);
  };

  const renderAction = () => {
    if (onRemove) {
      return (
        <button className="track-action" onClick={handleRemove}>
          Remove
        </button>
      );
    }
    return (
      <button className="track-action" onClick={handleAdd}>
        Add
      </button>
    );
  };
  return (
    <>
      <div className="trackContainer">
        <div className="track">
          <div className="track-info">
            <h2>{track.name}</h2>
            <p>
              {track.artist} | {track.album}
            </p>
          </div>
          {renderAction()}
        </div>
      </div>
    </>
  );
};

export default Track;
