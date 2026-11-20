# ncchen99.github.io

陳念誠的個人網頁：一段使命宣言，加上共振（Resonance）的介紹。視覺沿用共振官網的語言：暖色紙張、漂浮後靜止的泡泡、小紙團（Paper Pals）、手繪的邊緣與筆線，全站沒有陰影。

純靜態網站，沒有建置步驟，也不用 `npm install`：`site/` 裡的檔案就是上線的內容。

## 在本機看

```bash
python3 -m http.server 4410 --bind 127.0.0.1 --directory site
# 打開 http://127.0.0.1:4410（?lang=en / ?lang=zh 可指定語言）
```

ES modules 不能從 `file://` 載入，一定要透過伺服器打開。

## 內容在哪裡改

- 所有文字（中英文並列）：`site/index.html`，`data-l="zh"` 與 `data-l="en"` 成對出現
- 頁面標題與描述（切換語言時更新）：`site/js/main.js` 的 `META`
- 樣式與配色：`site/css/site.css`（色票取自共振的 `src/styles/tokens.css`）
- 泡泡的位置、顏色與漂浮節奏：`site/js/main.js` 的 `SCENES`、`SETTLE`
- 小紙團的姿勢與大小：`site/js/main.js` 的 `POSES`、`STAGE_HEIGHT`

## 從共振借來的部分

這幾個檔案是從共振名片（`Resonance-Business-Card`）複製過來的，名片本身也是從共振主程式移植的，所以和官網長得一樣。要更新就從那邊重新複製，不要在這裡改：

| 檔案 | 內容 |
| --- | --- |
| `site/js/blobs.js` | 泡泡（metaball）引擎，移植自共振的 `src/lib/design/driftingBlobs.ts` |
| `site/js/puppet.js`、`site/js/cast.js`、`site/assets/mascots/` | 小紙團的骨架與零件圖（摺摺、牽牽、聆聆） |
| `site/js/organic.js`、`site/css/organic.css` | 手繪按鈕、分隔線、波浪底線、地球圖示（`organic.css` 只留淺色主題） |

## 中英雙語

依訪客的系統語言決定（`zh-*` 顯示中文，其他顯示英文），右上角可以手動切換，選擇會記在瀏覽器裡；網址的 `?lang=` 優先於兩者。語言在第一次繪製前就決定好（`index.html` 開頭的小段 script），所以不會先閃一下另一種語言。

## 動態

泡泡會漂一陣子、有一顆小泡泡飄進來融進大泡泡，約 20 秒後靜止（共振首頁的原則：視線應該停在文字上）。小紙團會眨眼，進入畫面時揮手，滑鼠經過時再揮一次。開啟「減少動態效果」時，泡泡直接畫成靜止的樣子，小紙團不眨眼也不揮手。

## 部署（GitHub Pages）

推上 `main` 後，`.github/workflows/deploy.yml` 會把 `site/` 原封不動發佈出去（repo 的 Settings → Pages → Source 要設為 **GitHub Actions**）。部落格 `ncchen99.github.io/blog` 是另一個 repo 的 project page，不受影響。
