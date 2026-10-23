# Sign

## Sources

- Main: `server.mjs`
- `sign.mjs`
- `public/index.html`

## Public contract

`GET /` shows the sign: the `title` and `message` from `sign.mjs`, escaped into `public/index.html`. `GET /api/health` answers `{status: "ready"}`. The server listens on `--host` and `--port` when given (Preview), otherwise on the `HOST` and `PORT` environment variables (a deployment). A changed sign shows after a restart or a new release. The exercise has no dependencies.
