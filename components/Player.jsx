import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
  ReplyIcon,
  PlayIcon,
  PauseIcon,
  FastForwardIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlaylingState } from "../atoms/song";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

const Player = () => {
  const spotify = useSpotify();
  const { data: session } = useSession();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlaylingState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotify
        .getMyCurrentPlayingTrack()
        .then(({ body = {} } = {}) => setCurrentTrackId(body?.item?.id));

      spotify
        .getMyCurrentPlaybackState()
        .then(({ body = {} } = {}) => setIsPlaying(body?.is_playing));
    }
    return songInfo;
  };

  const handlePlayPause = () =>
    spotify.getMyCurrentPlaybackState().then(({ body = {} } = {}) => {
      if (body.is_playing) {
        spotify.pause();
        setIsPlaying(false);
      } else {
        spotify.play();
        setIsPlaying(true);
      }
    });

  useEffect(() => {
    if (spotify?.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotify, session]);

  const debouncedVoulumeChange = useCallback(
    debounce((newVolume) => spotify.setVolume(newVolume), 500),
    []
  );

  useEffect(() => {
    if (volume > 0 && volume <= 100) {
      debouncedVoulumeChange(volume);
    }
  }, [volume]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />

        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon onClick={() => null} className="button" />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}

        <FastForwardIcon className="button" onClick={() => null} />
        <ReplyIcon className="button" />
      </div>

      {/* Volume */}
      <div className="flex items-center space-x-3 lg:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume((prevVol) => prevVol - 10)}
          className="button"
        />
        <input
          className="w-14 lg:w-28"
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={({ target: { value } }) => setVolume(+value)}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume((prevVol) => prevVol + 10)}
          className="button"
        />
      </div>
    </div>
  );
};

export default Player;
