import React from "react";

const Track = ({ track, onAdd }) => {
  const handleAdd = () => {
    console.log("Add button clicked!");
    onAdd(track);
  };
  return (
    <>
      <div className="track">
        <h2>{track.name}</h2>
        <p>
          {track.artist} | {track.album}
        </p>
      </div>
      <button className="add-track-btn" onClick={handleAdd}>
        Add
      </button>
    </>
  );
};

export default Track;
