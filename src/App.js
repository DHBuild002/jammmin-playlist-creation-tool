import React, { useState, useEffect } from "react";
import "./App.css";
import "./components/styles/Spotify.css";
import Playlist from "./components/Playlist";
import TrackList from "./components/TrackList";
import Search from "./components/Search";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { loginToSpotify, getTokenFromUrl } from "./Spotify.js";

function HomePage() {
  const [token, setToken] = useState(localStorage.getItem("spotifyToken"));

  function logout() {
    localStorage.removeItem("spotifyToken"); // Clear token from localStorage
    window.location.href = "/"; // Redirect to homepage after logging out
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
function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getTokenFromUrl();
    if (accessToken) {
      localStorage.setItem("spotifyToken", accessToken);
      navigate("/");
    }
  }, [navigate]);

  return null; // You can return a loading spinner here if desired
}

function App() {
  //Login Logic
  // Set the initial state of tracks
  const [tracks] = useState([
    {
      id: 1,
      name: "Song One",
      artist: "Artist 1",
      album: "Album 1",
    },
    {
      id: 2,
      name: "Song Two",
      artist: "Artist 2",
      album: "Album 2",
    },
    {
      id: 3,
      name: "Song Three",
      artist: "Artist 3",
      album: "Album 3",
    },
  ]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  // Track pageload state for Header Text
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [savedPlaylistName, setSavedPlaylistName] = useState("New Playlist");
  const [searchResults, setSearchResults] = useState([]);

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
    return Promise.resolve(searchResults);
  };
  const addTrack = (track) => {
    setPlaylistTracks((prevTracks) => {
      if (!prevTracks.some((t) => t.id === track.id)) {
        return [...prevTracks, track];
      }
      return prevTracks;
    });
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylistName = (name) => {
    setSavedPlaylistName(name);
    setIsInitialLoad(false);
  };
  const removeTrack = (track) => {
    console.log("Removing Track...");
    setPlaylistTracks(
      playlistTracks.filter((existingTrack) => existingTrack.id !== track.id)
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Jammmin</h2>
      </header>
      <div className="route-container">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </Router>
      </div>
      <div className="container">
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
              playlistName={playlistName}
              isInitialLoad={isInitialLoad}
              playlistTracks={playlistTracks}
              onNameChange={updatePlaylistName}
              saveEvent={savePlaylistName}
              onRemove={removeTrack}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
