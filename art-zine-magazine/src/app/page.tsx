'use client'

import dynamic from 'next/dynamic'
import ErrorBoundary from '../components/ErrorBoundary'

const MagazineCargoHybrid = dynamic(() => import('../components/magazine-cargo-hybrid'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <p className="text-2xl font-bold">Loading ARTISANATTITUDE...</p>
    </div>
  ),
})

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-background text-foreground">
        <MagazineCargoHybrid />
      </div>
    </ErrorBoundary>
  )
}
