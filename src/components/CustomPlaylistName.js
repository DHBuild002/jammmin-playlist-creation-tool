import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

const CustomPlaylistName = ({ saveEvent, onNameChange }) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  // Handle initial state class for save playlist name:
  // const savedNameClass = isInitialLoad ? "initial-state-input" : "";
  const handleFocus = (e) => {
    if (e.target) {
      e.target.placeholder = "";
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
    console.log(playlistName);
  };
  const handleEditClick = () => {
    setIsInputVisible(true);
  };
  return (
    <div className="flex flex-row rounded-lg bg-white h-25 m-2 drop-shadow-lg border-gray-400">
      <div className="flex-row w-full border-gray-400">
        <div className="flex justify-between items-center text-2xl mt-0 mb-5">
          {/* {/* <h2
        className="cursor-pointer mr-2 text-purple-950 border-b pb-1 border-y-white w-1/3"
        onClick={handleEditClick}
      > 
        isInputVisible ? 'Enter Text' : savedPlaylistName
      </h2> */}
          {isInputVisible ? (
            <div className="flex flex-col m-5 w-full justify-center items-center">
              <input
                className="bg-white focus:outline-none focus:ring focus:ring-violet-300 focus:bg-white active:border-purple-400 placeholder:text-slate-400 border border-purple-500 m-1 w-2/3 rounded-lg text-sm p-1 cursor-pointer"
                value={playlistName}
                onChange={handleNameChange}
                onFocus={handleFocus}
                placeholder="Enter a name for your playlist..."
              />
              <button
                className="border border-purple-300 rounded-lg p-1 m-1 text-sm ml-4"
                onClick={handleNameSave}
              >
                Save Name
              </button>
            </div>
          ) : (
            <div className="flex flex-row w-full justify-center items-center">
              <h2
                className="cursor-pointer text-purple-950 border-b pb-7 mt-7 border-b-white w-3/6 mr-0"
                onClick={handleEditClick}
              >
                {playlistName}
                <hr className="mt-1 mr-1"></hr>
              </h2>
              <EditIcon
                className="border-purple-500 ml-0 border-solid border-2 p-x static cursor-pointer text-purple-500 bg-white rounded-lg"
                onClick={handleEditClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomPlaylistName;