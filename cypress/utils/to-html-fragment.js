/**
 * @param {string} html
 */
export default function toHtmlFragment(html) {
  const el = document.createElement("div");
  el.innerHTML = html; // TODO How safe is this if not part of a document?
  const fragment = document.createDocumentFragment();
  el.childNodes.forEach((node) => fragment.appendChild(node));
  return fragment;
}
