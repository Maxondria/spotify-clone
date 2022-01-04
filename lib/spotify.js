import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-private",
  "streaming",
  "user-library-read",
  "user-read-currently-playing",
  "user-top-read",
  "user-follow-read",
  "user-read-recently-played",
  "user-modify-playback-state",
  "user-read-playback-state",
].join(",");

const params = { scope: scopes };

const qs = new URLSearchParams(params);

const LOGIN_URL = `https://accounts.spotify.com/authorize?${qs.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
});

export { spotifyApi as default, LOGIN_URL };
