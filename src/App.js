import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import TrackList from "./components/TrackList";
import Playlist from "./components/Playlist";
import Search from "./components/Search";
import AuthButton from "./components/AuthButton";
import UserProfile from "./components/UserProfile";
import axios from "axios";
import SpotifyCallback from "./components/SpotifyCallback";

// Help function to get cookie by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User Profile Fetched:", response.data); // Debug log
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  useEffect(() => {
    if (userProfile) {
      navigate("/");
    }
  }, [userProfile, navigate]);

  const handleAccessToken = (access_token, refresh_token, expires_in) => {
    setAccessToken(access_token); // Set access token in state
    fetchUserProfile(access_token); // Fetch user profile
    console.log("Access Token Set:", access_token); // Debug log
  };

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("access_token");
    if (tokenFromStorage) {
      setAccessToken(tokenFromStorage);
      fetchUserProfile(tokenFromStorage); // Fetch profile if token exists
    }
  }, []);

  // Debugging Tools Adds to above
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code");

    if (code && !accessToken) {
      // Exchange the code for an access token
      axios
        .post("http://localhost:3001/callback", { code }) // Update to backend's port
        .then((response) => {
          const { access_token } = response.data;
          setAccessToken(access_token);
          fetchUserProfile(access_token);
          // // After handling, clear the URL query and redirect to home
        })
        .catch((error) => {
          console.error("Error exchanging code for token:", error);
        });
    } else {
      const tokenFromCookie = getCookie("access_token");
      if (tokenFromCookie) {
        setAccessToken(tokenFromCookie);
        fetchUserProfile(tokenFromCookie);
      }
    }
  }, [accessToken, navigate]);

  // Function to handle logout
  const handleLogout = () => {
    setAccessToken(null);
    setUserProfile(null);
    navigate("/"); // Redirect to home after logout
  };

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
  // Track pageload state for Header Text
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [savedPlaylistName, setSavedPlaylistName] = useState("New Playlist");
  const [searchResults] = useState([]);
  const [isPlaylistSaved, setIsPlaylistSaved] = useState(false); // New state

  const [playlistTracks, setPlaylistTracks] = useState([]);

  // Extract URI from playlistTracks state object
  const getTrackUris = () => {
    return playlistTracks.map((track) => track.uri);
  };
  const savePlaylist = () => {
    const uris = getTrackUris();
    console.log("Saving these URIs to Spotify:", uris);
    // Reset State of playlistTracks to be an Empty Array
    setPlaylistTracks([]);
    setIsPlaylistSaved(true); // Mark playlist as saved
    return `Custom Playlist Saved Successfully`;
  };

  const handleCreateNewPlaylist = () => {
    setIsPlaylistSaved(false);
    setPlaylistTracks([]);
    setPlaylistName("");
    setSavedPlaylistName("New Playlist");
    setIsInitialLoad(true);
  };
  const resetPlaylist = () => {
    setPlaylistTracks([]);
    setPlaylistName("");
    setIsInitialLoad(true);
    setSavedPlaylistName("New Playlist");
    setIsPlaylistSaved(false);
  };
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
      <Routes>
        <Route
          path="/"
          element={
            userProfile ? (
              <UserProfile profile={userProfile} onLogout={handleLogout} />
            ) : (
              <AuthButton />
            )
          }
        />

        <Route
          path="/callback"
          element={<SpotifyCallback onAccessToken={handleAccessToken} />}
        />
      </Routes>

      <div className="container">
        <div className="row border1">
          <div className="column left-col">
            {/* Search Module */}
            <Search onSearch={parseQuery} onAdd={addTrack} />
            {/* Results of Search in Tracklist format */}
            <TrackList tracks={searchResults} onAdd={addTrack} />
          </div>

          <div className="column border2 right-col">
            {isPlaylistSaved ? (
              <div>
                <h3>Your playlist has been saved!</h3>
                <p>Would you like to create another playlist?</p>
                <button onClick={resetPlaylist}>Create New Playlist</button>
              </div>
            ) : (
              <Playlist
                savedPlaylistName={savedPlaylistName}
                playlistName={playlistName}
                isInitialLoad={isInitialLoad}
                playlistTracks={playlistTracks}
                onNameChange={updatePlaylistName}
                saveEvent={savePlaylistName}
                onRemove={removeTrack}
                savePlaylist={savePlaylist}
                onCreateNewPlaylist={handleCreateNewPlaylist}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
