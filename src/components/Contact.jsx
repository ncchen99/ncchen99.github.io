import { useState } from 'react'
import Scene from './Scene'

// Web3Forms — https://web3forms.com. Submissions are emailed straight to me;
// nothing is stored publicly (unlike a comments thread).
const ACCESS_KEY = '14e76bf5-b9c0-4c68-8286-5dae68b2f7ac'

const links = [
  { label: 'Email', href: 'mailto:ncchen99@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/ncchen99' },
  { label: 'Blog', href: 'https://ncchen99.github.io/blog' },
]

const inputClass =
  'w-full border border-line bg-transparent px-4 py-3 font-cjk text-base text-ink placeholder:text-muted/50 focus:border-ink focus:outline-none'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | ok | error

  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')
    const formData = new FormData(event.target)
    formData.append('access_key', ACCESS_KEY)
    formData.append('subject', '念誠的網站有新訊息！')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setStatus('ok')
        event.target.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <Scene id="contact" tint="contact">
      <div className="flex h-full min-h-full flex-col">
        {/* main — invitation + message box, centred in the remaining space */}
        <div className="grid flex-1 content-center items-center gap-x-16 gap-y-12 pt-20 md:grid-cols-12">
        {/* left — the invitation */}
        <div className="md:col-span-6">
          <h2 className="display text-3xl leading-[1.3] text-ink md:text-[2.7rem] md:leading-[1.24]">
            這邊可以聯絡念誠
          </h2>
          <p className="mt-6 font-cjk text-base leading-loose text-muted md:text-lg">
            很期待收到你的訊息
          </p>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.22em] text-muted">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="link-underline"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* right — the message box */}
        <div className="md:col-span-6">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* honeypot */}
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="name"
                required
                placeholder="你的名字"
                aria-label="你的名字"
                className={inputClass}
              />
              <input
                type="email"
                name="email"
                required
                placeholder="回覆用的信箱"
                aria-label="回覆用的信箱"
                className={inputClass}
              />
            </div>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="親愛的念誠⋯⋯"
              aria-label="留言"
              className={`${inputClass} resize-none leading-relaxed`}
            />
            <div className="mt-1 flex items-center justify-between gap-4">
              <p
                className="font-cjk text-sm text-muted"
                role="status"
                aria-live="polite"
              >
                {status === 'ok' && '訊息已送出，我會盡快回覆你 ✓'}
                {status === 'error' && '送出失敗，要不要直接寄信給我？'}
              </p>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="link-underline shrink-0 font-mono text-xs uppercase tracking-[0.24em] text-ink disabled:opacity-40"
              >
                {status === 'sending' ? '寄送中⋯' : '寄出 ↗'}
              </button>
            </div>
          </form>
        </div>

        </div>

        {/* footer — pinned flush to the bottom of the act */}
        <div className="flex flex-col gap-1 border-t border-line pb-8 pt-8 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} 念誠 · Ning-Cheng Chen</span>
          <span>Let lives influence lives.</span>
        </div>
      </div>
    </Scene>
  )
}
