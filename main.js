#!/usr/bin/env node

const JSDOM = require("jsdom").JSDOM;
const nfzf = require("node-fzf");

const url = "https://inv.n8pjl.ca/search?q=";
const query = process.argv.slice(2).join("+");
const videos = {};

(async () => {
  const response = await fetch(url + query);
  const html = await response.text();
  const document = new JSDOM(html).window.document;

  Array.from(
    document.querySelectorAll("#contents .pure-g")[1].querySelectorAll(".h-box")
  ).map((ele) => {
    const title = ele.querySelector(".video-card-row a p").innerHTML;
    const href = ele.querySelector(".video-card-row a").getAttribute("href");
    videos[title] = href;
  });

  const result = await nfzf({ list: Object.keys(videos) });
  const { selected } = await result;
  selected && console.log("https://www.youtube.com" + videos[selected?.value]);
})();
