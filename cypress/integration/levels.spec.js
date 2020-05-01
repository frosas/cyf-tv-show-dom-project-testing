/// <reference types="cypress" />

const siteUrl = "https://cyf-banirezaie-tv.netlify.app/";

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
function getHtmlText(html) {
  const el = document.createElement("div");
  el.innerHTML = html; // TODO How safe is this if not part of a document?
  return el.innerText;
}

describe("Levels", () => {
  beforeEach(() => {
    cy.visit(siteUrl);
  });

  it("shows all the episodes (level 100)", () => {
    cy.window().then((win) => {
      win.getAllEpisodes().map(async (episode) => {
        cy.contains(episode.name);
        cy.contains(getEpisodeCode(episode));
        cy.get(`img[src="${episode.image.medium}"]`); // TODO Encode it
        expect(win.document.body).to.include.text(getHtmlText(episode.summary));
      });
    });
  });

  it("credits TVmaze (level 100+)", () => {
    cy.window().then((win) => {
      cy.contains("TVmaze");
    });
  });
});
