export default function Nav({ label = '念誠' }) {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full mix-blend-difference text-paper">
      <div className="mx-auto flex max-w-wide items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <a href="#hero" className="eyebrow !text-paper" aria-label="回到頂端">
          <span key={label} className="inline-block nav-label">
            {label}
          </span>
        </a>
        <div className="flex items-center gap-6 md:gap-10">
          <a href="#work" className="eyebrow !text-paper link-underline">
            Work
          </a>
          <a
            href="https://ncchen99.github.io/blog"
            className="eyebrow !text-paper link-underline"
          >
            Blog
          </a>
          <a href="#contact" className="eyebrow !text-paper link-underline">
            Contact
          </a>
        </div>
      </div>
    </nav>
  )
}
