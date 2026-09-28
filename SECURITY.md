# Chalk security writeup

## Finding: stored cross-site scripting (XSS)

Post bodies were inserted into HTML without escaping, then displayed through React's `dangerouslySetInnerHTML`. A member could post `<img src=x onerror="alert(document.domain)">`; when anyone later opened the wall, the browser would execute the event handler.

## Patch

`lib/markdown.js` now escapes user text before applying the supported markdown formatting. It also allows only same-site paths, anchors, and `http`/`https` URLs in markdown links. The tests in `test/markdown.test.js` cover normal formatting, escaped HTML, and a rejected `javascript:` URL.

## Architecture sketch

```text
Browser form -> Server Action -> SQLite -> Server Component
                 |                |
                 |                -> posts, users, sessions, officer_desk
                 -> reads chalk_session -> currentUser

Post text -> escape + supported markdown -> PostBody -> browser
Officer desk -> role check -> officer-only records
```

- Server: pages, server actions, SQLite, session lookup, role checks, markdown rendering, and redirects.
- Browser: forms and the `PostBody` client component, which receives safe generated HTML.
- `currentUser` reads `chalk_session`, then joins the session token to the user record.
- The compose action validates and saves the post, and the wall reads and renders it.
- Only officers can view the desk data or pin/unpin posts.
