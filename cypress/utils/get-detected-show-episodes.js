import retryUntil from "./retry-until";
import getCurrentShowEpisodes from "./get-current-show-episodes";
import getHardcodedEpisodes from "./get-hardcoded-episodes";

export default function getDetectedShowEpisodes() {
  return retryUntil(getCurrentShowEpisodes, {
    // The sweet spot between waiting enough for the data to be loaded, and not
    // waiting too much to not slow down the tests when no data is being loaded
    // TODO Consider not waiting at all when there are no pending requests
    timeout: 2000,
    fallback: () => {
      console.log(`🤖 falling back to hardcoded episodes`);
      return getHardcodedEpisodes();
    },
  });
}
