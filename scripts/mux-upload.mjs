/**
 * Uploads the encoded clips in `video-source/web/` to Mux and records their playback IDs.
 *
 * Mux is a delivery layer, not an archive — `video-source/masters/` stays the master copy and
 * neither folder is ever committed. The only thing that reaches the repo is the playback ID,
 * which is a public identifier, not a secret.
 *
 * The run is resumable. Every finished asset is written to the manifest immediately, and a
 * second run skips whatever is already there, so a connection that drops halfway costs only
 * the clip that was in flight.
 *
 * Needs MUX_TOKEN_ID and MUX_TOKEN_SECRET:  npm run mux:upload
 */
import { spawn } from "node:child_process";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const WEB_DIR = "video-source/web";
const MANIFEST = "video-source/mux-assets.json";
const LOCK = "video-source/.upload-lock";
const API = "https://api.mux.com/video/v1";

const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  console.error(
    "Missing MUX_TOKEN_ID / MUX_TOKEN_SECRET.\n" +
      "Create an access token at https://dashboard.mux.com/settings/access-tokens with\n" +
      "Mux Video read+write, then add both to .env.local.",
  );
  process.exit(1);
}

const auth = `Basic ${Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString("base64")}`;

/**
 * Two copies of this script running at once would each upload every clip, and both would
 * write the manifest — so the file ends up naming one asset while its twin sits on the
 * account unreferenced, silently eating the 10-video limit of the free plan. mkdir is
 * atomic, so it is the lock: the second process fails to create it and exits.
 */
try {
  await mkdir(LOCK);
} catch {
  console.error(`Another upload is already running (${LOCK} exists).\nIf that is stale, remove it and rerun.`);
  process.exit(1);
}
const releaseLock = () => rm(LOCK, { recursive: true, force: true });
process.on("exit", () => {});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await releaseLock();
    process.exit(130);
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(0)} MB`;

/** Every Mux call is Basic-authed JSON; the payload always arrives wrapped in `data`. */
async function mux(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { authorization: auth, "content-type": "application/json", ...init.headers },
  });
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${await res.text()}`);
  return (await res.json()).data;
}

/**
 * `basic` is the cheap encoding tier and caps at 1080p — exactly what the clips already are,
 * so there is nothing to gain from paying for more. Public playback: the videos sit on a
 * public marketing page and signed URLs would only add a token to expire.
 */
const createUpload = () =>
  mux("/uploads", {
    method: "POST",
    body: JSON.stringify({
      cors_origin: "*",
      new_asset_settings: { playback_policies: ["public"], video_quality: "basic" },
    }),
  });

/** curl rather than fetch: it streams a 130 MB body without buffering it and draws a progress bar. */
function putFile(url, file) {
  return new Promise((resolve, reject) => {
    const args = ["-sS", "--fail", "--progress-bar", "-X", "PUT", "-H", "Content-Type: video/mp4", "-T", file, url];
    const proc = spawn("curl", args, { stdio: ["ignore", "inherit", "inherit"] });
    proc.on("error", reject);
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`curl exited ${code}`))));
  });
}

/** Ingest is asynchronous: the upload resolves to an asset, and the asset then has to encode. */
async function waitForAsset(uploadId) {
  let assetId;
  while (!assetId) {
    const upload = await mux(`/uploads/${uploadId}`);
    if (upload.status === "errored") throw new Error(`upload errored: ${JSON.stringify(upload.error)}`);
    assetId = upload.asset_id;
    if (!assetId) await sleep(2000);
  }
  while (true) {
    const asset = await mux(`/assets/${assetId}`);
    if (asset.status === "ready") return { assetId, asset };
    if (asset.status === "errored") throw new Error(`asset errored: ${JSON.stringify(asset.errors)}`);
    await sleep(3000);
  }
}

const readManifest = () =>
  readFile(MANIFEST, "utf8")
    .then(JSON.parse)
    .catch(() => ({}));

async function upload(file, manifest) {
  const path = join(WEB_DIR, file);
  const { size } = await stat(path);
  console.log(`\n${file}  (${mb(size)})`);

  const { id, url } = await createUpload();
  await putFile(url, path);
  process.stdout.write("  encoding…");
  const { assetId, asset } = await waitForAsset(id);

  const playbackId = asset.playback_ids?.[0]?.id;
  if (!playbackId) throw new Error("asset ready but carries no public playback ID");

  manifest[file] = { assetId, playbackId, duration: asset.duration, aspectRatio: asset.aspect_ratio };
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\r  ready → ${playbackId}`);
}

const manifest = await readManifest();
const files = (await readdir(WEB_DIR)).filter((f) => f.endsWith(".mp4")).sort();
const pending = files.filter((f) => !manifest[f]);

console.log(`${files.length} clips, ${files.length - pending.length} already uploaded, ${pending.length} to go.`);

let failed = 0;
for (const file of pending) {
  try {
    await upload(file, manifest);
  } catch (error) {
    failed += 1;
    console.error(`  FAILED ${file}: ${error.message}`);
  }
}

console.log(`\nManifest: ${MANIFEST}`);
for (const [file, { playbackId }] of Object.entries(manifest)) console.log(`  ${file.padEnd(30)} ${playbackId}`);
await releaseLock();
if (failed) {
  console.error(`\n${failed} clip(s) failed — rerun to retry just those.`);
  process.exit(1);
}
