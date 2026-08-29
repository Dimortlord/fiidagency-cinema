import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const [widthArg = "1440", heightArg = "1000", section = "hero", output = "capture.png"] = process.argv.slice(2);
const width = Number(widthArg);
const height = Number(heightArg);
const port = 9333 + Math.floor(Math.random() * 300);
const profile = `C:/Users/Administrator/AppData/Local/Temp/cinema-cdp-${port}`;

const browser = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "--remote-allow-origins=*",
  "about:blank",
], { stdio: "ignore" });

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function connect() {
  let version;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      version = await fetch(`http://127.0.0.1:${port}/json/version`).then((response) => response.json());
      break;
    } catch {
      await sleep(100);
    }
  }
  if (!version) throw new Error("Chrome debugging endpoint did not start");

  const target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" }).then((response) => response.json());
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  const errors = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown") {
      errors.push(message.params.exceptionDetails.text);
    }
    if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
      errors.push(message.params.entry.text);
    }
  });

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    id += 1;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  await send("Page.navigate", { url: "http://127.0.0.1:5173/" });
  await sleep(4500);

  if (section !== "hero") {
    await send("Runtime.evaluate", {
      expression: `document.getElementById(${JSON.stringify(section)})?.scrollIntoView({block:'start'}); window.dispatchEvent(new Event('scroll'));`,
      awaitPromise: true,
    });
    await sleep(1800);
  }

  const audit = await send("Runtime.evaluate", {
    expression: `JSON.stringify({clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,buttons:document.querySelectorAll('button').length,videos:document.querySelectorAll('video').length,sections:document.querySelectorAll('main section').length,heading:document.querySelector('h1')?.textContent?.trim(),overflow:Array.from(document.querySelectorAll('*')).map((element)=>{const rect=element.getBoundingClientRect();return {tag:element.tagName,id:element.id,classes:element.className?.toString().slice(0,90),left:Math.round(rect.left),right:Math.round(rect.right),width:Math.round(rect.width)}}).filter((item)=>item.right>document.documentElement.clientWidth+1||item.left< -1).slice(0,20)})`,
    returnByValue: true,
  });
  console.log(audit.result.value);

  const result = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(output, Buffer.from(result.data, "base64"));
  socket.close();
  if (errors.length) console.error(errors.join("\n"));
}

try {
  await connect();
} finally {
  browser.kill();
}
