import React, { useState, useEffect } from "react";
import "./App.css";
import "./components/styles/Spotify.css";
import Playlist from "./components/Playlist";
import TrackList from "./components/TrackList";
import Search from "./components/Search.js";
import "./components/styles/Search.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { loginToSpotify, getTokenFromUrl } from "./Spotify.js";

function UserAccess({ token, setToken }) {
  console.log(token);
  function logout() {
    localStorage.removeItem("spotify_access_token"); // Clear token from localStorage
    setToken(null);
    window.location.href = "/"; // Redirect to UserAccess after logging out
  }
  return token ? (
    <div className="spotify-container">
      <h1>Welcome!</h1>
      <p className="sub-text">You logged in with token:</p>
      <p className="token">{token}</p>
      <button className="btn spotify-btn" onClick={logout}>
        Log Out
      </button>
    </div>
  ) : (
    <div className="spotify-container">
      <h2 className="login-txt">Create a custom playlist</h2>
      <button
        className="btn spotify-btn"
        id="login-btn"
        onClick={loginToSpotify}
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
  // Login State
  const [token, setToken] = useState(
    localStorage.getItem("spotify_access_token")
  );

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("spotify_access_token");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage); // Set the token state if it exists
    }
  }, []);

  // // Set the initial state of tracks
  const [tracks] = useState([]);
  // ]);
  // const [playlistName, setPlaylistName] = useState("");

  // Track pageload state for Header Text
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
    setCustomTrackList((prevTracks) => {
      if (!prevTracks.some((t) => t.key === track.key)) {
        return [...prevTracks, track];
      }
      return prevTracks;
    });
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
      customTrackList.filter((existingTrack) => existingTrack.key !== track.key)
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
              element={<UserAccess token={token} setToken={setToken} />}
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
              {/* Search Module */}
              <Search onSearch={parseQuery} onAdd={addTrack} />
              {/* Results of Search in Tracklist format */}
              <TrackList tracks={searchResults} onAdd={addTrack} />
            </div>
            <div className="column border2 right-col">
              <Playlist
                savedPlaylistName={savedPlaylistName}
                playlistName={savedPlaylistName}
                isInitialLoad={isInitialLoad}
                savePlaylist={savePlaylist}
                customTrackList={customTrackList}
                saveEvent={savePlaylistName}
                onNameChange={updatePlaylistName}
                onRemove={removeTrack}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
