// Static file packaging only: no bundler, dependencies, uploads or deployment.
import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--local-preview")) {
  throw new Error("Only --local-preview is supported.");
}
const localPreview = args.includes("--local-preview");
if (!localPreview && process.env.HMT_PHOTO_USAGE_APPROVED !== "true") {
  throw new Error(
    "Public packaging is blocked: the homepage photograph is approved for local testing only. " +
    "Confirm commercial usage rights before setting HMT_PHOTO_USAGE_APPROVED=true. " +
    "For local testing, use node scripts/prepare-public.mjs --local-preview.",
  );
}
if (!localPreview && process.env.HMT_ABOUT_PHOTO_USAGE_APPROVED !== "true") {
  throw new Error(
    "Public packaging is blocked: the About Amir photograph is approved for local testing only. " +
    "Confirm photographer commercial-use permission before setting HMT_ABOUT_PHOTO_USAGE_APPROVED=true. " +
    "The existing homepage photograph approval is also required.",
  );
}

const output = resolve(root, localPreview ? ".local-preview" : "public");
// Only replace a known generated child directory, never a symlink or junction.
if (dirname(output) !== root || (existsSync(output) && lstatSync(output).isSymbolicLink())) {
  throw new Error("Unsafe output directory.");
}
const files = [
  "index.html", "styles.css", "script.js", "navigation.js", "privacy.js", "privacy.css", "privacy", "legal-information", "robots.txt", "sitemap.xml",
  "googlecf1431cd2c2791c2.html", "assets", "about-amir",
  "gcse-maths-tutor-hull", "gcse-maths-tutor-prices",
  "functional-skills-maths-tutor-hull", "gcse-grade-4-5-maths-support-hull",
  "maths-mot-hull", "year-11-parent-guide", "thank-you",
];
// Never follow source symlinks into unrelated files.
const assertRegularTree = (path) => {
  const info = lstatSync(path);
  if (info.isSymbolicLink()) throw new Error(`Source symlink is not publishable: ${path}`);
  if (info.isDirectory()) readdirSync(path).forEach((name) => assertRegularTree(join(path, name)));
};
files.forEach((name) => assertRegularTree(join(root, name)));
rmSync(output, { recursive: true, force: true });
mkdirSync(output);
// Retired learner photograph: rights are unverified; keep it out of every export.
// The replacement social image derives from the separately guarded homepage photograph.
const excludedAssets = new Set([join(root, "assets", "hull-maths-tutor-hero.jpg")]);
files.forEach((name) => cpSync(join(root, name), join(output, name), {
  recursive: true,
  filter: (source) => !source.endsWith("README.md") && !excludedAssets.has(source),
}));
console.log(`Static files prepared in ${output}. No deployment performed.`);
if (localPreview) console.log("Local use only: publication approval flags are not enabled by this workflow.");
