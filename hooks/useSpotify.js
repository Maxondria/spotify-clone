import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import spotifyWebApi from "../lib/spotify";

const useSpotify = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      if (status === "unauthenticated" || Date.now() >= session.expires) {
        signIn();
      } else {
        spotifyWebApi.setAccessToken(session.user.accessToken);
      }
    }
  }, [session, status]);

  return spotifyWebApi;
};

export default useSpotify;
