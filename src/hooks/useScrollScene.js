import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// The focus choreography.
//
// Desktop: every scene is stacked in one pinned viewport. Scrolling scrubs a
// master timeline. Per transition i -> i+1:
//   1. the current scene drifts OUT of focus (gaussian blur builds up) while it
//      stays put beneath;
//   2. once it has softened, the next scene surfaces INTO focus in its place —
//      fading in from blurred to sharp (opacity only, never sliding).
// Each scene owns a barely-there background tint, so the palette shifts gently
// as one act dissolves into the next. Because focus is fully owned by this
// scrubbed timeline, nothing can get "stuck" blurred — scrolling back reverses
// every blur cleanly.
//
// Mobile / reduced-motion: no pinning — scenes flow normally with a soft
// focus-in as each enters, and the header label is tracked with an observer.
export function useScrollScene({ onActive } = {}) {
  useLayoutEffect(() => {
    const viewport = document.getElementById('stageViewport')
    if (!viewport) return
    // scenes inside the pinned stage (Hero + Work); Contact lives outside it
    const scenes = gsap.utils.toArray(viewport.querySelectorAll('[data-scene]'))
    if (scenes.length === 0) return
    const contactEl = document.getElementById('contact')
    // every act, in document order — used by the mobile flow observer
    const allScenes = gsap.utils.toArray('[data-scene]')

    // within the stage, act 0 is home and the rest are work
    const kindOf = (i) => (i === 0 ? 'home' : 'work')
    const kindOfAll = (i) =>
      allScenes[i] === contactEl ? 'contact' : i === 0 ? 'home' : 'work'

    const mm = gsap.matchMedia()

    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        if (!ctx.conditions.desktop) return

        viewport.classList.add('stage--active')

        const N = scenes.length
        const BLUR = 18 // px of defocus at full dissolve

        // resting state: only the first act in focus; the rest sit hidden and
        // pre-blurred, ready to surface. autoAlpha also toggles visibility so
        // hidden acts never intercept clicks.
        scenes.forEach((s, i) =>
          gsap.set(s, {
            autoAlpha: i === 0 ? 1 : 0,
            filter: i === 0 ? 'blur(0px)' : `blur(${BLUR}px)`,
          }),
        )

        const segment = () => window.innerHeight * 0.9

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: viewport,
            start: 'top top',
            end: () => '+=' + (N - 1) * segment(),
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            // once scrolling settles, glide to the nearest whole act so we
            // never rest in a half-blurred "auto-focusing" state — cross the
            // midpoint of a segment and it completes to the next act, otherwise
            // it falls back to the current one.
            snap: {
              snapTo: 1 / (N - 1),
              // snappy in both directions: fire the instant scrolling stops and
              // resolve fast, with a quick-out ease so it feels immediate rather
              // than drifting into place.
              duration: { min: 0.12, max: 0.28 },
              delay: 0,
              ease: 'power3.out',
              directional: false,
            },
            onUpdate: (self) => {
              const idx = Math.round(self.progress * (N - 1))
              onActive?.(kindOf(idx))
            },
          },
        })

        for (let i = 0; i < N - 1; i++) {
          const cur = scenes[i]
          const nxt = scenes[i + 1]
          tl.addLabel('s' + i, i)
          // 1 — current act softens out of focus (stays put beneath)
          tl.to(cur, { filter: `blur(${BLUR}px)`, ease: 'none', duration: 0.55 }, i)
          // 2 — next act surfaces into focus, in place
          tl.fromTo(
            nxt,
            { autoAlpha: 0, filter: `blur(${BLUR}px)` },
            { autoAlpha: 1, filter: 'blur(0px)', ease: 'none', duration: 0.6 },
            i + 0.4,
          )
        }

        // gentle intro for the hero
        gsap.from(scenes[0], { autoAlpha: 0, duration: 1, ease: 'power2.out' })

        // Contact sits after the pinned stage in normal flow — surface it into
        // focus as it scrolls up, and swap the header label to match.
        if (contactEl) {
          const cc = contactEl.querySelector('.scene-content')
          gsap.fromTo(
            cc,
            { autoAlpha: 0, filter: 'blur(16px)' },
            {
              autoAlpha: 1,
              filter: 'blur(0px)',
              ease: 'none',
              scrollTrigger: {
                trigger: contactEl,
                start: 'top 82%',
                end: 'top 42%',
                scrub: true,
              },
            },
          )
          ScrollTrigger.create({
            trigger: contactEl,
            start: 'top 55%',
            onEnter: () => onActive?.('contact'),
            onLeaveBack: () => onActive?.('work'),
          })
        }

        return () => viewport.classList.remove('stage--active')
      },
    )

    // fallback tracker: header label + soft focus-in on mobile / reduced-motion
    let io
    mm.add('(max-width: 767.98px), (prefers-reduced-motion: reduce)', () => {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const i = allScenes.indexOf(e.target)
              if (i >= 0) onActive?.(kindOfAll(i))
            }
          })
        },
        { threshold: 0.5 },
      )
      allScenes.forEach((s) => io.observe(s))

      // each act eases in from a touch blurred + lifted as it enters
      allScenes.forEach((s, i) => {
        if (i === 0) return
        gsap.fromTo(
          s.querySelector('.scene-content'),
          { opacity: 0, y: 26, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: s, start: 'top 78%', once: true },
          },
        )
      })
      return () => io?.disconnect()
    })

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready?.then(refresh)
    const t = setTimeout(refresh, 600)

    return () => {
      window.removeEventListener('load', refresh)
      clearTimeout(t)
      io?.disconnect()
      mm.revert()
    }
  }, [onActive])
}
