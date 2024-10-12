import React, { useState } from "react";
import TrackList from "./TrackList";
// import "./styles/Playlist.css";
import { createPlaylistInUserAccount, getUserProfile } from "../Spotify";
// Icon List
import EditIcon from "@mui/icons-material/Edit";

const Playlist = ({
  onNameChange,
  playlistName,
  customTrackList,
  saveEvent,
  onRemove,
  token,
}) => {
  // Handle initial state class for save playlist name:
  // const savedNameClass = isInitialLoad ? "initial-state-input" : "";
  const handleFocus = (e) => {
    if (e.target.value) {
      e.target.value = "";
    }
  };
  const handleNameChange = (e) => {
    if (e) {
      onNameChange(e.target.value);
    } else {
      return;
    }
  };
  const handleNameSave = () => {
    saveEvent(playlistName);
    setIsInputVisible(false);
  };
  const handleEditClick = () => {
    setIsInputVisible(true);
  };

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
      }
      console.log("Track URIs: ", trackUris);

      // Create playlist and add tracks
      await createPlaylistInUserAccount(userId, playlistName, token, trackUris);
      console.log("Playlist saved successfully.");
    } catch (error) {
      console.log(playlistName);
      console.error("Error saving playlist:", error);
    }
  };

  const [isInputVisible, setIsInputVisible] = useState(false);

  return (
    <>
      <div className="">
        <div className="flex flex-row justify-center items-center text-2xl mt-4">
          {/* {/* <h2
            className="cursor-pointer mr-2 text-purple-950 border-b pb-1 border-y-white w-1/3"
            onClick={handleEditClick}
          > 
            isInputVisible ? 'Enter Text' : savedPlaylistName
          </h2> */}
          {isInputVisible ? (
            <input
              className="bg-white mr-5 w-1/2 rounded-lg text-sm p-1 cursor-pointer border-gray-400"
              value={playlistName}
              onChange={handleNameChange}
              onFocus={handleFocus}
              placeholder="Enter a name for your playlist..."
            />
          ) : (
            <h2
              className="cursor-pointer text-purple-950 border-b pb-1 border-b-white w-1/2 mr-3 mt-5"
              onClick={handleEditClick}
            >
              {playlistName}
            </h2>
          )}
          <EditIcon
            className="edit-icon border-purple-500 border-solid border-2 cursor-pointer text-purple-500 p-x bg-white rounded-lg text-whtie"
            onClick={handleEditClick}
          />
        </div>

        {isInputVisible && (
          <div>
            {/* <div className="row input-area">
              <input
                className="bg-white rounded-lg text-sm p-3 cursor-pointer border-gray-400"
                value={playlistName}
                onChange={handleNameChange}
                onFocus={handleFocus}
                placeholder="Enter a name for your playlist..."
              />
            </div> */}
            <div className="playlistTitle">
              <button
                className="border-solid border-purple-500 border-2 rounded w-1/2 mt-1 bg-white"
                onClick={handleNameSave}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
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
