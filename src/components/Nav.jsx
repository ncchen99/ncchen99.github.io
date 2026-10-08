import { useLang } from '../i18n'
import LangToggle from './LangToggle'

export default function Nav({ label = '念誠', shortLabel = label }) {
  const { t } = useLang()
  return (
    // Mobile: a solid, blurred bar so scrolling content stays readable beneath it.
    // Desktop (the deck): transparent + mix-blend so it reads over any act.
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-line/60 bg-[var(--nav-bg)] backdrop-blur-md md:border-0 md:bg-transparent md:backdrop-blur-none md:mix-blend-difference">
      <div className="mx-auto flex max-w-wide items-center justify-between gap-4 px-6 py-4 md:px-12 md:py-8">
        <a
          href="#hero"
          className="eyebrow !text-ink md:!text-paper"
          aria-label={t({ zh: '回到頂端', en: 'Back to top' })}
        >
          <span key={label} className="inline-block nav-label">
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{shortLabel}</span>
          </span>
        </a>
        <div className="flex shrink-0 items-center gap-4 sm:gap-6 md:gap-10">
          <a href="#work" className="eyebrow link-underline !text-ink md:!text-paper">
            Work
          </a>
          <a
            href="https://ncchen99.github.io/blog"
            className="eyebrow link-underline !text-ink md:!text-paper"
          >
            Blog
          </a>
          <a
            href="#contact"
            className="eyebrow link-underline !text-ink md:!text-paper"
          >
            Contact
          </a>
          {/* language switch — set apart from the section links by a hairline */}
          <span aria-hidden="true" className="hidden h-3 w-px bg-ink/25 sm:block md:bg-paper/40" />
          <LangToggle className="!text-ink md:!text-paper" />
        </div>
      </div>
    </nav>
  )
}
