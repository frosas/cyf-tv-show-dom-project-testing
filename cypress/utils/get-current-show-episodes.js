import getCurrentShowId from "./get-current-show-id";
import loadedEpisodes from "./loaded-episodes";

export default function getCurrentShowEpisodes() {
  const id = getCurrentShowId();
  if (id) {
    const episodes = loadedEpisodes.get(id);
    if (episodes) return episodes;
    throw new Error("🐞");
  }
}
