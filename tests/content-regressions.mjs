import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// The lessons' own words and the hosted names they use. The hosted product says
// Publish for the action and Staging for the environment, and names the
// Dashboard page that publishes to Staging Deploy; deploy-* places, app-on-staging
// and staging-running are Online's ids, which only beat targets, check facts and
// package.json name. Staging is never live: the app is running on Staging, and only
// Production, which no lesson here uses, is ever Live.
const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const topic = JSON.parse(await read('package.json')).vibe64Training;

// Public Vibe64's built-in places and activities; any other beat target is a
// hosted name the topic must declare.
const BUILT_IN = new Set(['preview', 'dashboard', 'database-erd', 'database-data', 'files', 'changes', 'git-log',
  'session-info', 'architecture', 'publish', 'chat', 'save', 'reload-preview', 'learning', 'lesson', 'lesson-bar',
  'courses', 'colleague', 'account-menu', 'account-settings', 'ai-setup', 'send-message', 'agent-finished',
  'file-opened', 'app-pressed', 'colleague-minimised']);
const BEAT = /^(show|do|check) ([a-z-]+)(?: [^:]+)?: (.*)$/u;

const visible = [];
const used = { places: new Set(), activities: new Set(), facts: new Set() };
const lessons = {};
const stepsUsing = new Map();
for (const entry of topic.lessons) {
  const lesson = JSON.parse(await read(entry.descriptor));
  const root = entry.descriptor.replace(/lesson\.json$/u, '');
  lessons[lesson.code] = lesson;
  visible.push([`${lesson.code} title`, lesson.title], [`${lesson.code} notes`, await read(root + lesson.notes)]);
  for (const step of lesson.steps) {
    const where = `${lesson.code}/${step.id}`;
    visible.push([`${where} title`, step.title]);
    if (step.check.kind === 'choice') visible.push([`${where} question`, [step.check.question, ...step.check.options].join('\n')]);
    if (step.check.kind === 'fact') used.facts.add(step.check.fact);
    const body = await read(root + step.body);
    const [prose, beats = ''] = body.split('```beats\n');
    visible.push([`${where} body`, prose]);
    for (const line of beats.replace(/```\s*$/u, '').split('\n').filter(Boolean)) {
      const [, kind, target, text] = line.match(BEAT) || assert.fail(`${where}: beat ${line}`);
      visible.push([`${where} beat`, text]);
      if (kind === 'check' || BUILT_IN.has(target)) continue;
      stepsUsing.set(target, [...stepsUsing.get(target) || [], step]);
      used[target === 'app-on-staging' ? 'activities' : 'places'].add(target);
    }
  }
}
visible.push(['outline', await read(topic.outline)]);
for (const path of ['sign.mjs', 'server.mjs', 'genesis/blueprint.md', 'genesis/subsystems.md', 'genesis/program/sign.md']) {
  visible.push([`sign-app ${path}`, await read(`training/exercises/sign-app/${path}`)]);
}
// Staging as a page: the Dashboard's, opened, found or worked in. Staging Env and
// an app's Staging (the environment it runs in) keep the name.
const STAGING_PAGE = /Dashboard → Staging|Staging page|\b(?:[Oo]pen|[Ii]n|then|found) (?:\*\*)?Staging\b(?!\*\* Env| Env)|project's Staging\b/u;
for (const [where, text] of visible) {
  const words = text.replace(/`[^`\n]+`/gu, '');
  for (const word of words.match(/deploy\w*/giu) || []) {
    assert.equal(word, 'Deploy', `${where} says Publish for the action and Deploy only for the page, not ${word}`);
  }
  assert.doesNotMatch(words, STAGING_PAGE, `${where} names the page Deploy; Staging is the environment`);
  assert.doesNotMatch(words, /production|test copy/iu, `${where} says Staging and test addresses, not Production or Test copy`);
  assert.doesNotMatch(words, /\b(?:is|was|goes|went|already)\s+live\b|\*\*live\*\*/iu, `${where} says the app is running on Staging; only Production is ever Live`);
}
console.log(`PASS: ${visible.length} learner-facing texts say Publish, Staging for the environment and Deploy for its page.`);

assert.deepEqual([...used.places].sort(), [...topic.places].sort(), 'the topic declares exactly the hosted places its beats use');
assert.deepEqual([...used.activities].sort(), [...topic.activities].sort(), 'the topic declares exactly the hosted activities its beats use');
assert.deepEqual([...used.facts].sort(), [...topic.facts].sort(), 'the topic declares exactly the facts its steps check');
// Online renamed these on 20 Nov 2026 (Staging's places deploy-staging-*, the activity app-on-staging and the fact
// staging-running); a lesson naming an old one points at nothing. Online's learningPlacesDrift checks the rest.
const RETIRED = new Set(['deploy-test-addresses', 'deploy-address', 'deploy-releases', 'app-deployed', 'deployment-live']);
for (const id of [...topic.places, ...topic.activities, ...topic.facts]) {
  assert.ok(!RETIRED.has(id), `${id} is a name Online retired: use its Staging name (deploy-staging-*, app-on-staging, staging-running)`);
}
console.log('PASS: the topic declares exactly the hosted places, activities and facts its lessons use.');

// Each lesson that publishes the sign names the Deploy page, its button and the confirmation.
for (const code of ['V64-WORKSPACE-03', 'V64-WORKSPACE-04', 'V64-WORKSPACE-05']) {
  const step = lessons[code].steps.find(entry => entry.check.fact === 'staging-running');
  assert.equal(step.required, true, `${code} publishes the sign`);
  const body = await read(`training/lessons/${code}/${step.body}`);
  assert.match(body, /\*\*Publish to staging\*\*/u, code);
  assert.match(body, /\*\*Publish\*\*/u, code);
  assert.match(body, /^show deploy-staging: Press Publish to staging.*Publish/mu, code);
  if (code !== 'V64-WORKSPACE-03') {
    assert.match(body, /\*\*Dashboard → Deploy\*\*/u, code);
    assert.match(body, /^do deploy: Open your practice project's Deploy page\.$/mu, code);
  }
}
// Lesson 03 finds the page first: Dashboard, then Deploy.
const openDeploy = lessons['V64-WORKSPACE-03'].steps.find(entry => entry.id === 'open-deploy');
assert.equal(openDeploy.title, 'Find Deploy');
const openDeployBody = await read(`training/lessons/V64-WORKSPACE-03/${openDeploy.body}`);
assert.match(openDeployBody, /^Publishing is done from the project's \*\*Dashboard\*\*, in \*\*Deploy\*\*\./mu);
assert.match(openDeployBody, /^do deploy: Open Dashboard, then Deploy\.$/mu);
// Lesson 03 says Staging never acts for real and sends email and SMS only to the owner's test
// addresses, in an optional step, so the lesson stays where the Test addresses card is not
// registered yet.
const testAddresses = lessons['V64-WORKSPACE-03'].steps.find(entry => entry.id === 'test-addresses');
assert.equal(testAddresses.required, false);
const testAddressesBody = await read(`training/lessons/V64-WORKSPACE-03/${testAddresses.body}`);
assert.match(testAddressesBody, /^Staging never acts for real\./mu);
assert.match(testAddressesBody, /\*\*Test email address\*\*/u);
assert.match(testAddressesBody, /\*\*Test phone number\*\*/u);
assert.match(testAddressesBody, /^show deploy-staging-test-addresses: /mu);
assert.deepEqual(stepsUsing.get('deploy-staging-test-addresses'), [testAddresses], 'only the optional Test addresses step points at Test addresses');
console.log('PASS: the publishing lessons name Deploy, Publish to staging, Publish and the Test addresses.');
