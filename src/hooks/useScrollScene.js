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
        let targetIndex = 0
        let animating = false

        // Count gestures, not events. A wheel/trackpad flick emits a long burst
        // of events (the inertia tail); the whole burst must count as ONE act.
        // Rule: accept a single event, then swallow every follow-up until the
        // input genuinely goes quiet (Observer.onStop, fired only after a real
        // gap) *and* a short cooldown since the last accepted flick has elapsed.
        // Continuous inertia never goes quiet mid-burst, so one flick = one act;
        // two deliberate flicks are separated by a real gap, so each is counted —
        // even while a transition is mid-flight, thanks to the queue in drive().
        let locked = false // swallow events until the current flick is spent
        let lastFire = 0 // timestamp (ms) of the last accepted flick
        const MIN_GAP = 120 // ms — floor between two distinct flicks

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
              // pick up any act that was queued while this one was running
              drive()
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

        // advance one act toward targetIndex; if a transition is already running,
        // do nothing now — its onComplete calls drive() again to pick up whatever
        // targetIndex became in the meantime (this is the queue).
        const drive = () => {
          if (animating || targetIndex === index) return
          go(index + (targetIndex > index ? 1 : -1))
        }

        const step = (dir) => {
          const now = performance.now()
          if (locked || now - lastFire < MIN_GAP) return
          locked = true // swallow the rest of this flick until onStop re-opens
          lastFire = now
          targetIndex = Math.max(0, Math.min(N - 1, targetIndex + dir))
          drive()
        }

        const observer = Observer.create({
          target: viewport,
          type: 'wheel,touch',
          wheelSpeed: -1,
          tolerance: 10,
          preventDefault: true,
          // fire only after the input has been quiet this long — long enough that
          // a decaying inertia tail never counts as a stop, so the whole flick is
          // one gesture; a deliberate second flick clears this gap and re-opens.
          onStopDelay: 0.12,
          onStop: () => {
            locked = false // flick fully spent; ready for the next gesture
          },
          onUp: () => step(1), // scroll down -> next act
          onDown: () => step(-1), // scroll up -> previous act
        })

        // Keyboard arrow controls
        const handleKeyDown = (e) => {
          if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
            e.preventDefault()
            const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1
            targetIndex = Math.max(0, Math.min(N - 1, targetIndex + dir))
            drive()
          }
        }
        window.addEventListener('keydown', handleKeyDown)

        // gentle intro for the hero
        gsap.from(scenes[0], { autoAlpha: 0, duration: 0.9, ease: 'power2.out' })

        return () => {
          observer.kill()
          window.removeEventListener('keydown', handleKeyDown)
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
