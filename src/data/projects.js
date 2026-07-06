// Project data — purpose-first. Tech stacks, timelines, roles and "who it helps"
// framing removed on purpose; each entry states what the thing is *for*.
// No trailing 句號 anywhere, per the site's typographic rules.
//
// tint                 -> which pale sea rises over this scene (see Scene.jsx)
// image.wide === true  -> landscape shot   (50/50 layout, stacked vertically)
// image.wide falsy     -> portrait / GIF   (compact horizontal row)
// hidden === true      -> kept in source but not rendered

export const projects = [
  {
    id: 'resonance',
    name: '共振',
    latin: 'Resonance',
    tint: 'lavender',
    lead: '讓每個同頻的靈魂，透過真實故事彼此相遇',
    body:
      '一個以「思維」與「故事」為核心的社群平台，相信每一個平凡的生命裡，都藏著值得被世界聽見的智慧；讓真實的故事，成為傳遞正向思維的光——使世界因連結而更有意識、更溫暖',
    note: 'Let lives influence lives.',
    href: 'https://resonance-world.vercel.app/zh-TW',
    hrefLabel: 'resonance-world.vercel.app',
    images: [
      { src: '/images/resonance/resonance-1.avif', alt: '共振平台畫面一', wide: true },
      { src: '/images/resonance/resonance-2.avif', alt: '共振平台畫面二', wide: true },
    ],
  },
  {
    id: 'tuckin',
    name: 'Tuckin',
    latin: 'Tuckin',
    tint: 'terracotta',
    lead: '一頓晚餐，把陌生的同學變成朋友',
    body:
      '為成大學生打造的聚餐媒合平台：按一下預約，剩下的分組、投票、湊時間都交給系統，讓認識新朋友這件事幾乎沒有門檻，上線後累積 300 位使用者',
    href: 'https://github.com/ncchen99/Tuckin',
    hrefLabel: 'github.com/ncchen99/Tuckin',
    images: [
      { src: '/images/tuckin/screenshot-1.png', alt: 'Tuckin 主畫面' },
      { src: '/images/tuckin/screenshot-2.png', alt: 'Tuckin 預約流程' },
      { src: '/images/tuckin/screenshot-3.png', alt: 'Tuckin 餐廳投票' },
    ],
  },
  {
    id: 'ncku-ca',
    name: '成大社聯會官網',
    latin: 'NCKU-CA',
    tint: 'sky',
    lead: '全校 230 個社團每天在使用的數位平臺',
    body:
      '把社團的活動報名、現場點名與保證金作業全面數位化，讓繁瑣的紙本流程變成線上填表與即時查詢，成為社聯會與社團幹部日常的營運骨幹',
    href: 'https://ncku-ca.vercel.app',
    hrefLabel: 'ncku-ca.vercel.app',
    images: [
      { src: '/images/ncku-ca/demo3.png', alt: 'NCKU-CA 前臺畫面', wide: true },
      { src: '/images/ncku-ca/demo4.png', alt: 'NCKU-CA 後臺管理', wide: true },
    ],
  },
  {
    id: 'coffee-pocket',
    name: 'Coffee Pocket',
    latin: 'Coffee Pocket',
    tint: 'yellow',
    lead: '用一句話，找到剛好對味的咖啡廳',
    body:
      '以臺南咖啡廳為主題的探索與收藏工具，用自然語言或標籤，就能找到「有插座、不限時、適合工作」的店家——把翻遍評論的十幾分鐘，變成一次幾秒鐘的搜尋',
    href: 'https://tainan-cafe.web.app/',
    hrefLabel: 'tainan-cafe.web.app',
    images: [
      { src: '/images/coffee-pocket/home.gif', alt: 'Coffee Pocket 首頁' },
      { src: '/images/coffee-pocket/search.gif', alt: 'Coffee Pocket 語意搜尋' },
      { src: '/images/coffee-pocket/pocket.gif', alt: 'Coffee Pocket 口袋名單' },
    ],
  },
  {
    id: 'zplit',
    name: 'Zplit',
    latin: 'Zplit',
    tint: 'sage',
    lead: '讓「先幫忙墊、之後一起算」變得毫無壓力',
    body:
      '即時同步的分帳工具，把一起出遊的團體帳，和朋友之間長期的往來帳合而為一，固定的朋友圈可以長期共用同一套工具，不必為每次聚會重新開始',
    href: 'https://zplit.web.app',
    hrefLabel: 'zplit.web.app',
    images: [
      { src: '/images/zplit/create-group.gif', alt: 'Zplit 建立群組' },
      { src: '/images/zplit/group-edit.gif', alt: 'Zplit 群組分帳' },
      { src: '/images/zplit/personal-add.gif', alt: 'Zplit 個人往來' },
    ],
  },
  {
    id: 'metro-sense',
    name: '捷境 MetroSense',
    latin: 'MetroSense',
    tint: 'sky',
    hidden: true,
    lead: '一套捷運 App，同時懂通勤族與觀光客',
    body:
      '結合 AI 的台北捷運智能助手，以「通勤 / 旅遊」模式切換讓介面隨情境改變，並用語音問答取代層層選單，讓長輩與旅客也能無門檻地查詢路線，榮獲北捷黑客松第一名與宏碁特別獎',
    href: 'https://metro-sense.vercel.app',
    hrefLabel: 'metro-sense.vercel.app',
    images: [
      { src: '/images/metro-sense/demo.png', alt: 'MetroSense 介面展示', wide: true },
    ],
  },
  {
    id: 'inksync',
    name: 'InkSync',
    latin: 'InkSync',
    tint: 'terracotta',
    hidden: true,
    lead: '用一支手機，同時點亮整面電子紙',
    body:
      '一套軟硬整合的 IoT 系統：手機 App 同時控制多台電子紙裝置的顯示內容，適用於展場看板與桌面資訊牌，相關電子紙提案獲元太科技創新設計工作坊第一名創新金獎',
    href: 'https://github.com/ncchen99/InkSync',
    hrefLabel: 'github.com/ncchen99/InkSync',
    images: [
      { src: '/images/inksync/epaper-device.jpg', alt: 'InkSync 電子紙裝置' },
      { src: '/images/inksync/app-home.png', alt: 'InkSync App 首頁' },
      { src: '/images/inksync/app-device-menu.png', alt: 'InkSync 裝置選單' },
    ],
  },
]
