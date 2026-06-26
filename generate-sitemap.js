import { SitemapStream, streamToPromise } from "sitemap";
import fs from "fs";

const sitemap = new SitemapStream({
  hostname: "https://recordpilot.vercel.app",
});

const pages = [
  "/",
  "/screen-recorder",
  "/audio-recorder",
  "/video-editor",
  "/how-it-works",
  "/features",
  "/privacy",
  "/terms",
  "/contact",
  "/faq",
  "/disclaimer",
];

pages.forEach((url) => {
  sitemap.write({ url });
});

sitemap.end();

const data = await streamToPromise(sitemap);

fs.writeFileSync("./public/sitemap.xml", data.toString());

console.log("✅ Sitemap Generated Successfully");