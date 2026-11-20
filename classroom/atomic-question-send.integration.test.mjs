import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("./atomic-question-send.js", import.meta.url), "utf8");

test("Send button has exactly one direct atomic click listener", () => {
  const registrations = [...source.matchAll(/sendButton\.addEventListener\(\s*["']click["']/g)];
  assert.equal(registrations.length, 1);
  assert.match(source, /sendButton\.addEventListener\(\s*["']click["']\s*,\s*sendAtomically\s*\)/);
});

test("one atomic send invokes the live-question transition exactly once", () => {
  const sendFunction = source.match(/async function sendAtomically\(\) \{([\s\S]*?)\n\}\n\nif \(sendButton/);
  assert.ok(sendFunction, "sendAtomically should remain the Send button handler");

  const rpcCalls = [...sendFunction[1].matchAll(/\bawait\s+sendLiveQuestion\s*\(/g)];
  assert.equal(rpcCalls.length, 1);
});

test("atomic sender does not reintroduce legacy direct question writes", () => {
  const sendFunction = source.match(/async function sendAtomically\(\) \{([\s\S]*?)\n\}\n\nif \(sendButton/);
  assert.ok(sendFunction);
  assert.doesNotMatch(sendFunction[1], /\.from\(\s*["']session_questions["']\s*\)/);
  assert.doesNotMatch(sendFunction[1], /\.insert\s*\(/);
  assert.doesNotMatch(sendFunction[1], /\.update\s*\(/);
});
