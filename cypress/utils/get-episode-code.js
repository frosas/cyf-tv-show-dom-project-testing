/**
 * @param {Episode} episode
 */
export default function getEpisodeCode(episode) {
  const seasonCode = `S${String(episode.season).padStart(2, "0")}`;
  const numberCode = `E${String(episode.number).padStart(2, "0")}`;
  return `${seasonCode}${numberCode}`;
}
