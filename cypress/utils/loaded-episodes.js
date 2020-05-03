/** @type {Map<string, Array<Episode>>} */
const loadedEpisodes = new Map();

beforeEach(() => {
  loadedEpisodes.clear();
  cy.server();
  cy.route({
    url: "https://api.tvmaze.com/shows/*/episodes",
    onResponse: (/** @type {XMLHttpRequest & {url: string}} */ xhr) => {
      console.log(`🤖 storing show episodes`, xhr.url);
      loadedEpisodes.set(xhr.url, xhr.response.body);
    },
  });
});

export default loadedEpisodes;
