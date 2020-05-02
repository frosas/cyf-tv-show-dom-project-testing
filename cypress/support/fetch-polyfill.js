// From https://github.com/cypress-io/cypress-example-recipes/tree/d09928f/examples/stubbing-spying__window-fetch

/** @type {string} */
let polyfill;

before(() => {
  cy.request("https://unpkg.com/unfetch/polyfill").then((response) => {
    polyfill = response.body;
  });
});

Cypress.on("window:before:load", (win) => {
  delete win.fetch;
  win.eval(polyfill);
});
