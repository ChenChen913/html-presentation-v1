# 排版规则 LAYOUT_RULES.md

> 生成或修改任何模板/演示文稿前必读。本文件与 AVOID_LIST.md 同级：这里定义「怎么做」，那里定义「绝不能做什么」。

---

## 一、CSS 基础重置（必须）

每个 HTML 文件的 CSS 开头：

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; -webkit-font-smoothing: antialiased; }
```

---

## 二、画布：玻璃舞台（01-12）、全屏 Keynote（13-18）、画册编辑（19）与东方卷轴（20）

### 玻璃舞台画布（01-12，参数与原版逐套一致）

```css
body { display: flex; justify-content: center; align-items: center; }
.presentation-container {
  /* 各套尺寸/玻璃参数是家族基因，选哪套就用哪套的值： */
  /* 01/09/10/11/12: 85vw×82vh blur(15px) saturate(180%) r30   02: max1100×760 blur(20px) r28 */
  /* 03: 90vw×86vh  blur(30px) r24                  04: 96vw×92vh blur(40px) saturate(150%) r24 */
  /* 05: 86vw×84vh  blur(35px) saturate(120%) r30   06: 96vw×92vh blur(40px) saturate(140%) r32 */
  /* 07/08: 94vw×90vh blur(40px)/blur(28px) 双主题 r28/r32 */
  backdrop-filter: blur(XXpx) saturate(XX%);
  border: 1px solid var(--glass-border);
  border-radius: 24-32px;
  perspective: 1000px;
}
.slide {
  position: absolute; width: 100%; height: 100%;
  display: none; flex-direction: column; justify-content: center; align-items: flex-start;
  background: var(--glass-bg); overflow: hidden;
}
.slide.active { display: flex; }
```

### Keynote 全屏画布（13-18 专用）

```css
.slide { position: absolute; inset: 0; height: 100vh;  /* 每页一个 100vh 全屏 section */
  display: none; flex-direction: column; justify-content: center; align-items: center; }
.wrap   { width: 100%; max-width: 1210px; }  /* 内容包在 wrap 内，左右留白慷慨 */
/* 玻璃卡片/3D 方块内嵌于全页：
   13 浅色奶油：玻璃填充 rgba(255,255,255,.62)→rgba(255,249,238,.30) 渐变、描边 rgba(255,255,255,.72)、
           blur(22px) saturate(150%)、暖棕投影 0 34px 70px -26px rgba(122,74,18,.40)
   14 深色黑场：填充 rgba(255,255,255,.10)→rgba(255,255,255,.04)、描边 rgba(255,255,255,.17)、深投影黑
   15 浅色青瓷：填充 rgba(255,255,255,.62)→rgba(240,248,243,.30)、描边 rgba(255,255,255,.75)、
           松绿投影 0 34px 70px -26px rgba(30,64,48,.40)
   16 深色蓝调：同 14 参数体系，尾段色散偏星紫 rgba(150,110,255,.60)
   17 浅色冰川：填充 rgba(255,255,255,.60)→rgba(236,244,249,.30)、描边 rgba(255,255,255,.78)、
           冷灰蓝投影 0 34px 70px -26px rgba(31,54,72,.42)，色散尾段偏冰蓝 rgba(143,195,221,.55)
   18 深色极光：同 14 参数体系，描边亮白 rgba(255,255,255,.22)，色散更明显且尾段偏雾紫 */
/* 玻璃光影三件套（六套都必须保留，不得退化成普通半透明卡片）：
   ① backdrop-filter: blur() 毛玻璃；② 描边外侧红-橙-蓝渐变模糊光晕（棱镜色散，浅色 13/15/17 opacity .20/.26，
   深色 14/16/18 opacity .32-.42，色散尾段可随主题色相偏移）；
   ③ 8s 循环扫光层（白色渐变，透明度 ≤8%）；背景另加主题色径向光晕 + CSS 点阵噪点 */
```

### 画册编辑画布（19 专用，与发布会相反：左对齐非对称）

```css
.slide { position: absolute; inset: 0; height: 100vh;
  display: none; flex-direction: column; justify-content: center; align-items: flex-start;  /* 左对齐 */
  padding: clamp(88px,13vh,128px) clamp(48px,6.5vw,116px) clamp(96px,14vh,136px); }  /* 上下加厚给四角留位 */
/* 四角杂志细节（每页 slide 内 absolute）：.tl 卷号/日期 · .tr 馆名英文名 · .bl 章节号 · .br 页码（编号用点缀色）
   全部 sans 0.78rem 字距 0.30em 大写 */
/* 玻璃画框（展柜玻璃压在纸面上）：fill rgba(255,255,255,.16)、border 1px rgba(26,26,26,.16)、
   blur(12px) saturate(110%)、r6px；画框背后垫超大宋体字（15rem，墨色 6-8% 透明）透过 blur 形成折射；
   一角色散描边 opacity 0.10（细看才发现的彩蛋） */
/* 标题与正文间 1px 细黑线；正文两栏排右下（columns:2，gap 44-48px；单句 ≤100 字必须单栏防拆词）；留白大于文字 */
```

**画册导航特殊布局**：19 四角被杂志细节占用，导航控件抬升至右下（bottom 72px 避开页码角标），`#pageCounter` 保留在控件内（引擎判空兼容）。

### 东方卷轴画布（20 专用，与 19 相反：中轴对称 + 竖排主导）

```css
.slide { position: absolute; inset: 0; height: 100vh;
  display: none; flex-direction: column; justify-content: center; align-items: center;  /* 中轴 */
  padding: clamp(44px,8vh,84px) clamp(48px,6.5vw,116px); }
/* 竖排主导：writing-mode: vertical-rl（v-title 4.5rem / h2-v 2.5rem / quote-v 3.4rem / 屏风卡内部）。
   ⚠ 竖排上下文 flex 方向语义反转：inline 轴为垂直——子项纵向堆叠用 flex-direction: row（如五条屏卡内）；
   竖排列高预算：列字数 × 字号 ×（1+字距 0.2em）必须 ≤ 容器高，超预算先缩句再缩字号；
   竖排分列（<br> 或 display:block 的 span）在 vertical-rl 中从右向左排列，符合传统读序 */
/* 玻璃月：大圆玻璃（330px）金描边 + inset 内高光 + ::before 月晕 radial 金 0.22（moonBreath 12s 呼吸）+ ::after 弧面高光；
   茶盏：同心双环小圆玻璃（::before/::after 双环 border）；
   屏风：竖长圆角玻璃条（blur18 + 金/青/朱渐变色散 .30 + 内侧亮线 ::after） */
/* 氛围层：双层远山剪影（fixed SVG，月白 0.045/0.028）+ 萤火 3 枚（金点 floaty 9-13s 缓浮）+ 噪点 0.05 + 8s 扫光 ≤6% */
/* 章回汉字：10rem -webkit-text-stroke 2px 金 0.62 描边空心；印章：朱底 #a83a32 + 月白楷体 + 内描边 1.5px + rotate(-2.5deg) */
```

**卷轴导航**：右上角汉字纪年角标（贰零贰陆·秋），导航按钮右下（墨金玻璃化，hover 变金底墨字），计数器底部左侧。

**光斑背景参数（玻璃基因）**：01/12 旋转光晕 20-24s；02 四色流动背景 15s；03 三色光斑 blur(80px)；04 双光斑 blur(120px)；05 四色光斑 blur(90px)；06 三色光斑 blur(100px)；07/08 无光斑（纯色底靠玻璃层次）；09 暖色双光斑 blur(70px)；10 柔光气泡 blur(75px)；11 玫瑰光晕 blur(75px)；13 三个暖色径向光晕 blur(95px) + 8s 扫光；14 暗金光晕 blur(95px) + 8s 扫光；15 青瓷绿光晕 blur(95px) + 8s 扫光；16 星芒蓝光晕 blur(95px) + 8s 扫光；17 冰蓝/晨雾白三光晕 blur(95px) + 8s 扫光；18 斜向极光渐变带两条 blur(72px)（青→紫，透明度 <12%，22/28s 缓移）+ 8s 扫光；19/20 无彩色光晕（19 纯纸色底 + 极细噪点，扫光降至 ≤5%；20 墨绿底 + 远山剪影 + 萤火漂浮 + 噪点，扫光 ≤6%，玻璃月月晕呼吸 12s）。新增模板必须从这些参数中选型，不得自创。

**内边距断点**：>1280px 用大值 → 768-1280px 收缩一档 → <768px 收缩到 32px。全部通过 `clamp()` 或 media query 实现，禁止写死单值。

---

## 三、幻灯片切换（家族统一优雅慢入）

```css
/* 全库统一（01-12）：优雅慢入（原版节奏） */
.slide.active { display: flex; animation: fadeIn .8s ease-out forwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20-26px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* 特例：02 用 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 回弹缓动；04 为横切 */
```

- 全家族 600-800ms。缓动 ease / ease-out；位移 ≤30px。
- `display:none/flex` 切换配合 fadeIn 动画，隐藏页不可聚焦、不可交互。
- 必须保留 `@media (prefers-reduced-motion: reduce)` 全局降级。

---

## 四、字体系统

### 字号（固定 rem，量级严格 = 原版；禁止 clamp/vw 中途压缩）

```css
/* 封面大标题 h1：02 3.5rem · 08 3.8rem · 01/05 4rem · 03 4.2rem · 07 4.5rem · 04/06 5rem · 13-18 6rem（约屏高 1/8，结尾 5.2rem）· 19 横排衬线 5.6rem（结尾同）· 20 竖排 v-title 4.5rem（结尾竖题 2.8rem） */
/* 页标题 h2：01/02/08 2.5rem · 03 2.8rem · 07 2.8rem · 06 3.2rem · 04 3.8rem · 05 4rem · 13-18 2.75rem（章节题 3.4rem）· 19 3.2rem 衬线 · 20 竖排 h2-v 2.5rem / 横排章题 2.3rem */
/* 正文：02/08 1.25rem · 03 1.35rem · 01 1.4rem · 05/06/07 1.6-1.8rem · 04 1.8rem · 13-18 副文案 1.5 / 正文 1.1-1.25rem · 19/20 两栏正文 1.02-1.04 行高 2.0 */
/* 注释/kicker/编号：0.9-1.2rem；数据大字：3-3.5rem（13-18 7.5rem；20 鎏金横条 bval 1.55rem）；19 金句大字 4.1rem 衬线 · 20 整页竖排金句 3.4rem + 章回汉字 10rem */
h1 { font-size: 4rem; }   /* 以 01 套为例，逐套取值见注释量级表 */
h2 { font-size: 2.5rem; }
p  { font-size: 1.4rem; }
li { font-size: 1.3rem; }
```

**原版 8 套模板全部使用固定 rem 字号**，本 skill 与原版保持一致：同一元素在任何视口下字号恒定，这是「与原版同样大小」的根本保证。历史教训：曾改用 `clamp(min, vw, max)`，1440px 视口下实际渲染只剩原版量级的 90-95%，小窗口低至 60-80%，用户可感知地「字变小」——**禁止对核心排版字号回退 clamp/vw 方案**。

小屏适配用媒体查询整体降档（对齐原版 06 的 `@media (max-width: 768px)` 做法）：

```css
@media (max-width: 900px) {
    h1 { font-size: 2.5rem; } h2 { font-size: 1.8rem; }
    p, li { font-size: 1.15rem; }
}
```

疏朗大字是原版的「人文」气质，禁止压小字号「求稳」——溢出靠拆页解决，不靠缩字。

**主标题单行铁律**：封面/结尾 h1 与每页 h2 的直接文本必须单行显示（≤14 字；用无头浏览器验证，跨行即改文案或字号）。禁止在标题中手插 `<br>` 凑两行。

### 行高与字重

标题 1.05-1.25；正文 1.6-1.85。字重：标题 600-700，强调 600，正文 400，注释 400。

### 字体栈（零依赖：只允许本地字体，按回退顺序声明）

| 用途 | 字体栈 |
|------|--------|
| 玻璃系正文与标题（01-12） | `"LXGW WenKai Screen", "LXGW WenKai", "Kaiti SC", "STKaiti", "KaiTi", "Noto Serif SC", serif` |
| Keynote 变体（13-18，中文黑体优先） | `-apple-system, "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", "Noto Sans SC", sans-serif` |
| 画册变体标题（19，宋体衬线） | `"Songti SC", "STSong", "NSimSun", "SimSun", "Noto Serif SC", "Source Han Serif SC", Georgia, serif` |
| 画册变体眉标/正文辅助（19） | `-apple-system, "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", "Noto Sans SC", sans-serif` |
| 卷轴变体标题与正文（20，楷体优先） | `"Kaiti SC", "STKaiti", "KaiTi", "LXGW WenKai", "Noto Serif SC", "Songti SC", serif` |
| 代码块等宽（07/08） | `ui-monospace, "SF Mono", "Fira Code", Consolas, monospace` |

**禁止**任何 `<link>` 外链字体、`@import`、CDN。用户没装霞鹜文楷时自动落到楷体/宋体，属预期行为。

---

## 五、内容密度预算（防截断核心）

`.slide` 是 `overflow: hidden` 的固定画布，内容超载 = 直接截断。逐页按下表预算：

| 元素 | 上限 |
|------|------|
| 要点列表 | ≤5 条，每条 ≤32 字（一行半以内） |
| 单页正文总字数 | ≤80 字（引用页、封面除外） |
| 标题 | ≤14 字，且主标题必须单行（含封面/结尾 h1） |
| 数据卡 | 一行 ≤3 张 |
| 表格 | ≤5 行 × ≤5 列 |
| 代码块 | ≤14 行，行宽 ≤46 字符 |
| 时间线/步骤 | ≤4 步（玻璃系窄舞台 ≤3 步） |
| 引用大字 | ≤2 行 |

**改写模板内容时，对照被替换页的元素数量与字数，只少不多。** 无法压缩时拆页，禁止缩小字号硬塞。

---

## 六、组件规范

### 要点列表（列表符是家族签名，按套复用）

```css
/* 通用安全式 */
.bullet li { display: flex; gap: .9rem; align-items: flex-start; }
.bullet li::before { content: ""; flex-shrink: 0; margin-top: .58em;
  width: 8-12px; height: 8-12px; border-radius: 50%; background: var(--accent); }

/* 家族签名（见 AVOID_LIST 第八节，不得跨套扩散）：
   01/09/10/11/12: content:"•" 大圆点 2rem 强调色    02: content:"✦" 星符 #a18cd1
   03: 11px 实心圆                       04: 15×2px 短横线（content:""）
   06: 12px 圆角方块渐变填充 */
```

### 渐变标题字（玻璃系原版基因）

```css
h1 { background: linear-gradient(45deg, #2c3e50, #4b6cb7);   /* 01：45° 墨蓝 */
     -webkit-background-clip: text; background-clip: text;
     -webkit-text-fill-color: transparent; }
/* 02: 135° #30cfd0→#330867   05 不用渐变字：纯色深叶绿标题 + 标题下签名渐变横线
   09: 45° #6b3b23→#c96f4a    10: 45° #17555c→#0f9494
   11: 45° #6d2c46→#b0567a    12: 45° #5c3a12→#b0722e */
```

仅限封面/结尾 h1 与数据大字；每套渐变色对是固定身份值，不要自创新渐变。

### 05 套签名：标题渐变横线（title-line）

```css
/* 原版签名：每个带标题的页，标题下方一条 100×6px 渐变横线 */
.title-line { width: 100px; height: 6px; border-radius: 3px;
  background: linear-gradient(90deg, #86efac, #93c5fd);
  margin: clamp(.65rem, 1.6vh, 1rem) 0 clamp(.8rem, 2vh, 1.2rem); }
```

### 强调框（note）
```css
.note {
  background: var(--accent-soft);
  border-left: 4px solid var(--accent);
  border-radius: 0 12px 12px 0;
  padding: .85rem 1.15rem;
}
```

### 数据卡
大数字用 `--accent` + `font-variant-numeric: tabular-nums`；数字在上、标签居中、补充说明用次文字色。

### 表格
表头用强调色或加粗；行分隔线 1px 低透明度；单元格 padding ≥.8rem；禁止整行斑马纹花色。

### 时间线
连接线用 `--accent` 的 15-30% 透明色；节点圆环 `border: 3-4px solid var(--accent)`；玻璃系窄舞台建议 ≤3 步，且小屏断点下改纵向。

### 徽章（pill/badge）
`display: inline-block; align-self: flex-start;`（父容器是 column flex，不加会拉伸满行——历史缺陷，已修复，勿回退）。

---

## 七、代码块与语法高亮（零依赖方案）

不使用任何高亮库。用 span + 语义 class 手工着色：

```css
.codeblock {
  background: 深色底(暗色主题下更深);
  font-family: ui-monospace, "SF Mono", Consolas, monospace;
  font-size: clamp(.76rem, 1.15vw, .95rem); line-height: 1.7;
  overflow: auto;
}
.codeblock .win { /* 注释 灰 */ }
.codeblock .atk { /* @规则 蓝 */ }
.codeblock .prp { /* 属性 琥珀 */ }
.codeblock .val { /* 值 绿 */ }
.codeblock .sel { /* 选择器 紫 */ }
```

语法色属于「内容语义」，不受「唯一强调色」约束；但 UI 层（标题/按钮/列表点/进度条）仍然只用一个强调色。

---

## 八、SVG 图表（零依赖方案）

不使用 Chart.js 等图表库。折线/条形/分组柱状/环形图一律手绘内联 SVG：

- 画布：`viewBox="0 0 620 180~252"` 量级，`width: 100%; height: auto`，绝不定死像素高宽。
- 折线：`polyline stroke=强调色 stroke-width=3` + 数据点 `circle r=4-5` + 面积填充 `opacity .12`。
- 条形：`rect rx=7`，底轨用 `--accent-soft`，数值标签放条右 8px；**viewBox 宽度要给右侧数值标签留足空间**（标签终点 ≤ viewBox 宽 - 8px，否则会被裁剪）。
- 分组柱状图（双系列，如「预期 vs 实际」）：每组两根 `rect` 并排（宽 24、间隔 4），主系列用强调色、次系列用半透明辅助色（如 `rgba(59,130,246,.45)`）；配水平网格线 + Y 轴刻度 + 图例（色块 14×14 圆角 + 文本，放图表头部右侧）；深浅双主题下文字用 `fill: var(--text-muted)` 类方案自适应。
- 环形图：`circle stroke-dasharray` 分段 + `transform="rotate(-90 60 60)"` 从顶部起笔，段间留 3 单位间隙；中心放主份额数值（大字）+ 标签（小字）；配 HTML 图例列表（色块 + 名称 + 右对齐百分比）。分段长度按 `2πr × 份额` 换算。
- 统计卡进度条（原版「转化达成 75%」形式）：6-10px 圆角轨道 + 强调色填充 + 可选小字说明（`.stat-progress` / `.stat-progress-cap`）；双主题下轨道色用 `var(--line)` 类变量。
- 文本：SVG 内 `font-size` 用 13-16 绝对值（viewBox 坐标系内自适应缩放）。
- 坐标自行换算并确保所有点落在 viewBox 内；图表标题放 SVG 外部 HTML。

---

## 九、导航控件与进度

```css
/* 右下角控件 */
.controls { position: fixed; bottom: 28px; right: 44px; display: flex; align-items: center; gap: 14px; z-index: 10; }
/* 或舞台内底部导航条（如 02/04/07） */
```

- 按钮 36-40px，hover 变强调色底 + 白字；圆角 6-15px。
- 进度条：舞台外顶部 5px 通栏（01/09-12 范式）或舞台内顶部/底部 3px 内条。
- 页码 `#pageCounter`：`font-variant-numeric: tabular-nums`。
- 进度条与页码由引擎统一驱动（`#progressFill`、`#pageCounter`），缺省需判空。

---

## 十、生成后自检（不可跳过）

1. **溢出检测**：用无头浏览器逐页激活并测量 `scrollHeight > clientHeight` 与元素越界（脚本思路见仓库 scripts/qa_overflow.js）。任何一页溢出都视为失败，回炉改文案而不是缩字号。
2. **零依赖扫描**：全文搜索 `http://`、`https://`、`<link`、`<script src`、`@import`，必须零结果。
3. **交互冒烟**：键盘翻页到底再回头、`#n` 深链、触摸（移动端）、双主题模板切换后对比度无明显劣化。
4. **动效开关**：开启 `prefers-reduced-motion` 后页面仍完全可用。
5. **标题单行**：逐页检查 h1/h2 直接文本只占一行（Range.getClientRects 计行数），跨行即改文案。
