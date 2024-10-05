import React, { useState, useEffect } from "react";
import Playlist from "./components/Playlist";
import TrackList from "./components/TrackList";
import Search from "./components/Search.js";

import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { loginToSpotify, getTokenFromUrl, getUserProfile } from "./Spotify.js";

function UserAccess({ token, setToken, setIsLoggedIn }) {
  // Profile State management
  const [user, setUser] = useState("");
  const [error, setError] = useState(null);
  const logout = () => {
    localStorage.removeItem("spotify_access_token"); // Clear token from localStorage
    setIsLoggedIn(false);
    setToken(null);
    window.location.href = "/"; // Redirect to UserAccess after logging out
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    loginToSpotify(); // Trigger the Spotify login process
  };

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const profile = await getUserProfile(token);
          setUser(profile);
          console.log(profile);
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
  // if (!user || !user.username) return <div>Loading...</div>; // Ensure user and username exist
  return token ? (
    <div className="spotify-container">
      <h1>Welcome, {user.username}</h1>
      <button
        className="w-1/2 bg-purple-700 border-green-500 text-white p-3 rounded-xl shadow-md hover:bg-purple-600 transition-all duration-300 ease-in-out"
        onClick={logout}
      >
        Log Out
      </button>
    </div>
  ) : (
    <div className="spotify-container">
      <h2 className="login-txt">Create a custom playlist</h2>
      <button
        className="w-50 bg-purple-700 border-white-500 text-white p-1 rounded-xl shadow-md hover:bg-purple-600 transition-all duration-300 ease-in-out"
        onClick={handleLogin}
      >
        Login to Spotify
      </button>
    </div>
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
    }
  }, [navigate, setToken]);

  return null; // You can return a loading spinner here if desired
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const storedToken = localStorage.getItem("spotify_access_token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [isLoggedIn]);

  const [token, setToken] = useState(
    localStorage.getItem("spotify_access_token")
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  // Login State

  // // Set the initial state of tracks
  const [tracks] = useState([]);

  // Search State
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  // Custom Playlist State
  const [savedPlaylistName, setSavedPlaylistName] = useState("New Playlist");
  const [customTrackList, setCustomTrackList] = useState([]);
  const [savedPlaylist, setSavedPlaylist] = useState([]);

  const parseQuery = (query) => {
    console.log("Track before filtering: ", tracks);
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
    console.log("Search Results:", searchResults); // Add this to check
  };
  const addTrack = (track) => {
    setCustomTrackList((prevTracks) =>
      prevTracks.some((t) => t.id === track.id)
        ? prevTracks
        : [...prevTracks, { ...track, localId: `${track.id}-${Date.now()}` }]
    );
  };

  const updatePlaylistName = (name) => {
    setSavedPlaylistName(name);
  };

  const savePlaylistName = (name) => {
    setSavedPlaylistName(name);
    setIsInitialLoad(false);
  };
  const savePlaylist = (customPlaylist) => {
    setSavedPlaylist(customTrackList);
    console.log(customPlaylist);
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
              element={
                <UserAccess
                  token={token}
                  setToken={setToken}
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            />
            <Route
              path="/callback"
              element={<Callback setToken={setToken} />}
            />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Router>
      </div>
      {token ? (
        <div className="container playlist-creator-area">
          <div className="row border1">
            <div className="column left-col">
              {/* Search Module - Handle what the user inputs into the searchbox */}
              <Search onSearch={parseQuery} onAdd={addTrack} />
              <TrackList
                tracks={searchResults}
                onAdd={addTrack}
                isRemoval={false}
              />
            </div>
            <div className="column border2 right-col">
              <Playlist
                savedPlaylistName={savedPlaylistName}
                playlistName={savedPlaylistName}
                isInitialLoad={isInitialLoad}
                savePlaylist={savePlaylist}
                saveEvent={savePlaylistName}
                onNameChange={updatePlaylistName}
                setSavedPlaylist={savedPlaylist}
                onRemove={removeTrack}
                customTrackList={customTrackList}
                token={token}
              />
            </div>
          </div>
        </div>
      ) : (
        " "
      )}
    </div>
  );
}

export default App;
