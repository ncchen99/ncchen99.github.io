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
      {/* Hero + Work share the pinned blur-crossfade stage. Contact lives
          outside it so its comment thread can grow and scroll normally. */}
      <div id="stageViewport">
        <Hero />
        <Work />
      </div>
      <Contact />
    </div>
  )
}
