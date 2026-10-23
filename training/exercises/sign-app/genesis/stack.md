# Stack

## Stack packages

- `genesis-stack`

## Components

- `nodejs`

## Verification

- Verify `JavaScript syntax`: `npm` `run` `check`

## Workspace setup

- Prepare `Check server syntax` with `nodejs`: `node` `--check` `server.mjs`

## Connected development

- Default package type: `npm`

## Outputs

### Target `app`: Shop sign

- Default.
- Mode: `interactive`
- Workdir: `.`
- Runtimes: `nodejs`
- Run `Start the sign`: `node` `server.mjs` `--host` `{host}` `--port` `{port}`

#### Presentation

- Kind: `web`
- Preferred port: `8080`
- URL path: `/`
- Ready when: `GET` `/api/health` returns `200`

## Deployment

- Runtimes: `nodejs`
- Serve `Start the sign`: `node` `server.mjs`
- Ready when: `GET` `/api/health` returns `200`
