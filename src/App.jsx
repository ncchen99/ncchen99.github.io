import { useCallback, useState } from 'react'
import { useScrollScene } from './hooks/useScrollScene'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import Contact from './components/Contact'
import { useLang } from './i18n'

const LABELS = {
  home: { zh: '念誠', en: 'Nian-Cheng' },
  work: { zh: '作品', en: 'Work' },
  contact: { zh: '聯絡資訊', en: 'Contact' },
}
// phones: the nav row can't fit the full romanised name next to the links
const SHORT_LABELS = { home: { zh: '念誠', en: 'NC Chen' } }

export default function App() {
  const { t } = useLang()
  const [kind, setKind] = useState('home')
  const onActive = useCallback((k) => setKind((prev) => (prev === k ? prev : k)), [])
  useScrollScene({ onActive })

  return (
    <div className="relative min-h-screen bg-paper text-ink antialiased">
      <Nav label={t(LABELS[kind])} shortLabel={t(SHORT_LABELS[kind] ?? LABELS[kind])} />
      {/* Desktop: one fixed deck of full-screen acts — each scroll gesture
          flips exactly one card (see useScrollScene). Mobile: normal flow. */}
      <div id="stageViewport">
        <Hero />
        <div id="work">
          <Work />
        </div>
        <Contact />
      </div>
    </div>
  )
}
