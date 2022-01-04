import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlist";
import Song from "./Song";

const Songs = () => {
  const playlist = useRecoilValue(playlistState);

  return (
    <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
      {playlist?.tracks?.items.map((item, idx) => {
        return <Song key={`${idx}`} order={idx} track={item} />;
      })}
    </div>
  );
};

export default Songs;
