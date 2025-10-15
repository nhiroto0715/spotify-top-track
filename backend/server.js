import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import querystring from "querystring";

const app = express();
app.use(cors());

// --- Spotify APIの設定 ---
const client_id = "c0f41b509b5049cb83f00f1e4b982ea6";
const client_secret = "7ccef173f54148d6b156e3e8ed7b2991";
const redirect_uri = "http://127.0.0.1:5000/callback";

// ✅ トップページ（これがないと "Cannot GET /" が出る）
app.get("/", (req, res) => {
  res.send(`
    <h2>🎵 Spotify Top Tracks App</h2>
    <p><a href="/login">Spotifyでログインする</a></p>
  `);
});

// --- Spotifyログイン ---
app.get("/login", (req, res) => {
  const scope = "user-top-read";
  const auth_url =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
    });
  res.redirect(auth_url);
});

// --- コールバック ---
app.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: querystring.stringify({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    }),
  });

  const data = await response.json();
  const access_token = data.access_token;

  // トップトラックページに遷移
  res.redirect(`/top-tracks?access_token=${access_token}`);
});

// --- 上位トラック取得 ---
app.get("/top-tracks", async (req, res) => {
  const access_token = req.query.access_token;
  const api_url = "https://api.spotify.com/v1/me/top/tracks?limit=10";

  const response = await fetch(api_url, {
    headers: { Authorization: "Bearer " + access_token },
  });

  const data = await response.json();
  res.json(data);
});

// --- サーバー起動 ---
app.listen(5000, "127.0.0.1", () => {
  console.log("✅ Server running on http://127.0.0.1:5000");
});
