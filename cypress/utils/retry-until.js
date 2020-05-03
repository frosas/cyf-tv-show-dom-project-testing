/**
 * @template T
 * @param {() => T | undefined} callback
 * @param {object} options
 * @param {number} [options.timeout]
 * @returns {Cypress.Chainable<T>}
 */
export default function retryUntil(callback, { timeout = 5000 } = {}) {
  const result = callback();
  if (result === undefined) {
    const WAIT_DURATION = 500; // ms
    timeout = Math.max(0, timeout - WAIT_DURATION);
    if (!timeout) throw new Error(`Timed out retrying ${callback.name}`);
    return cy.wait(WAIT_DURATION).then(() => retryUntil(callback, { timeout }));
  }
  return cy.wrap(result);
}
