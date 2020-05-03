const baseUrl = "https://cyf-naderakhgari-tv.netlify.app/";

/**
 * @param {Episode} episode
 */
function getEpisodeCode(episode) {
  const seasonCode = `S${String(episode.season).padStart(2, "0")}`;
  const numberCode = `E${String(episode.number).padStart(2, "0")}`;
  return `${seasonCode}${numberCode}`;
}

/**
 * @param {string} html
 */
function toFragment(html) {
  const el = document.createElement("div");
  el.innerHTML = html; // TODO How safe is this if not part of a document?
  const fragment = document.createDocumentFragment();
  el.childNodes.forEach((node) => fragment.appendChild(node));
  return fragment;
}

/**
 * @param {Episode} episode
 */
function get$Episode(episode) {
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
      text.includes(toFragment(episode.summary).textContent || "");
    return includesEverything ? $candidate : find$Episode($candidate.parent());
  }

  const $img = Cypress.$(`img[src="${episode.image.medium}"]`); // TODO Encode it
  return find$Episode($img.parent());
}

function getSearchInput() {
  return cy.get("input");
}

/**
 * @param {string} text
 */
function search(text) {
  // TODO `force` is needed for https://cyf-banirezaie-tv.netlify.app/
  return getSearchInput().clear({ force: true }).type(text, { force: true });
}

function getAllEpisodes() {
  return cy.window().then((win) => win.getAllEpisodes());
}

/**
 * @param {Node} node
 * @param {(node: Node) => void} callback
 */
function visitNodeTree(node, callback) {
  callback(node);
  node.childNodes.forEach((child) => visitNodeTree(child, callback));
}

/**
 * @param {Episode} episode
 */
function getSearchableSummarySnippet(episode) {
  let longestSnippet = "";
  visitNodeTree(toFragment(episode.summary), (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const snippet = node.textContent || "";
      if (snippet.length > longestSnippet.length) longestSnippet = snippet;
    }
  });

  if (!longestSnippet.length) throw new Error();

  // Avoid searching for very long texts to avoid any performance hit
  return longestSnippet.substr(0, 50);
}

function getSelector() {
  return cy.get("select");
}

/** @type {Map<string, Array<Episode>>} */
let episodesByShow;

beforeEach(() => {
  episodesByShow = new Map();
  cy.server();
  cy.route({
    url: "https://api.tvmaze.com/shows/*/episodes",
    onResponse: (/** @type {XMLHttpRequest & {url: string}} */ xhr) => {
      console.log(`🤖 storing show episodes`, xhr.url);
      episodesByShow.set(xhr.url, xhr.response.body);
    },
  });
  cy.visit(baseUrl);
});

describe("Level 100", () => {
  it("shows all the episodes (levels 100-300)", () => {
    getAllEpisodes().then((episodes) => {
      episodes.forEach((episode) =>
        cy.wrap(get$Episode(episode)).should("be.visible")
      );
    });
  });

  it("credits TVmaze (level 100+)", () => {
    cy.contains("TVmaze");
  });
});

describe("Level 200", () => {
  describe("Search", () => {
    it("includes input (levels 200+)", () => {
      getSearchInput();
    });

    it("shows the episodes with a matching name (level 200+)", () => {
      getAllEpisodes().then(([episode]) => {
        const text = episode.name;
        [text, text.toUpperCase()].forEach((text) => {
          search(text).then(() => {
            cy.wrap(get$Episode(episode)).should("be.visible");
          });
        });
      });
    });

    it("shows the episodes with a matching summary (level 200+)", () => {
      getAllEpisodes().then(([episode]) => {
        const text = getSearchableSummarySnippet(episode);
        [text, text.toUpperCase()].forEach((text) => {
          search(text).then(() => {
            cy.wrap(get$Episode(episode)).should("be.visible");
          });
        });
      });
    });

    it("doesn't show non-matching episodes (level 200+)", () => {
      getAllEpisodes().then(([episode]) => {
        search(`🐙🐙🐙`).then(() => {
          cy.wrap(get$Episode(episode)).should("not.be.visible");
        });
      });
    });

    it("shows how many episodes match (levels 200+)", () => {
      getAllEpisodes().then((episodes) => {
        cy.contains(episodes.length).then(($counter) => {
          search(episodes[0].name);
          cy.wrap($counter).contains(/(^|\D)1(\D|$)/);
        });
      });
    });
  });
});

describe("Level 300", () => {
  describe("Episode selector (levels 300+)", () => {
    it("includes selector with all the episodes (levels 300+)", () => {
      getAllEpisodes().then((episodes) => {
        getSelector()
          .get("option")
          .then((options) => {
            episodes.forEach((episode) => {
              cy.wrap(options).contains(
                `${getEpisodeCode(episode)} - ${episode.name}`
              );
            });
          });
      });
    });

    it.skip("makes the selected episode visible", () => {
      // TODO https://stackoverflow.com/questions/58713418/verify-element-is-within-viewport-with-cypress
    });
  });
});

function getCurrentShowId() {
  for (const [id, [episode]] of episodesByShow) {
    if (get$Episode(episode)) return id;
  }
}

function getCurrentShowEpisodes() {
  const id = getCurrentShowId();
  if (id) {
    const episodes = episodesByShow.get(id);
    if (episodes) return episodes;
    throw new Error("🐞");
  }
}

/**
 * @template T
 * @param {() => T | undefined} callback
 * @param {object} options
 * @param {number} [options.timeout]
 * @returns {Cypress.Chainable<T>}
 */
function retryUntil(callback, { timeout = 5000 } = {}) {
  const result = callback();
  if (result === undefined) {
    const WAIT_DURATION = 500; // ms
    timeout = Math.max(0, timeout - WAIT_DURATION);
    if (!timeout) throw new Error(`Timed out retrying ${callback.name}`);
    return cy.wait(WAIT_DURATION).then(() => retryUntil(callback, { timeout }));
  }
  return cy.wrap(result);
}

describe("Level 350", () => {
  it("shows all the episodes (levels 350+)", () => {
    retryUntil(getCurrentShowEpisodes).then((episodes) => {
      episodes
        .slice(0, 10)
        .forEach((episode) =>
          cy.wrap(get$Episode(episode)).should("be.visible")
        );
    });
  });
});
