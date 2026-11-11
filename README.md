# Your hosted Vibe64 workspace — topic 0.1.2 (preview)

Canonical topic source for `mobily-enterprises/learn-vibe64-online-workspace`,
the hosted lessons of the course **Getting started with Vibe64**. Publishing
this source does not install or enable a learner release; course pins are
prepared separately in the official catalogue.

Lessons use lesson format 3 (`stage: "studio"`). See public Vibe64's
`docs/training-content.md` for the format and the `vibe64 training` CLI.
[The outline](training/outline.md) lists the lessons.

## Hosted places

The topic declares the places and facts it uses that only a hosted Vibe64
provides (`vibe64Training.places` and `facts` in `package.json`). Vibe64
Online's `tests/server/learningPlacesDrift.unit.test.js` checks that each one
is registered there; run it with this checkout beside the Online checkout or
with `VIBE64_HOSTED_TOPIC_ROOTS` naming it.

## Check the content

```sh
vibe64 training validate .
npm test
```

`npm test` starts the sign practice app the way Preview does (arguments) and
the way Production does (`HOST` and `PORT`) and checks its page and health
route, then checks the lessons' wording and the hosted places they use. It
needs Node.js 22 or newer and no dependencies.

## Publishing for real

Lessons 03 to 05 publish their practice app to Production for real, as a Test
copy. The hosted workspace takes the app offline and removes it when the
practice project is removed: when the lesson is finished, restarted or deleted.

The hosted product says Publish and Production; the place, activity and fact
names (`deploy`, `deploy-production`, `app-deployed`, `deployment-live` and
the rest) are Online's own ids and stay as they are.
