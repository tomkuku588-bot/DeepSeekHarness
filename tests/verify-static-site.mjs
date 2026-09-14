import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const pages = [
  ["index.html", "合规文档", "Legal Documents"],
  ["privacy-policy.html", "隐私政策", "Privacy Policy"],
  ["user-agreement.html", "用户协议", "User Agreement"],
];

function read(file) {
  return readFileSync(join(root, file), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const [file, chineseTitle, englishTitle] of pages) {
  const html = read(file);
  assert(html.includes('data-title-zh="'), `${file}: missing Chinese title metadata`);
  assert(html.includes('data-title-en="'), `${file}: missing English title metadata`);
  assert(html.includes("data-lang-switcher"), `${file}: missing language switcher`);
  assert(html.includes('data-lang-panel="zh"'), `${file}: missing Chinese panel`);
  assert(html.includes('data-lang-panel="en"'), `${file}: missing English panel`);
  assert(html.includes(chineseTitle), `${file}: missing expected Chinese title`);
  assert(html.includes(englishTitle), `${file}: missing expected English title`);
  assert(html.includes("tomkuku588@gmail.com"), `${file}: missing contact email`);
  assert(html.includes("1.0.0"), `${file}: missing policy version`);
  assert(html.includes("百宝箱DeskHarbor"), `${file}: missing current app name`);
  assert(!html.includes("DeskHarness"), `${file}: contains a previous app name`);
  assert(!html.includes("DSHarness"), `${file}: contains a previous app name`);
  assert(html.includes('<script src="./script.js" defer></script>'), `${file}: missing shared script`);
  assert(!html.includes("【待填写】"), `${file}: contains an unresolved placeholder`);
  assert(!/[A-Z]:\\Harmony_/i.test(html), `${file}: exposes a local path`);
}

for (const file of ["privacy-policy.html", "user-agreement.html"]) {
  const html = read(file);
  assert(html.includes("2026 年 9 月 8 日"), `${file}: missing Chinese effective date`);
  assert(html.includes("September 8, 2026"), `${file}: missing English effective date`);
  assert(html.includes('href="./index.html"'), `${file}: missing home link`);
  assert(html.includes("应用市场公示的实名认证主体"), `${file}: missing operator wording`);
  assert(html.includes("verified identity displayed"), `${file}: missing English operator wording`);
}

const index = read("index.html");
for (const target of ["privacy-policy.html", "user-agreement.html"]) {
  assert(index.includes(`href="./${target}"`), `index.html: missing link to ${target}`);
}

const script = read("script.js");
for (const behavior of ["URLSearchParams", "localStorage", "navigator.language", "history.replaceState", "data-preserve-lang"]) {
  assert(script.includes(behavior), `script.js: missing ${behavior} behavior`);
}

const style = read("style.css");
for (const feature of ["[hidden]", ":focus-visible", "prefers-reduced-motion", "@media (max-width: 760px)"]) {
  assert(style.includes(feature), `style.css: missing ${feature}`);
}

const publicFiles = readdirSync(root, { withFileTypes: true }).filter((item) => item.isFile()).map((item) => item.name);
assert(publicFiles.includes(".nojekyll"), "missing .nojekyll");

console.log(`Verified ${pages.length} bilingual pages and shared behavior.`);
