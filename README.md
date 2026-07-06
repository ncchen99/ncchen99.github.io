# ncchen99.github.io

陳念誠的個人介紹網頁 — 極簡設計師品牌風格。Vite + React + Tailwind CSS。

## 開發

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 產生 dist/
npm run preview  # 預覽正式版
```

## 內容在哪裡改

- 個人宣言（首頁）：`src/components/Hero.jsx`
- 專案內容 / 順序 / 連結：`src/data/projects.js`
- 聯絡方式：`src/components/Contact.jsx`
- 配色與字體：`tailwind.config.js`、`src/index.css`

## 換上共振（Resonance）的正式截圖

目前 `public/images/resonance/resonance-1.svg`、`resonance-2.svg` 是佔位圖。
把兩張水平長方形截圖放到 `public/images/resonance/`，再到
`src/data/projects.js` 裡把 `resonance` 的 `images` 路徑改成你的檔名即可。

## 部署（GitHub Pages）

已內建 `.github/workflows/deploy.yml`：推上 `main` 後由 GitHub Actions
自動 build 並發佈。第一次使用需到 repo **Settings → Pages → Build and
deployment → Source** 切換為 **GitHub Actions**。

> ⚠️ 部落格：`ncchen99.github.io/blog` 若要與本站共存，需讓它一併出現在
> 發佈的內容裡（例如把部落格輸出放進 `public/blog/`，build 後會落在
> `dist/blog/`）。目前導覽列的 Blog 連結已指向該網址。
