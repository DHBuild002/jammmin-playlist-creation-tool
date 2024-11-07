import React, { useState, useEffect } from "react";
import CustomPlaylistName from "./components/CustomPlaylistName.js";
import Playlist from "./components/Playlist";
import LogIn from "./components/LogIn.js";

import TrackList from "./components/TrackList";
import Search from "./components/Search.js";

import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { getTokenFromUrl, getUserProfile } from "./Spotify.js";

function UserAccess({
  token,
  setToken,
  parseQuery,
  searchResults,
  addTrack,
  customTrackList,
  removeTrack,
  updatePlaylistName,
  savedPlaylistName,
  assignNewPlaylistName,
}) {
  // Profile State management
  const [user, setUser] = useState("");
  const navigate = useNavigate(); // Use navigate instead of window.location

  const logout = () => {
    localStorage.removeItem("spotify_access_token"); // Clear token from localStorage
    console.log(token);
    setToken("");
    console.log("Logout clicked!");
    navigate("/");
  };

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const profile = await getUserProfile(token);
          setUser(profile);
        } catch (error) {
          console.error("Failed to load user profile");
        }
      })();
    } else {
      setUser("");
    }
  }, [token]);

  // // Handle loading, error, or rendering the profile
  // if (error) {
  //   return <div>{error}</div>; // Display error message if fetch fails
  // }
  // if (!token || !user) return <div>Loading...</div>; // Ensure user and username exist

  return token ? (
    <>
      <div className="flex justify-end">
        <div className="flex justify-end items-center space-x-3 p-4 mx-auto w-full bg-violet-400">
          <h1 className="font-bold">
            Welcome, {user.username} (Developer Mode - Please request to be
            added to our approved users list before using this app)
          </h1>
          <button
            className="w-20 bg-white-700 border-purple-700 border text-purple-700 p-1 rounded-xl shadow-sm hover:bg-grey-600 transition-all duration-300 ease-in-out"
            onClick={logout}
          >
            Log Out
          </button>
        </div>
      </div>
      <AppControls
        token={token}
        parseQuery={parseQuery}
        searchResults={searchResults}
        addTrack={addTrack}
        customTrackList={customTrackList}
        removeTrack={removeTrack}
        updatePlaylistName={updatePlaylistName}
        savedPlaylistName={savedPlaylistName}
        assignNewPlaylistName={assignNewPlaylistName}
      />
    </>
  ) : (
    <LogIn />
  );
}
// Callback component that retrieves the token and stores it in localStorage
function Callback({ setToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getTokenFromUrl();

    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);
      setToken(accessToken); // Set the token state
      navigate("/");
    } else {
      console.error("Access token not found in URL"); // Add error handling
      navigate("/login"); // Optionally navigate to a login page if token is not found
    }
  }, [navigate, setToken]);
}
function AppControls({ token }) {
  // // Set the initial state of tracks
  const [tracks] = useState([]);

  // Search State
  // const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  // Custom Playlist State
  const [savedPlaylistName, setSavedPlaylistName] = useState();
  const [customTrackList, setCustomTrackList] = useState([]);
  // const [savedPlaylist, setSavedPlaylist] = useState([]);

  const parseQuery = (query) => {
    const lowercaseQuery = query.toLowerCase();

    const searchResults = tracks.filter((track) => {
      const lowercaseName = track.name.toLowerCase();
      const lowercaseArtist = track.artist.toLowerCase();
      const lowercaseAlbum = track.album.toLowerCase();

      return (
        lowercaseName.includes(lowercaseQuery) ||
        lowercaseArtist.includes(lowercaseQuery) ||
        lowercaseAlbum.includes(lowercaseQuery)
      );
    });
    setSearchResults(searchResults);
  };
  const addTrack = (track) => {
    setCustomTrackList((prevTracks) =>
      prevTracks.some((t) => t.id === track.id)
        ? prevTracks
        : [
            ...prevTracks,
            {
              ...track,
              uri: `spotify:track:${track.id}`,
              localId: `${track.id}-${Date.now()}`,
            },
          ]
    );
  };
  const updatePlaylistName = (name) => {
    setSavedPlaylistName(name);
  };

  const assignNewPlaylistName = (playlistName) => {
    setSavedPlaylistName(playlistName);
    // setIsInitialLoad(false);
  };
  const removeTrack = (track) => {
    console.log("Removing Track...");
    setCustomTrackList(
      customTrackList.filter((existingTrack) => existingTrack.id !== track.id)
    );
  };
  useEffect(() => {}, [customTrackList]);
  return (
    <div className="w-full mt-6">
      <div className="flex gap-3 justify-center w-full">
        <div className="column left-col rounded-lg">
          {/* COLUMN 1 */}
          <Search onSearch={parseQuery} onAdd={addTrack} />
          <TrackList
            tracks={searchResults}
            onAdd={addTrack}
            isRemoval={false}
          />
        </div>

        {/* COLUMN 2 */}
        <div className="column border2 right-col rounded-lg">
          <CustomPlaylistName
            playlistName={savedPlaylistName}
            onNameChange={updatePlaylistName}
            saveEvent={assignNewPlaylistName}
          />

          <Playlist
            customTrackList={customTrackList}
            onRemove={removeTrack}
            token={token}
            playlistName={savedPlaylistName}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState("");

  const saveToken = (token) => {
    // localStorage.clear();
    localStorage.setItem("spotify_access_token", token);
    setToken(token);
  };

  // useEffect(() => {
  //   if (!token) {
  //     localStorage.clear(); // Clear localStorage if no token is set
  //   }
  // }, [token]);

  // // On initial app load, retrieve the token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    console.log("Token in localStorage on app load:", storedToken);
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.log("No token found. Potential Initial load or server error...");
    }
  }, [token]);

  // // // Set the initial state of tracks
  // const [tracks] = useState([]);

  // // Search State
  // // const [isInitialLoad, setIsInitialLoad] = useState(true);
  // const [searchResults, setSearchResults] = useState([]);

  // // Custom Playlist State
  // const [savedPlaylistName, setSavedPlaylistName] = useState();
  // const [customTrackList, setCustomTrackList] = useState([]);
  // // const [savedPlaylist, setSavedPlaylist] = useState([]);

  // const parseQuery = (query) => {
  //   const lowercaseQuery = query.toLowerCase();

  //   const searchResults = tracks.filter((track) => {
  //     const lowercaseName = track.name.toLowerCase();
  //     const lowercaseArtist = track.artist.toLowerCase();
  //     const lowercaseAlbum = track.album.toLowerCase();

  //     return (
  //       lowercaseName.includes(lowercaseQuery) ||
  //       lowercaseArtist.includes(lowercaseQuery) ||
  //       lowercaseAlbum.includes(lowercaseQuery)
  //     );
  //   });
  //   setSearchResults(searchResults);
  // };
  // const addTrack = (track) => {
  //   setCustomTrackList((prevTracks) =>
  //     prevTracks.some((t) => t.id === track.id)
  //       ? prevTracks
  //       : [
  //           ...prevTracks,
  //           {
  //             ...track,
  //             uri: `spotify:track:${track.id}`,
  //             localId: `${track.id}-${Date.now()}`,
  //           },
  //         ]
  //   );
  // };
  // useEffect(() => {}, [customTrackList]);

  // const updatePlaylistName = (name) => {
  //   setSavedPlaylistName(name);
  // };

  // const assignNewPlaylistName = (playlistName) => {
  //   setSavedPlaylistName(playlistName);
  //   // setIsInitialLoad(false);
  // };
  // const removeTrack = (track) => {
  //   console.log("Removing Track...");
  //   setCustomTrackList(
  //     customTrackList.filter((existingTrack) => existingTrack.id !== track.id)
  //   );
  // };
  return (
    <div className="App">
      <header className="purple-strip"></header>
      <div className="route-container">
        <Router>
          <Routes>
            <Route
              path="/"
              element={<UserAccess token={token} setToken={saveToken} />}
            >
              <Route index element={<AppControls />}></Route>
            </Route>

            <Route
              path="/callback"
              element={<Callback token={token} setToken={saveToken} />}
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
