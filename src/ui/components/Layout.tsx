import type { ReactNode } from 'react'

export type Page = 'timer' | 'garden'

type LayoutProps = {
  children: ReactNode
  currentPage: Page
}

const NAV_ITEMS: Array<{ page: Page; href: string; label: string }> = [
  { page: 'timer', href: '#timer', label: 'Timer' },
  { page: 'garden', href: '#kebun', label: 'Kebun' },
]

function navLinkClass(isActive: boolean): string {
  return [
    'inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors motion-reduce:transition-none',
    isActive ? 'bg-surface text-moss' : 'text-muted hover:text-ink',
  ].join(' ')
}

export function Layout({ children, currentPage }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6 sm:py-3">
          <a
            href="#timer"
            className="inline-flex min-h-11 items-center font-display text-xl font-semibold tracking-tight text-moss"
          >
            Flowrest
          </a>
          <nav aria-label="Navigasi utama" className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.page === currentPage

              return (
                <a
                  key={item.page}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={navLinkClass(isActive)}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-3 sm:px-6 sm:py-6">
        {children}
      </main>
    </div>
  )
}
