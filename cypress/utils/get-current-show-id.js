import get$Episode from "./get-episode";
import loadedEpisodes from "./loaded-episodes";

export default function getCurrentShowId() {
  for (const [id, [episode]] of loadedEpisodes) {
    if (get$Episode(episode)) return id;
  }
}
