import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(ScrollTrigger, Observer)

// The focus choreography.
//
// Desktop: the whole thing is a fixed deck of full-screen acts. A single scroll
// gesture (wheel / trackpad / touch) flips exactly ONE card, immediately — the
// current act blurs out of focus while the next surfaces into focus in place
// (opacity only, never sliding). No native scrolling, so there is no scroll-end
// detection lag and no way to skip several acts with one hard flick; a gesture
// is ignored until the current transition finishes.
//
// Mobile / reduced-motion: no deck — acts flow normally with a soft focus-in as
// each enters, and the header label is tracked with an IntersectionObserver.
export function useScrollScene({ onActive } = {}) {
  useLayoutEffect(() => {
    const viewport = document.getElementById('stageViewport')
    if (!viewport) return
    const scenes = gsap.utils.toArray('[data-scene]')
    if (scenes.length === 0) return
    const contactEl = document.getElementById('contact')

    const kindOf = (i) =>
      scenes[i] === contactEl ? 'contact' : i === 0 ? 'home' : 'work'

    const mm = gsap.matchMedia()

    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        if (!ctx.conditions.desktop) return

        viewport.classList.add('stage--active')

        const N = scenes.length
        const BLUR = 18 // px of defocus between acts
        let index = 0
        let animating = false

        // Count gestures, not events. Fire on a decisive push, then lock until
        // *this* flick is spent — either its inertia decays (velocity falls near
        // zero) or the input fully stops. So one flick = one act no matter how
        // hard, while each fresh flick (a new velocity spike) advances one more,
        // even during a continuous rapid-scroll burst.
        let armed = true
        let hot = false // re-armed mid-inertia? then require a real spike to fire
        const FIRE_ABOVE = 200 // px/s — a push this brisk is a fresh gesture
        const ARM_BELOW = 40 // px/s — below this the current flick is spent

        // resting state: only the first act in focus; the rest hidden and
        // pre-blurred, ready to surface. autoAlpha also toggles visibility so
        // hidden acts never intercept clicks.
        gsap.set(scenes, { autoAlpha: 0, filter: `blur(${BLUR}px)` })
        gsap.set(scenes[0], { autoAlpha: 1, filter: 'blur(0px)' })
        onActive?.(kindOf(0))

        const go = (target) => {
          if (animating || target < 0 || target > N - 1 || target === index)
            return
          animating = true
          const cur = scenes[index]
          const nxt = scenes[target]
          index = target
          onActive?.(kindOf(target))

          // the incoming act always rides on top and surfaces into focus; the
          // outgoing one softens beneath it (works the same in both directions)
          gsap.set(nxt, { zIndex: 2 })
          gsap.set(cur, { zIndex: 1 })

          const tl = gsap.timeline({
            onComplete: () => {
              gsap.set(cur, { autoAlpha: 0 })
              animating = false
            },
          })
          tl.fromTo(
            nxt,
            { autoAlpha: 0, filter: `blur(${BLUR}px)` },
            { autoAlpha: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' },
            0,
          )
          tl.to(
            cur,
            { filter: `blur(${BLUR}px)`, duration: 0.38, ease: 'power2.in' },
            0,
          )
        }

        const step = (dir) => {
          const v = Math.abs(observer.velocityY)
          if (!armed) {
            // locked: re-arm only once this flick has spent itself
            if (!animating && v < ARM_BELOW) {
              armed = true
              hot = true // guard against this same flick's low-speed tail
            }
            return
          }
          // ignore the decaying tail of the flick that just fired
          if (hot && v < FIRE_ABOVE) return
          armed = false
          hot = false
          go(index + dir)
        }

        const observer = Observer.create({
          target: viewport,
          type: 'wheel,touch',
          wheelSpeed: -1,
          tolerance: 10,
          preventDefault: true,
          // a clean full stop is a fresh gesture boundary — any next push counts
          onStopDelay: 0.08,
          onStop: () => {
            armed = true
            hot = false
          },
          onUp: () => step(1), // scroll down -> next act
          onDown: () => step(-1), // scroll up -> previous act
        })

        // gentle intro for the hero
        gsap.from(scenes[0], { autoAlpha: 0, duration: 0.9, ease: 'power2.out' })

        return () => {
          observer.kill()
          viewport.classList.remove('stage--active')
        }
      },
    )

    // fallback: header label + soft focus-in on mobile / reduced-motion
    let io
    mm.add('(max-width: 767.98px), (prefers-reduced-motion: reduce)', () => {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const i = scenes.indexOf(e.target)
              if (i >= 0) onActive?.(kindOf(i))
            }
          })
        },
        { threshold: 0.5 },
      )
      scenes.forEach((s) => io.observe(s))

      // each act eases in from a touch blurred + lifted as it enters
      scenes.forEach((s, i) => {
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
