import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

const CustomPlaylistName = ({ saveEvent, onNameChange }) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  // Handle initial state class for save playlist name:
  // const savedNameClass = isInitialLoad ? "initial-state-input" : "";
  const handleFocus = (e) => {
    if (e.target.value) {
      e.target.value = "";
    }
  };
  const handleNameChange = (e) => {
    const name = e.target.value;
    setPlaylistName(name);
    if (onNameChange) {
      onNameChange(name);
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
  return (
    <div className="bg-white mb-5">
      <div className="">
        <div className="flex flex-row justify-center items-center text-2xl mt-4">
          {/* {/* <h2
        className="cursor-pointer mr-2 text-purple-950 border-b pb-1 border-y-white w-1/3"
        onClick={handleEditClick}
      > 
        isInputVisible ? 'Enter Text' : savedPlaylistName
      </h2> */}
          {isInputVisible ? (
            <div className="flex flex-col">
              <input
                className="bg-white border border-purple-500 m-5 w-full rounded-lg text-sm p-1 cursor-pointer"
                value={playlistName}
                onChange={handleNameChange}
                onFocus={handleFocus}
                placeholder="Enter a name for your playlist..."
              />
              <button
                className="border border-purple-300 rounded-lg p-2 m-8 text-sm"
                onClick={handleNameSave}
              >
                Save Name
              </button>
            </div>
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
      </div>
    </div>
  );
};

export default CustomPlaylistName;
