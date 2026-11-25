#!/usr/bin/env node
/**
 * Prints the App Store Connect app id (a public number, not a secret) for com.younoahguy.younoahlab, so the TestFlight upload knows where to go.
 * Reads the API key from EXPO_ASC_API_KEY_PATH / EXPO_ASC_KEY_ID / EXPO_ASC_ISSUER_ID and never prints the key or the token.
 * With --team-of <bundle id> it prints the Apple team id (also public) that owns that bundle id instead, e.g. the You Noah Guy app's.
 * Exit 0: prints the id. Exit 2: no app record yet (create it in App Store Connect first). Exit 1: anything else.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';

const teamMode = process.argv[2] === '--team-of';
const BUNDLE_ID = (teamMode ? process.argv[3] : process.argv[2]) ?? 'com.younoahguy.younoahlab';
const { EXPO_ASC_API_KEY_PATH: keyPath, EXPO_ASC_KEY_ID: kid, EXPO_ASC_ISSUER_ID: iss } = process.env;
if (!keyPath || !kid || !iss || !fs.existsSync(keyPath)) { console.error('App Store Connect key settings are missing.'); process.exit(1); }

const b64 = (v) => Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');
export function makeToken(key, keyId, issuer, now = Math.floor(Date.now() / 1000)) {
  const data = `${b64({ alg: 'ES256', kid: keyId, typ: 'JWT' })}.${b64({ iss: issuer, iat: now, exp: now + 1200, aud: 'appstoreconnect-v1' })}`;
  const sig = crypto.sign('sha256', Buffer.from(data), { key, dsaEncoding: 'ieee-p1363' });
  return `${data}.${sig.toString('base64url')}`;
}

const token = makeToken(fs.readFileSync(keyPath, 'utf8'), kid, iss);
const api = async (path) => {
  const res = await fetch(`https://api.appstoreconnect.apple.com${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) { console.error(`App Store Connect answered ${res.status}.`); process.exit(1); }
  return (await res.json()).data ?? [];
};
if (teamMode) {
  const b = (await api(`/v1/bundleIds?filter[identifier]=${encodeURIComponent(BUNDLE_ID)}`)).find((x) => x.attributes?.identifier === BUNDLE_ID);
  if (!b?.attributes?.seedId) { console.error(`No bundle id ${BUNDLE_ID} on this account.`); process.exit(2); }
  console.log(b.attributes.seedId);
} else {
  const app = (await api(`/v1/apps?filter[bundleId]=${encodeURIComponent(BUNDLE_ID)}&fields[apps]=bundleId,name`)).find((a) => a.attributes?.bundleId === BUNDLE_ID);
  if (!app) { console.error(`No App Store Connect app record for ${BUNDLE_ID} yet.`); process.exit(2); }
  console.log(app.id);
}
