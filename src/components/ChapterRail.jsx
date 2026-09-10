import { useEffect, useState } from 'react'

const CHAPTERS = [
  { href: '#about', label: 'Land', index: '01' },
  { href: '#stay', label: 'Stay', index: '02' },
  { href: '#gallery', label: 'Light', index: '03' },
  { href: '#reviews', label: 'Notes', index: '04' },
  { href: '#location', label: 'Map', index: '05' },
]

export default function ChapterRail() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const ids = CHAPTERS.map((c) => c.href.slice(1))
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!elements.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) {
          setActive(`#${visible[0].target.id}`)
        }
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.1, 0.35, 0.6] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="chapter-rail" aria-label="Section chapters">
      {CHAPTERS.map((chapter) => (
        <a
          key={chapter.href}
          href={chapter.href}
          className={active === chapter.href ? 'is-active' : undefined}
        >
          <span className="chapter-rail-index">{chapter.index}</span>
          <span className="chapter-rail-label">{chapter.label}</span>
        </a>
      ))}
    </nav>
  )
}
