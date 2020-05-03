export default function getWindow() {
  const document = Cypress.$("html").get(0).ownerDocument;
  if (!document) throw new Error("🐞");
  const window = document.defaultView;
  if (!window) throw new Error("🐞");
  return window;
}
