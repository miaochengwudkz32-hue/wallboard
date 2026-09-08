// build.js — 把 src.html + style.css + app.js 合成单文件 index.html
// 用法: node build.js
const fs = require("fs");
let html = fs.readFileSync("src.html", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const js = fs.readFileSync("app.js", "utf8");
html = html.replace("{{CSS}}", css).replace("{{JS}}", js);
fs.writeFileSync("index.html", html);
console.log("built index.html,", html.length, "bytes");
