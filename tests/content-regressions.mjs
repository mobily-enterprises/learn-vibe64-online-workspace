import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// The lessons' own words and the hosted names they use. The hosted product says
// Publish and Staging; deploy-* places, app-deployed and deployment-live are
// Online's ids, which only beat targets, check facts and package.json name.
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
      used[target === 'app-deployed' ? 'activities' : 'places'].add(target);
    }
  }
}
visible.push(['outline', await read(topic.outline)]);
for (const path of ['sign.mjs', 'server.mjs', 'genesis/blueprint.md', 'genesis/subsystems.md', 'genesis/program/sign.md']) {
  visible.push([`sign-app ${path}`, await read(`training/exercises/sign-app/${path}`)]);
}
for (const [where, text] of visible) {
  const words = text.replace(/`[^`\n]+`/gu, '');
  assert.doesNotMatch(words, /deploy/iu, `${where} says Publish and Staging, not deploy`);
  assert.doesNotMatch(words, /production|test copy/iu, `${where} says Staging and test addresses, not Production or Test copy`);
}
console.log(`PASS: ${visible.length} learner-facing texts say Publish and Staging.`);

assert.deepEqual([...used.places].sort(), [...topic.places].sort(), 'the topic declares exactly the hosted places its beats use');
assert.deepEqual([...used.activities].sort(), [...topic.activities].sort(), 'the topic declares exactly the hosted activities its beats use');
assert.deepEqual([...used.facts].sort(), [...topic.facts].sort(), 'the topic declares exactly the facts its steps check');
console.log('PASS: the topic declares exactly the hosted places, activities and facts its lessons use.');

// Each lesson that publishes the sign names the Staging page, its button and the confirmation.
for (const code of ['V64-WORKSPACE-03', 'V64-WORKSPACE-04', 'V64-WORKSPACE-05']) {
  const step = lessons[code].steps.find(entry => entry.check.fact === 'deployment-live');
  assert.equal(step.required, true, `${code} publishes the sign`);
  const body = await read(`training/lessons/${code}/${step.body}`);
  assert.match(body, /\*\*Publish to staging\*\*/u, code);
  assert.match(body, /\*\*Publish\*\*/u, code);
  assert.match(body, /^show deploy-staging: Press Publish to staging.*Publish/mu, code);
}
// Lesson 03 says Staging never acts for real and sends email and SMS only to the owner's test
// addresses, in an optional step, so the lesson stays where the Test addresses card is not
// registered yet.
const testAddresses = lessons['V64-WORKSPACE-03'].steps.find(entry => entry.id === 'test-addresses');
assert.equal(testAddresses.required, false);
const testAddressesBody = await read(`training/lessons/V64-WORKSPACE-03/${testAddresses.body}`);
assert.match(testAddressesBody, /^Staging never acts for real\./mu);
assert.match(testAddressesBody, /\*\*Test email address\*\*/u);
assert.match(testAddressesBody, /\*\*Test phone number\*\*/u);
assert.match(testAddressesBody, /^show deploy-test-addresses: /mu);
assert.deepEqual(stepsUsing.get('deploy-test-addresses'), [testAddresses], 'only the optional Test addresses step points at Test addresses');
console.log('PASS: the publishing lessons name Publish to staging, Publish and the Test addresses.');
