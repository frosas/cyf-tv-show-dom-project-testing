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
   * @returns {JQuery<HTMLElement>?}
   */
  function find$Episode($candidate) {
    if (!$candidate.length) return null;
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
  return getSearchInput().clear().type(text, { force: true });
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

beforeEach(() => cy.visit(""));

describe("Level 100", () => {
  it("shows all the episodes (level 100)", () => {
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
    it("includes input (level 200+)", () => {
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

    it("shows how many episodes match (200+)", () => {
      cy.contains(/\d+\s+episode/);
      getAllEpisodes().then(([episode]) => {
        search(episode.name).then(() => {
          cy.contains(/\D1\s+episode/);
        });
      });
    });
  });
});

describe("Level 300", () => {
  describe("Episode selector", () => {
    it("includes selector", () => {
      getSelector();
    });

    it("the selector lists all the episodes", () => {
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
  });
});
