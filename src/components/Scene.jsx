const BGS = {
  cream: 'var(--bg-cream)',
  lavender: 'var(--bg-lavender)',
  terracotta: 'var(--bg-terracotta)',
  sky: 'var(--bg-sky)',
  yellow: 'var(--bg-yellow)',
  sage: 'var(--bg-sage)',
  lime: 'var(--bg-lime)',
  red: 'var(--bg-red)',
  contact: 'var(--bg-contact)',
}

// One full-viewport act. On desktop GSAP stacks these in a pinned viewport: the
// current scene blurs out of focus and the next one surfaces into focus in its
// place. Each scene carries its own barely-there background tint (`tint`), so
// the palette shifts gently from act to act.
export default function Scene({ id, tint = 'cream', children }) {
  return (
    <section
      id={id}
      data-scene
      className="scene"
      style={{ '--scene-bg': BGS[tint] || BGS.cream }}
    >
      <div className="scene-content">
        <div className="scene-inner mx-auto max-w-wide px-6 md:px-12">{children}</div>
      </div>
    </section>
  )
}
