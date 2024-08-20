import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import TrackList from "./components/TrackList";
import Playlist from "./components/Playlist";
import Search from "./components/Search";
import AuthButton from "./components/AuthButton";

function App() {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("access_token");
    const refreshToken = queryParams.get("refresh_token");
    const expiresIn = queryParams.get("expires_in");

    if (accessToken && refreshToken && expiresIn) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("expires_in", expiresIn);

      // Redirect or update the UI accordingly
      console.log("Tokens stored and ready to use");
    }
  }, [location.search]);

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
  // const [testPlaylistTracks, setTestPlaylistTracks] = useState([
  //   {
  //     name: "Track 1",
  //     artist: {
  //       name: "Artist 1",
  //     },
  //     uri: "spotify:track:1",
  //     album: {
  //       name: "Greatest Hits 100",
  //     },
  //   },
  //   {
  //     name: "Track 2",
  //     artist: {
  //       name: "Artist 2",
  //     },

  //     uri: "spotify:track:2",
  //     album: {
  //       name: "Greatest Hits of 2024",
  //     },
  //   },
  // ]);
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
        <AuthButton />
      </header>
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

export default App;
