import getEpisodeCode from "../utils/get-episode-code";
import get$Episode from "../utils/get-episode";
import getSearchableSummarySnippet from "../utils/get-searchable-summary-snippet";
import getDetectedShowEpisodes from "../utils/get-detected-show-episodes";

const EPISODES_SAMPLE_SIZE = 10;
const baseUrl = "https://cyf-abcelen-tv.netlify.app/";

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

function getSelector() {
  return cy.get("select");
}

beforeEach(() => {
  cy.visit(baseUrl);
});

describe("Level 100", () => {
  it("shows all the episodes", () => {
    getDetectedShowEpisodes().then((episodes) => {
      episodes
        .slice(0, EPISODES_SAMPLE_SIZE)
        .forEach((episode) =>
          cy.wrap(get$Episode(episode)).should("be.visible")
        );
    });
  });

  it("credits TVmaze", () => {
    cy.contains("TVmaze");
  });
});

describe("Level 200", () => {
  it("includes a search input", () => {
    getSearchInput();
  });

  it("shows the episodes searched by name", () => {
    getDetectedShowEpisodes().then(([episode]) => {
      const text = episode.name;
      [text, text.toUpperCase()].forEach((text) => {
        search(text).then(() => {
          cy.wrap(get$Episode(episode)).should("be.visible");
        });
      });
    });
  });

  it("shows the episodes searched by summary", () => {
    getDetectedShowEpisodes().then(([episode]) => {
      const text = getSearchableSummarySnippet(episode);
      [text, text.toUpperCase()].forEach((text) => {
        search(text).then(() => {
          cy.wrap(get$Episode(episode)).should("be.visible");
        });
      });
    });
  });

  it("doesn't show non-searched episodes", () => {
    getDetectedShowEpisodes().then(([episode]) => {
      search(`🐙🐙🐙`).then(() => {
        cy.wrap(get$Episode(episode)).should("not.be.visible");
      });
    });
  });

  it("shows how many episodes match", () => {
    getDetectedShowEpisodes().then((episodes) => {
      cy.contains(episodes.length).then(($counter) => {
        search(episodes[0].name);
        cy.wrap($counter).contains(/(^|\D)1(\D|$)/);
      });
    });
  });
});

describe("Level 300", () => {
  it("includes a selector with all the episodes", () => {
    getSelector().then((selector) => {
      getDetectedShowEpisodes().then((episodes) => {
        episodes.slice(0, EPISODES_SAMPLE_SIZE).forEach((episode) => {
          cy.wrap(selector)
            .should("contain", getEpisodeCode(episode))
            .should("contain", episode.name);
        });
      });
    });
  });

  it.skip("makes the selected episode visible", () => {
    // TODO https://stackoverflow.com/questions/58713418/verify-element-is-within-viewport-with-cypress
  });
});
