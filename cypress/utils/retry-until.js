const WAIT_DURATION = 250; // ms

/**
 * @template T
 * @param {() => T | undefined} callback
 * @param {object} options
 * @param {number} [options.timeout]
 * @param {() => T} [options.fallback]
 * @returns {Cypress.Chainable<T>}
 *
 * TODO Rename to cyRetryUntil()
 */
export default function retryUntil(
  callback,
  { timeout = 5000, fallback } = {}
) {
  // TODO Consider using cy.verifyUpcomingAssertions() (see
  // https://github.com/Lakitna/cypress-commands/blob/develop/src/then.js)
  // and/or cy.retry() (see https://github.com/cypress-io/cypress/blob/master/packages/driver/src/cy/retries.coffee)
  fallback =
    fallback ||
    function defaultFallback() {
      throw new Error(`Timed out retrying ${callback.name}`);
    };
  const result = callback();
  if (result === undefined) {
    timeout = Math.max(0, timeout - WAIT_DURATION);
    if (!timeout) return cy.wrap(fallback());
    return cy
      .wait(WAIT_DURATION)
      .then(() => retryUntil(callback, { timeout, fallback }));
  }
  return cy.wrap(result);
}
