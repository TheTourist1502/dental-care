'use client'
import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import styles from './index.module.css'

type Theme = 'light' | 'dark'

export default function ThemeToggle({ variant = 'icon' }: { variant?: 'icon' | 'full' }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const current = document.documentElement.dataset.theme as Theme | undefined
    setTheme(current === 'dark' ? 'dark' : 'light')
    setMounted(true)
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    document.documentElement.style.colorScheme = next
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }

  const label = mounted
    ? theme === 'dark'
      ? 'Switch to light theme'
      : 'Switch to dark theme'
    : 'Toggle theme'

  if (variant === 'full') {
    return (
      <button type="button" className={styles.fullToggle} onClick={toggle} aria-label={label}>
        <Icon icon={theme === 'dark' ? 'solar:sun-2-bold-duotone' : 'solar:moon-bold-duotone'} width={20} height={20} />
        <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>
    )
  }

  return (
    <button type="button" className={styles.toggle} onClick={toggle} aria-label={label}>
      <Icon icon={theme === 'dark' ? 'solar:sun-2-bold-duotone' : 'solar:moon-bold-duotone'} width={20} height={20} />
    </button>
  )
}
