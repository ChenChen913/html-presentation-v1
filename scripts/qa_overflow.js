#!/usr/bin/env node
/**
 * 幻灯片溢出检测 —— html-presentation 配套自检脚本
 *
 * 逐页激活每张幻灯片，检测：
 *   1. 内容溢出（scrollHeight / scrollWidth 超出容器 4px 以上）
 *   2. 可见元素越出幻灯片边界（截断风险）
 *   3. 激活后仍不可见的异常页
 *
 * 用法：
 *   node scripts/qa_overflow.js                    # 扫描全部 template*.html
 *   node scripts/qa_overflow.js template01.html    # 只扫指定文件
 *
 * 依赖：npm i playwright
 */
const fs = require('fs');
const path = require('path');

let chromium;
try { chromium = require('playwright').chromium; }
catch { console.error('请先安装 playwright：npm i playwright && npx playwright install chromium'); process.exit(1); }

const DIR = path.join(__dirname, '..', 'references', 'templates');

async function main() {
  const args = process.argv.slice(2);
  const files = args.length ? args : fs.readdirSync(DIR).filter(f => /^template\d+\.html$/.test(f)).sort();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });

  let issues = 0;
  for (const f of files) {
    await page.goto('file://' + path.join(DIR, f), { waitUntil: 'load' });
    await page.waitForTimeout(350);
    const report = await page.evaluate(async () => {
      const wait = (ms) => new Promise(r => setTimeout(r, ms));
      const slides = Array.from(document.querySelectorAll('.slide'));
      slides.forEach(s => s.classList.add('active'));
      await wait(400); // 等 visibility 过渡结束
      const out = [];
      for (let i = 0; i < slides.length; i++) {
        const s = slides[i];
        if (i > 0) { s.classList.add('active'); await wait(400); }
        const cs = getComputedStyle(s);
        if (cs.visibility === 'hidden' || cs.opacity === '0') out.push({ slide: i + 1, type: 'not-visible' });
        const overflowY = s.scrollHeight - s.clientHeight;
        const overflowX = s.scrollWidth - s.clientWidth;
        const sb = s.getBoundingClientRect();
        let clipped = null;
        for (const el of s.querySelectorAll('*')) {
          const st = getComputedStyle(el);
          if (st.display === 'none' || st.visibility === 'hidden') continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const pad = 2;
          if (r.bottom > sb.bottom + pad || r.right > sb.right + pad || r.top < sb.top - pad || r.left < sb.left - pad) {
            let a = el.parentElement, scrollable = false;
            while (a && a !== s.parentElement) {
              const as2 = getComputedStyle(a);
              if ((as2.overflowY === 'auto' || as2.overflowY === 'scroll') && a.scrollHeight > a.clientHeight + 4) { scrollable = true; break; }
              a = a.parentElement;
            }
            if (!scrollable) {
              clipped = (el.tagName + '.' + String(el.className).split(' ')[0]).slice(0, 50) + ` [+${Math.round(r.bottom - sb.bottom)}px]`;
              break;
            }
          }
        }
        if (overflowY > 4 || overflowX > 4 || clipped) out.push({ slide: i + 1, overflowY, overflowX, clipped });
        s.classList.remove('active');
      }
      return out;
    });
    if (report.length) {
      issues += report.length;
      console.log(`✗ ${f}`);
      report.forEach(r => console.log(`   slide ${r.slide}: overflowY=${r.overflowY} overflowX=${r.overflowX} ${r.clipped || ''}${r.type ? ' ' + r.type : ''}`));
    } else {
      console.log(`✓ ${f}`);
    }
  }
  await browser.close();
  console.log(issues ? `\nTOTAL ISSUES: ${issues}` : '\nALL CLEAN');
}
main().catch(e => { console.error(e); process.exit(1); });
