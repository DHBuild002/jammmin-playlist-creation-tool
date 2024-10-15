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

function UserAccess({ token, setToken }) {
  // Profile State management
  const [user, setUser] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use navigate instead of window.location

  const logout = () => {
    localStorage.removeItem("spotify_access_token"); // Clear token from localStorage
    console.log(token);
    setToken(null);
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
          setError("Failed to load user profile");
        }
      })();
    }
  }, [token]);

  // // Handle loading, error, or rendering the profile
  // if (error) {
  //   return <div>{error}</div>; // Display error message if fetch fails
  // }
  // if (!token || !user) return <div>Loading...</div>; // Ensure user and username exist

  return token ? (
    <div className="flex justify-end">
      <div className="flex justify-end items-center space-x-3 p-4 mx-auto w-full bg-slate-100">
        <h1 className="">Welcome, {user.username}</h1>
        <button
          className="w-20 bg-white-700 border-purple-700 border text-purple-700 p-1 rounded-xl shadow-sm hover:bg-grey-600 transition-all duration-300 ease-in-out"
          onClick={logout}
        >
          Log Out
        </button>
      </div>
    </div>
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

  return null; // You can return a loading spinner here if desired
}

function App() {
  const [token, setToken] = useState();

  const saveToken = (token) => {
    localStorage.setItem("spotify_access_token", token);
    setToken(token);
  };

  // On initial app load, retrieve the token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    console.log("Token in localStorage on app load:", storedToken);

    if (storedToken) {
      setToken(storedToken); // Restore the token to state
    } else {
      setToken(null);
    }
  }, []);

  // useEffect(() => {
  //   // Clear any stored token on initial load
  //   localStorage.removeItem("spotify_access_token");
  //   setToken(null); // Ensure the token state is also cleared

  //   // Optionally, you can redirect to the login route here if needed
  // }, []); // This will only run once on initial load

  // const handleLoginState = () => {
  //   const storedToken = localStorage.getItem("spotify_access_token");
  //   if (storedToken) {
  //     setToken(storedToken);
  //     setIsLoggedIn(true); // User is logged in if a valid token is found
  //   } else {
  //     setIsLoggedIn(false); // User is logged out
  //   }
  // };

  // // Login State
  // useEffect(() => {
  //   handleLoginState();
  // }, []);
  // useEffect(() => {
  //   if (token) {
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, [token]);

  // // After redirect from Spotify Login
  // useEffect(() => {
  //   const urlToken = getTokenFromUrl();
  //   if (urlToken) {
  //     localStorage.setItem("spotify_access_token", urlToken);
  //     setToken(urlToken);
  //   }
  // }, []);

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
  useEffect(() => {}, [customTrackList]);

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

  return (
    <div className="App">
      <header className="purple-strip"></header>
      <div className="route-container">
        <Router>
          <Routes>
            <Route
              path="/"
              element={<UserAccess token={token} setToken={saveToken} />}
            />
            <Route
              path="/callback"
              element={<Callback setToken={setToken} />}
            />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Router>
      </div>

      {/* Render this part only if the user is authenticated (user state has a value) */}
      {
        <div className="w-full mt-6">
          <div className="flex gap-3 justify-center w-full">
            <div className="column left-col rounded-lg">
              {/* Search Module - Handle what the user inputs into the searchbox */}
              <Search onSearch={parseQuery} onAdd={addTrack} />
              <TrackList
                tracks={searchResults}
                onAdd={addTrack}
                isRemoval={false}
              />
            </div>
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
              />
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
