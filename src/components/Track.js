import React from "react";

const Track = ({ track, onAdd }) => {
  const handleAdd = () => {
    console.log("Add button clicked!");
    onAdd(track);
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
          <div className="buttonArea">
            <button className="add-track-btn" onClick={handleAdd}>
              +
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Track;
