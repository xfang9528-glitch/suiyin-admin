import fs from 'node:fs';
import path from 'node:path';

const [, , inputArg] = process.argv;
if (!inputArg) {
  console.error('usage: node build_inline.mjs <file.html>');
  process.exit(1);
}

const inputPath = path.resolve(inputArg);
const baseDir = path.dirname(inputPath);
const outputPath = inputPath.replace(/\.html$/i, '_inline.html');
let output = fs.readFileSync(inputPath, 'utf8');

const embeddedStyles = [];
output = output.replace(
  /<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["']\s*\/?\s*>/gi,
  (tag, href) => {
    if (/^(?:https?:|data:|\/\/)/i.test(href)) return tag;
    const cleanHref = href.split('?')[0];
    const cssPath = path.resolve(baseDir, cleanHref);
    if (!fs.existsSync(cssPath)) return tag;
    embeddedStyles.push(cleanHref);
    const css = fs.readFileSync(cssPath, 'utf8').replace(/<\/style/gi, '<\\/style');
    return `<style>\n/* ${cleanHref} inlined by build_inline.mjs */\n${css}\n</style>`;
  },
);

const embeddedScripts = [];
output = output.replace(
  /<script\s+src=["']([^"']+)["']\s*><\/script>/gi,
  (tag, src) => {
    if (/^(?:https?:|data:|\/\/)/i.test(src)) return tag;
    const cleanSrc = src.split('?')[0];
    const scriptPath = path.resolve(baseDir, cleanSrc);
    if (!fs.existsSync(scriptPath)) return tag;
    embeddedScripts.push(cleanSrc);
    const script = fs.readFileSync(scriptPath, 'utf8').replace(/<\/script/gi, '<\\/script');
    return `<script>\n/* ${cleanSrc} inlined by build_inline.mjs */\n${script}\n</script>`;
  },
);

fs.writeFileSync(outputPath, output);
console.log(`styles inlined: ${embeddedStyles.join(', ') || 'none'}`);
console.log(`scripts inlined: ${embeddedScripts.join(', ') || 'none'}`);
console.log(`out: ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
