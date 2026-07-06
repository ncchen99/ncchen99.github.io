import { useCallback, useState } from 'react'
import { useScrollScene } from './hooks/useScrollScene'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import Contact from './components/Contact'

const LABELS = { home: '念誠', work: '作品', contact: '聯絡資訊' }

export default function App() {
  const [kind, setKind] = useState('home')
  const onActive = useCallback((k) => setKind((prev) => (prev === k ? prev : k)), [])
  useScrollScene({ onActive })

  return (
    <div className="relative min-h-screen bg-paper text-ink antialiased">
      <Nav label={LABELS[kind]} />
      {/* Desktop: one fixed deck of full-screen acts — each scroll gesture
          flips exactly one card (see useScrollScene). Mobile: normal flow. */}
      <div id="stageViewport">
        <Hero />
        <Work />
        <Contact />
      </div>
    </div>
  )
}
