import Scene from './Scene'

// Resonance brand mark — the wave, stripped to a single stroke colour so it
// sits as one set with the line-drawn Instagram / Facebook glyphs.
function ResonanceIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3.4,8.2 C5.4,5.9 7.3,5.8 9.2,8.0 C11.1,10.2 13.0,10.3 15.0,8.1 C16.9,6.0 18.8,5.9 20.7,8.1" />
      <path d="M3.0,12.1 C5.1,9.7 7.1,9.8 9.0,12.0 C10.9,14.2 12.9,14.3 14.9,12.1 C16.8,9.9 18.8,9.8 20.9,12.0" />
      <path d="M3.5,16.0 C5.4,13.8 7.4,13.7 9.3,15.9 C11.2,18.1 13.1,18.2 15.1,16.0 C17.0,13.9 18.9,13.8 20.8,16.0" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const socials = [
  {
    label: '共振 Resonance',
    href: 'https://resonance-world.vercel.app/zh-TW/u/%E5%BF%B5%E8%AA%A0',
    Icon: ResonanceIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ncchen.foss/',
    Icon: InstagramIcon,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/ncchen99',
    Icon: FacebookIcon,
  },
]

export default function Hero() {
  return (
    <Scene id="hero" tint="cream">
      <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
        {/* manifesto */}
        <h1 className="display order-2 text-[2.5rem] leading-[1.16] text-ink md:order-1 md:col-span-7 md:text-[3.4rem] md:leading-[1.18]">
          結合資訊科技與商業，
          <br className="hidden sm:block" />
          打造讓世界更溫暖的產品
        </h1>

        {/* portrait — in colour */}
        <div className="order-1 md:order-2 md:col-span-5 md:pl-6">
          <div className="hero-portrait mx-auto w-52 sm:w-60 md:ml-auto md:mr-0 md:w-full md:max-w-sm">
            <img
              src="/images/ncc.jpg"
              alt="念誠"
              className="w-full border border-line object-cover"
            />

            {/* social links — centred beneath the portrait */}
            <div className="mt-5 flex justify-center gap-7 text-muted">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="transition-colors duration-300 hover:text-ink focus-visible:text-ink focus-visible:outline-none"
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Scene>
  )
}
