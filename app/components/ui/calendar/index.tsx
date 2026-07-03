'use client'
// Date picker modeled on the PrimeReact Calendar (Lara theme): input with
// trigger icon, floating month panel with prev/next navigation, muted
// other-month days, outlined "today" and filled selected date.
import { useState, useRef, useEffect } from 'react'
import { Icon } from '@iconify/react'
import styles from './index.module.css'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatDisplayDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

type CalendarProps = {
  value: string // ISO yyyy-mm-dd or ''
  onChange: (iso: string) => void
  placeholder?: string
  invalid?: boolean
  minDate?: Date
  maxDate?: Date
  id?: string
}

type Cell = { date: Date; outsideMonth: boolean }

function buildGrid(year: number, month: number): Cell[] {
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    return { date, outsideMonth: date.getMonth() !== month }
  })
}

export default function Calendar({
  value,
  onChange,
  placeholder = 'Select date',
  invalid = false,
  minDate,
  maxDate,
  id,
}: CalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const selected = value ? new Date(value + 'T00:00:00') : null
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState((selected ?? today).getFullYear())
  const [viewMonth, setViewMonth] = useState((selected ?? today).getMonth())
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function openPanel() {
    const base = selected ?? today
    setViewYear(base.getFullYear())
    setViewMonth(base.getMonth())
    setOpen((v) => !v)
  }

  function nav(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  function isDisabled(d: Date) {
    if (minDate && d < minDate) return true
    if (maxDate && d > maxDate) return true
    return false
  }

  function pick(d: Date) {
    if (isDisabled(d)) return
    onChange(toISODate(d))
    setOpen(false)
  }

  const grid = buildGrid(viewYear, viewMonth)

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        id={id}
        className={`${styles.control} ${open ? styles.controlOpen : ''} ${invalid ? styles.controlInvalid : ''}`}
        onClick={openPanel}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={value ? `Selected date ${formatDisplayDate(value)}` : placeholder}
      >
        <span className={value ? styles.value : styles.placeholder}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <Icon
          icon="solar:calendar-linear"
          className={styles.calendarIcon}
          width={18}
          height={18}
        />
      </button>

      {open && (
        <div className={styles.panel} role="dialog" aria-label="Choose date">
          <div className={styles.header}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => nav(-1)}
              aria-label="Previous month"
            >
              <Icon icon="solar:alt-arrow-left-linear" width={18} height={18} />
            </button>
            <span className={styles.title}>
              {MONTHS[viewMonth]} <span className={styles.year}>{viewYear}</span>
            </span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => nav(1)}
              aria-label="Next month"
            >
              <Icon icon="solar:alt-arrow-right-linear" width={18} height={18} />
            </button>
          </div>

          <div className={styles.weekdays}>
            {WEEKDAYS.map((w) => (
              <span key={w} className={styles.weekday}>{w}</span>
            ))}
          </div>

          <div className={styles.days}>
            {grid.map(({ date, outsideMonth }) => {
              const iso = toISODate(date)
              const isSelected = value === iso
              const isToday = date.getTime() === today.getTime()
              const disabled = isDisabled(date)
              return (
                <button
                  type="button"
                  key={iso}
                  className={[
                    styles.day,
                    outsideMonth ? styles.dayOutside : '',
                    isToday ? styles.dayToday : '',
                    isSelected ? styles.daySelected : '',
                  ].join(' ')}
                  disabled={disabled}
                  onClick={() => pick(date)}
                  aria-label={iso}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
