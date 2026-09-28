const assert = require("node:assert/strict");
const test = require("node:test");
const { renderMarkdown } = require("../lib/markdown");

test("renders supported markdown", () => {
  assert.equal(renderMarkdown("## Shop\n**Open** *tonight* with `tools`"),
    "<h2>Shop</h2><br><strong>Open</strong> <em>tonight</em> with <code>tools</code>");
  assert.equal(renderMarkdown("[club](https://example.edu/events?team=robotics&day=wed)"),
    '<a href="https://example.edu/events?team=robotics&amp;day=wed">club</a>');
  assert.equal(renderMarkdown("[desk](/mod)"), '<a href="/mod">desk</a>');
});

test("escapes user HTML and rejects executable URL schemes", () => {
  const html = renderMarkdown('<img src=x onerror="alert(1)">');
  assert.match(html, /&lt;img/);
  assert.doesNotMatch(html, /<img/);
  assert.equal(renderMarkdown("[click](javascript:alert(1))"), "click)");
});
