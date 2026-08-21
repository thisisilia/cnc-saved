// Injects the UserLenz replay-bridge <script> into the exported web build's
// <head>, so it's present in the served HTML source (snippet detectors scan the
// raw HTML; a script React injects after load isn't visible to them). Runs after
// `expo export` as part of the Vercel build. Idempotent.
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'dist/index.html';
const TAG =
  '<script defer src="https://api-en72htyjgq-uc.a.run.app/bridge.min.js" ' +
  "onload=\"window.UserLenzBridge&&window.UserLenzBridge.init({source:'userlenz-replay-bridge',allowedOrigins:['https://userlenz-demo.web.app','https://cnc-inky.vercel.app']})\"></script>";

let html = readFileSync(FILE, 'utf8');

if (html.includes('bridge.min.js')) {
  console.log('[inject-userlenz] already present, skipping');
} else if (html.includes('</head>')) {
  html = html.replace('</head>', `${TAG}</head>`);
  writeFileSync(FILE, html);
  console.log('[inject-userlenz] injected bridge <script> into <head>');
} else {
  throw new Error('[inject-userlenz] no </head> found in ' + FILE);
}
