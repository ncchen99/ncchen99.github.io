import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Two languages: 繁中 (zh) and English (en). The first visit follows the
// visitor's system language — any zh-* locale gets Chinese, everything else
// English. Picking a language with the nav toggle is remembered, and
// `?lang=en` / `?lang=zh` in the URL wins over both (handy for sharing).

export const LANGS = ['zh', 'en']
const STORAGE_KEY = 'lang'

const META = {
  zh: {
    htmlLang: 'zh-Hant',
    title: '念誠 — Nian-Cheng Chen',
    description: '結合資訊科技與商業，打造讓世界更溫暖的產品。',
  },
  en: {
    htmlLang: 'en',
    title: 'Nian-Cheng Chen — 念誠',
    description: 'Blending technology and business to build products that make the world a little warmer.',
  },
}

const normalize = (value) => {
  if (!value) return null
  const v = String(value).toLowerCase()
  if (v.startsWith('zh')) return 'zh'
  if (v.startsWith('en')) return 'en'
  return null
}

const fromUrl = () => {
  try {
    return normalize(new URLSearchParams(window.location.search).get('lang'))
  } catch {
    return null
  }
}

const fromStorage = () => {
  try {
    return normalize(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export const systemLang = () => {
  const list = navigator.languages?.length ? navigator.languages : [navigator.language]
  return normalize(list[0]) === 'zh' ? 'zh' : 'en'
}

const detect = () => fromUrl() || fromStorage() || systemLang()

// Pick the right side of a `{ zh, en }` pair; plain values pass through.
export const pick = (value, lang) =>
  value && typeof value === 'object' && !Array.isArray(value) && 'zh' in value
    ? value[lang] ?? value.zh
    : value

const LangContext = createContext({ lang: 'zh', setLang: () => {}, t: (v) => v })

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detect)

  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* private mode — the choice just won't persist */
    }
    // keep a shared ?lang= link in step with the toggle
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', next)
      window.history.replaceState(null, '', url)
    }
  }, [])

  // Follow the OS language live, as long as the visitor hasn't chosen one.
  useEffect(() => {
    const onChange = () => {
      if (!fromUrl() && !fromStorage()) setLangState(systemLang())
    }
    window.addEventListener('languagechange', onChange)
    return () => window.removeEventListener('languagechange', onChange)
  }, [])

  useEffect(() => {
    const meta = META[lang]
    document.documentElement.lang = meta.htmlLang
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t: (v) => pick(v, lang) }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
