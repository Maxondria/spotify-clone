import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentTrackIdState } from "../atoms/song";
import useSpotify from "./useSpotify";

const useSongInfo = () => {
  const spotify = useSpotify();
  const currentTrackId = useRecoilValue(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    if (currentTrackId) {
      spotify.getTrack(currentTrackId).then((track) => setSongInfo(track.body));
    }
  }, [currentTrackId, spotify]);

  return songInfo;
};

export default useSongInfo;
