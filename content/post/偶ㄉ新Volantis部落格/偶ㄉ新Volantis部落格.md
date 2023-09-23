---
title: 🎊偶ㄉ新 Volantis 部落格👨‍💻
date: 2021-02-28 14:45:42
slug: 偶ㄉ新Volantis部落格
description: Volantis 主題配置🤔
tags: 
  - Hexo
categories:
  - 部落格
image: https://i.imgur.com/3mr5UsF.jpg

---

## :no_good: 廢話ㄉ地方

因為之前以為舊的 Hexo 部落格壞掉惹 :-1: 偶真的很呆 :accept: 所以就整個打掉重用惹 🦄 這次有遇到一些問題 :bento: 想說記下來以免忘記惹　:100:

## :100: 推廣 Volantis 主題

- 文件真的非常完整，可以配置的東西超多的，如果比較懶，`_config.volantis.yml` 可以用官方的 example 改。
- 作者人很好，有問題都可以問，雖然我問了一個智障問題，沒倫李偶。

## :panda_face: 遇到ㄉ問題

### 1.　作者資訊底下的那幾個 icon 需要另外配置 :1234:

在 `sidebar:` => `widget_library:` => `blogger:` => `social:` 底下加東西，像下面醬子 :diamond_shape_with_a_dot_inside:

```yaml=
blogger:
  class: blogger
  display: [desktop, mobile] # [desktop, mobile]
  avatar: https://cdn.jsdelivr.net/gh/ncchen99/web-app-assets@1.1/blog/image/png/extend-sun.png
  shape: rectangle # circle, rectangle
  url: /about/
  title: 念誠
  subtitle: 偶很乖👨‍💻
  jinrishici: false # Poetry Today. You can set a string, and it will be displayed when loading fails.
  #social: true
  social:
    - icon: fab fa-facebook
      url: https://www.facebook.com/WHCSCKids/
    - icon: fas fa-envelope
      url: mailto:ncchen99@gmail.com
    - icon: fab fa-github
      url: https://github.com/ncchen99/
    - icon: fab fa-instagram
      url: https://www.instagram.com/ncchen.foss/
```

| 效果圖 :+1: | ![](https://i.imgur.com/UTTQQmr.png) |
| ----------- | ------------------------------------ |

### 2. Git deployer 怪怪ㄉ :anguished:

這個不知道為神魔 :angry: 如果遇到 `hexo g` 完， `hexo s` 正常，但是 `hexo d` 之後修改沒有生效，導致在本地預覽和 gh page 上看起來不太一樣，重裝 `hexo-deployer-git`　試試看！

```bash=
npm un hexo-deployer-git
npm i hexojs/hexo-deployer-git
```

### 3. 使用 ![](https://i.imgur.com/Dwr5SNm.png) :100:

看到它的配置裡面，資源取的都是用這個的 :space_invader: 我也不知到怎摸讓圖片之類的生成的時候跑到`public`之廖夾，所以還是去看 jsDeliver 怎模用 🤨 　原來只需要在 Github 開一個[存東西專用的 repo](https://github.com/ncchen99/web-app-assets)，把要用的東西都 push 上去之後，用一個 release，組合網址之後就可以取用檔案惹！像是這個:point_right: [![](https://data.jsdelivr.com/v1/package/gh/ncchen99/web-app-assets/badge)](https://www.jsdelivr.com/package/gh/ncchen99/web-app-assets)

### 4. 有些 Font Awesome 粗不來 :smile:

有些會變成一個格子，可以先檢查是不是用最新的版本，再來就是名字前面`fas`、`fab`、`fa`有沒有對 :8ball:

### 5. 讓畫面有玻璃的效果 :+1:

這個偶找惹有夠九才發現葛模改 :cry: ，太呆惹。
總之，修改這個很像 css 的東西：）

```sass=
file: /node_modules/hexo-theme-volantis/source/css/_defines/effect.styl

.blur
  @supports (backdrop-filter: blur(20px))
    background: alpha($color-card, .75) !important
    backdrop-filter: saturate(200%) blur(20px)
```

偶們只要改阿爾法的透明度即可，像偶是改到 0.75 :a: 變程醬子 :hamburger:

![](https://i.imgur.com/4eNDOQF.jpg)

![](https://i.imgur.com/3mr5UsF.jpg)
