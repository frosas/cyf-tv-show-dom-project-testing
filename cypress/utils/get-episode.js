import getEpisodeCode from "./get-episode-code";
import toHtmlFragment from "./to-html-fragment";

/**
 * @param {Episode} episode
 */
export default function get$Episode(episode) {
  /**
   * @param {JQuery<HTMLElement>} $candidate
   * @returns {JQuery<HTMLElement>}
   */
  function find$Episode($candidate) {
    if (!$candidate.length) return $candidate;
    const text = $candidate.text();
    const includesEverything =
      text.includes(episode.name) &&
      text.includes(getEpisodeCode(episode)) &&
      text.includes(toHtmlFragment(episode.summary).textContent || "");
    return includesEverything ? $candidate : find$Episode($candidate.parent());
  }

  const $img = Cypress.$(`img[src="${episode.image.medium}"]`); // TODO Encode it
  return find$Episode($img.parent());
}
