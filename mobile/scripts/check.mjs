#!/usr/bin/env node
// Checks that need no iPhone: the app carries the current site page unchanged, links behave, and the settings Apple and the microphone depend on are set.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fail = (m) => { console.error(`check failed: ${m}`); process.exit(1); };
const page = fs.readFileSync(path.join(HERE, 'assets/web/younoahlab.html'), 'utf8');
const site = fs.readFileSync(path.join(HERE, '..', 'index.html'), 'utf8');
if (page !== site) fail('assets/web/younoahlab.html is not the same as ../index.html: copy it again (cp ../index.html assets/web/younoahlab.html)');
if (!/http-equiv="Content-Security-Policy"/.test(page)) fail('the page lost its Content-Security-Policy');
if (!/const IN_APP=!!window\.YNL_APP;/.test(page)) fail('the page has no app mode (IN_APP)');
const links = fs.readFileSync(path.join(HERE, 'src/links.ts'), 'utf8');
const stay = new RegExp(/return \/(.+)\/i\.test\(url\);\n\}\n\nexport function opensInSafari/.exec(links)[1], 'i');
for (const u of ['https://younoahlab.com/', 'https://younoahlab.com/#space', 'https://younoahlab.com/?v=1#how']) if (!stay.test(u)) fail(`${u} should stay in the app`);
for (const u of ['https://younoahlab.com/privacy.html', 'https://younoahlab.com/how/', 'https://example.com/']) if (stay.test(u)) fail(`${u} should leave the app`);
const { expo } = JSON.parse(fs.readFileSync(path.join(HERE, 'app.json'), 'utf8'));
if (expo.name !== 'You Noah Lab' || expo.ios.infoPlist.CFBundleDisplayName !== 'You Noah Lab') fail('app name must be You Noah Lab');
if (expo.ios.bundleIdentifier !== 'com.younoahguy.younoahlab') fail('wrong bundle id');
if (!/never records/.test(expo.ios.infoPlist.NSMicrophoneUsageDescription ?? '')) fail('microphone reason missing');
if (!expo.ios.infoPlist.NSSpeechRecognitionUsageDescription) fail('speech reason missing');
if (expo.ios.config.usesNonExemptEncryption !== false) fail('encryption answer missing');
if (expo.ios.privacyManifests.NSPrivacyTracking !== false) fail('privacy manifest missing');
if (expo.ios.supportsTablet !== false) fail('iPhone only');
const png = fs.readFileSync(path.join(HERE, expo.icon));
if (png.readUInt32BE(16) !== 1024 || png.readUInt32BE(20) !== 1024 || png[25] !== 2) fail('icon must be 1024x1024 RGB with no transparency');
console.log('mobile checks passed');
