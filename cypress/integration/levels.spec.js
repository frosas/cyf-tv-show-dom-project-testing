import getEpisodeCode from "../utils/get-episode-code";
import get$Episode from "../utils/get-episode";
import getSearchableSummarySnippet from "../utils/get-searchable-summary-snippet";
import retryUntil from "../utils/retry-until";
import getCurrentShowEpisodes from "../utils/get-current-show-episodes";

const baseUrl = "https://cyf-naderakhgari-tv.netlify.app/";

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

function getSelector() {
  return cy.get("select");
}

beforeEach(() => {
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
