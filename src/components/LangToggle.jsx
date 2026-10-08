import { useLang } from '../i18n'

// 中 / EN — the active language reads at full strength, the other one faded.
// Phones only have room for the language you'd switch to.
export default function LangToggle({ className = '' }) {
  const { lang, setLang } = useLang()
  const next = lang === 'zh' ? 'en' : 'zh'

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={lang === 'zh' ? 'Switch to English' : '切換為中文'}
      title={lang === 'zh' ? 'English' : '中文'}
      className={`eyebrow flex items-center gap-[0.45em] whitespace-nowrap !tracking-[0.18em] ${className}`}
    >
      <span lang="zh-Hant" className={lang === 'zh' ? 'hidden sm:inline' : 'sm:opacity-45'}>
        中
      </span>
      <span aria-hidden="true" className="hidden opacity-45 sm:inline">
        /
      </span>
      <span lang="en" className={lang === 'en' ? 'hidden sm:inline' : 'sm:opacity-45'}>
        EN
      </span>
    </button>
  )
}
