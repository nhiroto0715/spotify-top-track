import React, { useState, useEffect } from "react";
import axios from "axios";
import TrackList from "./components/TrackList";

function App() {
  const [token, setToken] = useState(null);
  const [tracks, setTracks] = useState([]);

  // URLパラメータからトークンを抽出
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/login";
  };

  const fetchTopTracks = async () => {
    if (!token) return;
    const res = await axios.get("http://127.0.0.1:5000/top-tracks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTracks(res.data.items);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">🎧 Your Spotify Top Tracks</h1>
      {!token ? (
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-lg"
        >
          Spotifyでログイン
        </button>
      ) : (
        <>
          <button
            onClick={fetchTopTracks}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mb-4"
          >
            ランキングを表示
          </button>
          <TrackList tracks={tracks} />
        </>
      )}
    </div>
  );
}

export default App;
