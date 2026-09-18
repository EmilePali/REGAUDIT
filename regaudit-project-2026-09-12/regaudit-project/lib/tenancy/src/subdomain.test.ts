import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  assertProvisionableSubdomain,
  isValidSubdomainFormat,
  parseSubdomainFromHost,
} from './subdomain';

const ROOT = 'myplatform.com';

test('parseSubdomainFromHost extracts a tenant subdomain', () => {
  assert.equal(parseSubdomainFromHost('armp.myplatform.com', ROOT), 'armp');
  assert.equal(parseSubdomainFromHost('gcamines.myplatform.com:443', ROOT), 'gcamines');
});

test('parseSubdomainFromHost returns null for the root domain', () => {
  assert.equal(parseSubdomainFromHost('myplatform.com', ROOT), null);
  assert.equal(parseSubdomainFromHost('myplatform.com:5000', ROOT), null);
});

test('parseSubdomainFromHost returns null for an unrelated domain', () => {
  assert.equal(parseSubdomainFromHost('example.com', ROOT), null);
  assert.equal(parseSubdomainFromHost('evilmyplatform.com', ROOT), null);
});

test('parseSubdomainFromHost returns null for reserved subdomains', () => {
  assert.equal(parseSubdomainFromHost('www.myplatform.com', ROOT), null);
  assert.equal(parseSubdomainFromHost('verify.myplatform.com', ROOT), null);
  assert.equal(parseSubdomainFromHost('api.myplatform.com', ROOT), null);
});

test('parseSubdomainFromHost returns null for a nested/multi-level label', () => {
  assert.equal(parseSubdomainFromHost('a.b.myplatform.com', ROOT), null);
});

test('isValidSubdomainFormat accepts reasonable tenant labels', () => {
  assert.equal(isValidSubdomainFormat('armp'), true);
  assert.equal(isValidSubdomainFormat('gcamines'), true);
  assert.equal(isValidSubdomainFormat('regulator-2'), true);
});

test('isValidSubdomainFormat rejects reserved words, bad chars, and bad edges', () => {
  assert.equal(isValidSubdomainFormat('www'), false);
  assert.equal(isValidSubdomainFormat('Armp'), false);
  assert.equal(isValidSubdomainFormat('arm p'), false);
  assert.equal(isValidSubdomainFormat('-armp'), false);
  assert.equal(isValidSubdomainFormat('armp-'), false);
  assert.equal(isValidSubdomainFormat('a'), false);
});

test('assertProvisionableSubdomain throws a descriptive error for a reserved word', () => {
  assert.throws(() => assertProvisionableSubdomain('api'), /réservé/);
});

test('assertProvisionableSubdomain does not throw for a valid label', () => {
  assert.doesNotThrow(() => assertProvisionableSubdomain('armp'));
});
