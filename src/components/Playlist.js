import React from "react";
import TrackList from "./TrackList";
// import { playlistName } from "./CustomPlaylistName";
// import "./styles/Playlist.css";
import { createPlaylistInUserAccount, getUserProfile } from "../Spotify";

const Playlist = ({ customTrackList, onRemove, token, playlistName }) => {
  const savePlaylist = async () => {
    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }

    try {
      const userId = await getUserProfile(token); // Retrieve Spotify user ID

      const trackUris = customTrackList
        .map((track) => track.uri)
        .filter((uri) => uri !== undefined);

      if (trackUris.length === 0) {
        console.log("No valid URIs in the track list.");
        return;
      }
      console.log("Track URIs: ", trackUris);

      // Create playlist and add tracks
      await createPlaylistInUserAccount(userId, playlistName, token, trackUris);
      console.log("Playlist saved successfully.");
    } catch (error) {
      console.error("Error saving playlist:", error);
    }
  };

  return (
    <>
      <div className="customPlaylistArea">
        <TrackList
          tracks={customTrackList}
          onRemove={onRemove}
          isRemoval={true}
        />
        <button
          className="w-50 bg-purple-600 border-solid border-x border-white-500 m-10 text-white p-3 rounded-xl hover:bg-purple-800 transition-all duration-300 ease-in-out"
          onClick={savePlaylist}
        >
          Save your Playlist
        </button>
      </div>
    </>
  );
};
export default Playlist;
