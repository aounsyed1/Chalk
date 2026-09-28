// Small markdown helper for club posts.
// Supports the handful of bits people actually type on a wall.

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeLinkTarget(value) {
  const target = String(value).trim();
  if (
    target.startsWith("/") && !target.startsWith("//") ||
    target.startsWith("#") ||
    /^https?:\/\//i.test(target)
  ) {
    return target;
  }
  return null;
}

function renderMarkdown(src) {
  const text = escapeHtml(src ?? "");

  return text
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, target) => {
      const href = safeLinkTarget(target);
      return href ? `<a href="${href}">${label}</a>` : label;
    })
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n/g, "<br>");
}

module.exports = { renderMarkdown };
