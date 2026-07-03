'use client'
// Dropdown modeled on the PrimeReact Dropdown (Lara theme): same anatomy
// (control + chevron, floating panel, hover/selected item states) and the
// same keyboard behavior, built in-house so we don't ship the PrimeReact
// bundle into a static site.
import { useState, useRef, useEffect, useId } from 'react'
import { Icon } from '@iconify/react'
import styles from './index.module.css'

type DropdownProps = {
  options: readonly string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  invalid?: boolean
  id?: string
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select',
  invalid = false,
  id,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [focusIdx, setFocusIdx] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  useEffect(() => {
    if (open && focusIdx >= 0) {
      listRef.current?.children[focusIdx]?.scrollIntoView({ block: 'nearest' })
    }
  }, [open, focusIdx])

  function toggle() {
    setOpen((v) => {
      if (!v) setFocusIdx(Math.max(0, options.indexOf(value)))
      return !v
    })
  }

  function select(option: string) {
    onChange(option)
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (open && focusIdx >= 0) select(options[focusIdx])
        else toggle()
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!open) toggle()
        else setFocusIdx((i) => Math.min(options.length - 1, i + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (open) setFocusIdx((i) => Math.max(0, i - 1))
        break
      case 'Escape':
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        id={id}
        className={`${styles.control} ${open ? styles.controlOpen : ''} ${invalid ? styles.controlInvalid : ''}`}
        onClick={toggle}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
      >
        <span className={value ? styles.value : styles.placeholder}>
          {value || placeholder}
        </span>
        <Icon
          icon="solar:alt-arrow-down-linear"
          className={`${styles.chevron} ${open ? styles.chevronUp : ''}`}
          width={16}
          height={16}
        />
      </button>

      {open && (
        <div className={styles.panel}>
          <ul className={styles.list} role="listbox" id={listId} ref={listRef}>
            {options.map((option, i) => {
              const selected = option === value
              return (
                <li
                  key={option}
                  role="option"
                  aria-selected={selected}
                  className={`${styles.item} ${selected ? styles.itemSelected : ''} ${i === focusIdx ? styles.itemFocused : ''}`}
                  onMouseEnter={() => setFocusIdx(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(option)}
                >
                  {option}
                  {selected && (
                    <Icon icon="solar:check-read-linear" width={16} height={16} />
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
