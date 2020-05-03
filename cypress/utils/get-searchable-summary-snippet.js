import toHtmlFragment from "./to-html-fragment";

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
export default function getSearchableSummarySnippet(episode) {
  let longestSnippet = "";
  visitNodeTree(toHtmlFragment(episode.summary), (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const snippet = node.textContent || "";
      if (snippet.length > longestSnippet.length) longestSnippet = snippet;
    }
  });

  if (!longestSnippet.length) throw new Error();

  // Avoid searching for very long texts to avoid any performance hit
  return longestSnippet.substr(0, 50);
}
