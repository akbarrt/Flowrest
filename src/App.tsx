import { useEffect, useState } from 'react'
import { Layout } from './ui/components/Layout'
import type { Page } from './ui/components/Layout'
import { GardenPage } from './ui/pages/GardenPage'
import { HomePage } from './ui/pages/HomePage'

const GARDEN_HASH = '#kebun'

function readPage(): Page {
  if (typeof window === 'undefined') {
    return 'timer'
  }

  return window.location.hash === GARDEN_HASH ? 'garden' : 'timer'
}

export function App() {
  const [page, setPage] = useState<Page>(readPage)

  useEffect(() => {
    function handleHashChange() {
      setPage(readPage())
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <Layout currentPage={page}>
      <div className={page === 'garden' ? 'hidden' : undefined}>
        <HomePage isActive={page === 'timer'} />
      </div>
      {page === 'garden' ? <GardenPage /> : null}
    </Layout>
  )
}
