import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import ffmpeg from "ffmpeg-static";

const sourceDir = "C:/Users/Administrator/Downloads/Cinema";
const publicDir = "C:/Users/Administrator/Desktop/Claude Code/cinema/public";
const sourceFiles = readdirSync(sourceDir);

function source(name) {
  const exact = sourceFiles.find((file) => file === name);
  if (!exact) throw new Error(`Missing source: ${name}`);
  return join(sourceDir, exact);
}

function ensure(path) {
  mkdirSync(path, { recursive: true });
}

function run(args) {
  execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
}

ensure(join(publicDir, "img", "frames"));
ensure(join(publicDir, "img", "people"));
ensure(join(publicDir, "video"));

const images = [
  ["0fb71738-9141-4698-8daf-09f9273c084c.png", "img/hero-poster.webp", 1600],
  ["Снимок экрана 2026-08-20 110421.png", "img/author.webp", 1400],
  ["dreamina-2026-08-19-3458-Use the attached reference images as the....jpeg", "img/frames/01.webp", 1200],
  ["dreamina-2026-08-19-6206-The first two reference images show the ....jpeg", "img/frames/02.webp", 1200],
  ["dreamina-2026-08-19-7236-3D animated family film still, Pixar-sty....jpeg", "img/frames/03.webp", 1200],
  ["dreamina-2026-08-19-4781-3D animated family film still, Pixar-sty....jpeg", "img/frames/04.webp", 1200],
  ["dreamina-2026-08-19-9816-The man in @Image 1 is the main characte....jpeg", "img/frames/05.webp", 1200],
  ["3cbbe3be-d1db-4b6b-b7b3-2023101e6bae.png", "img/frames/06.webp", 1200],
  ["c970541b-4cd7-4f39-8669-65530dbf1323.png", "img/frames/07.webp", 1200],
  ["aadd224a-fb18-42cb-ac74-a410c6b184f8.png", "img/frames/08.webp", 1200],
  ["dmitriy_front.jpeg", "img/people/dmitriy.webp", 680],
  ["vanessa_front.jpeg", "img/people/vanessa.webp", 680],
  ["dreamina-2026-08-19-7236-3D animated family film still, Pixar-sty....jpeg", "img/people/egypt.webp", 680],
  ["dreamina-2026-08-19-4781-3D animated family film still, Pixar-sty....jpeg", "img/people/knight.webp", 680],
  ["dreamina-2026-08-22-8131-Use the first attached image ONLY for Dm....jpeg", "img/people/future.webp", 680],
];

for (const [input, output, width] of images) {
  const target = join(publicDir, output);
  ensure(dirname(target));
  run([
    "-i", source(input),
    "-vf", `scale=${width}:-2:force_original_aspect_ratio=decrease`,
    "-frames:v", "1",
    "-c:v", "libwebp",
    "-quality", "82",
    target,
  ]);
}

function makeMontage(inputs, targetName, clipDuration) {
  const args = [];
  for (const input of inputs) {
    args.push("-ss", "0.7", "-t", String(clipDuration), "-i", source(input));
  }

  const filters = inputs.map((_, index) =>
    `[${index}:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,format=yuv420p,setpts=PTS-STARTPTS[v${index}]`
  );
  const streams = inputs.map((_, index) => `[v${index}]`).join("");
  filters.push(`${streams}concat=n=${inputs.length}:v=1:a=0[out]`);

  run([
    ...args,
    "-filter_complex", filters.join(";"),
    "-map", "[out]",
    "-an",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "25",
    "-g", "12",
    "-keyint_min", "12",
    "-sc_threshold", "0",
    "-movflags", "+faststart",
    join(publicDir, "video", targetName),
  ]);
}

makeMontage([
  "dreamina-2026-08-19-9409-The man waves across the river. A herd o....mp4",
  "dreamina-2026-08-19-8018-The man in  and the woman in  are the ch....mp4",
  "dreamina-2026-08-19-9694-The man in  and the woman in  are the ch....mp4",
  "dreamina-2026-08-19-7733-The man in  and the woman in  are the ch....mp4",
  "dreamina-2026-08-20-4788-The man in  and the woman in  are the ma....mp4",
  "dreamina-2026-08-22-6430-Use the attached proposal frame as the E....mp4",
], "hero-reel.mp4", 4);

makeMontage([
  "dreamina-2026-08-22-1074-Use the attached proposal frame as the E....mp4",
  "dreamina-2026-08-22-2634-He offers the bouquet toward her. She re....mp4",
  "dreamina-2026-08-22-3242-Use the attached image as the exact scen....mp4",
  "dreamina-2026-08-22-4120-Use the attached reference images for ch....mp4",
  "dreamina-2026-08-22-4779-Use the attached proposal frame as the E....mp4",
  "dreamina-2026-08-22-6152-Use the attached proposal frame as the E....mp4",
  "dreamina-2026-08-22-6430-Use the attached proposal frame as the E....mp4",
  "dreamina-2026-08-22-9353-Use the attached reference images for ch....mp4",
], "showcase.mp4", 3);

run([
  "-i", source("1video.mp4"),
  "-t", "15",
  "-vf", "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,format=yuv420p",
  "-an",
  "-c:v", "libx264",
  "-preset", "medium",
  "-crf", "25",
  "-movflags", "+faststart",
  join(publicDir, "video", "first-film.mp4"),
]);

console.log("Prepared web assets in public/.");
