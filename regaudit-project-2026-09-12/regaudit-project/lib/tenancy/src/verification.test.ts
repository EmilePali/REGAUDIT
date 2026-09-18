import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildVerificationUrl, generateVerificationCode, hashIpAddress } from './verification';

test('generateVerificationCode produces unique, URL-safe codes', () => {
  const codes = new Set(Array.from({ length: 1000 }, () => generateVerificationCode()));
  assert.equal(codes.size, 1000);
  for (const code of codes) {
    assert.match(code, /^[A-Za-z0-9_-]+$/);
  }
});

test('buildVerificationUrl always resolves on the platform verification domain', () => {
  const code = generateVerificationCode();
  const url = buildVerificationUrl(code, 'verify.myplatform.com');
  assert.equal(url, `https://verify.myplatform.com/c/${code}`);
});

test('hashIpAddress is deterministic for the same input and salt', () => {
  const a = hashIpAddress('41.207.1.2', 'pepper');
  const b = hashIpAddress('41.207.1.2', 'pepper');
  assert.equal(a, b);
});

test('hashIpAddress differs across salts and never leaks the raw IP', () => {
  const withPepperA = hashIpAddress('41.207.1.2', 'pepper-a');
  const withPepperB = hashIpAddress('41.207.1.2', 'pepper-b');
  assert.notEqual(withPepperA, withPepperB);
  assert.doesNotMatch(withPepperA, /41\.207\.1\.2/);
});
