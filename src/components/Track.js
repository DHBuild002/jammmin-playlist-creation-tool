import React from "react";

// import "./styles/Track.css";

const Track = ({ track, artist, album, onAdd, onRemove, isRemoval }) => {
  const handleAdd = () => {
    onAdd(track);
  };
  const handleRemove = () => {
    console.log("Remove Clicked");
    onRemove(track);
  };

  const renderAction = () => {
    if (isRemoval) {
      return (
        <button className="border-none rounded-full" onClick={handleRemove}>
          -
        </button>
      );
    }
    return (
      <button
        className="rounded bg-purple-900 h-8 w-8 text-white flex items-center align-center justify-center"
        onClick={handleAdd}
      >
        +
      </button>
    );
  };
  return (
    <>
      <div className="container mx-auto bg-pink-400 m-1 rounded">
        <div className="border-radius-20 flex flex-row m-6">
          <div className="container text-left w-full">
            <h2 className="font-bold text-left">{track.name}</h2>
            <p className="flex flex-column text-xs">
              {track.artist} {track.album}
            </p>
          </div>
          <div className="flex items-center">{renderAction()}</div>
        </div>
      </div>
    </>
  );
};

export default Track;
