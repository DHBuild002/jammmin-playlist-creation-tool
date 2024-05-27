import React from "react";
import Track from "./Track";

const TrackList = ({ tracks }) => {
  // const [tracks, setTracks] = useState("");
  return (
    <div>
      <hr></hr>
      <h2>All Tracks</h2>
      <hr></hr>
      {tracks.map((track) => (
        <Track key={track.id} track={track} />
      ))}
    </div>
  );
};

export default TrackList;
