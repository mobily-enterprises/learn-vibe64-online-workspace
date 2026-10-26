# Your hosted Vibe64 workspace

Topic 0.1.1 teaches the screens and abilities a hosted Vibe64 workspace adds:
its projects and people, team AI, and deploying an app for real. Every lesson
is a **studio** lesson: Learn opens on the Management pages with the lesson's
step bar above them, and the lessons that deploy make their own practice
project. Its steps name hosted places (declared in `package.json`), so the
topic's lessons appear only on an installation that has them; on Online, the
steps for owner-only pages appear only for the owner.

## Learner and prerequisites

Someone who has taken **Welcome to Vibe64** and works in a hosted workspace,
as its owner or as a member. No coding is needed. The domain lesson needs a
domain the learner controls, or can be read along.

## Final practical ability

Find and use the workspace's Projects, Users and AI Accounts; explain who can
do what; deploy an app to a public address, change it, restore an earlier
release and take it offline; ask Colleague to watch a deployment; attach a
custom domain.

## Lesson order

| Order | Code | Lesson | Outcome | Steps |
| --- | --- | --- | --- | --- |
| 01 | V64-WORKSPACE-01 | Your workspace | Find Projects and Launcher; switch the Learn and Develop lists with **L**; know what Add project, Close and Delete do (Delete takes a deployed app offline). | 7 (2 self, 1 choice required) |
| 02 | V64-WORKSPACE-02 | People and team AI | Explain owner and members, find Users (owner) and AI Accounts, what team AI is and why members' coding messages wait for approval. | 7 (1 self, 2 choice required; Users steps owner only) |
| 03 | V64-WORKSPACE-03 | Deploy your app | Deploy the practice sign to a public address, visit it, deploy a change as a new release, know Restore and Take offline. | 10 (1 fact `deployment-live`, 3 self, 1 choice required) |
| 04 | V64-WORKSPACE-04 | Keep an eye on your app | Ask Colleague to watch the deployment, deploy and hear back when it is live; know what Colleague can watch and where logs are. | 8 (1 fact, 1 self, 1 choice required) |
| 05 | V64-WORKSPACE-05 | Your own domain (optional) | Add a custom domain, its TXT and CNAME records and Check DNS; know why the proof is needed. | 8 (1 fact, 1 choice required) |

Lessons 03 to 05 deploy the **sign** practice app (`training/exercises/sign-app`)
for real, each in a practice project of its own. Finishing, restarting or
deleting the lesson removes the practice project, and with it the deployment:
the app goes offline, its release services stop and its address and domains
are released.
