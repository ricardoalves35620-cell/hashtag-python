import { useState, useEffect } from 'react'
import type { Lang } from '../data/types'

interface InputRow {
  prompt: string   // label shown to user (extracted from input("..."))
  value: string    // value the user types
}


// ── Detect if input() is inside a loop ──
function isInputInLoop(code: string): boolean {
  const lines = code.split('\n')
  let inLoop = false
  let loopIndent = -1
  for (const line of lines) {
    const trimmed = line.trimStart()
    const indent = line.length - trimmed.length
    if (/^(while|for)\b/.test(trimmed)) {
      inLoop = true
      loopIndent = indent
    } else if (inLoop && indent <= loopIndent && trimmed !== '') {
      inLoop = false
      loopIndent = -1
    }
    if (inLoop && /\binput\s*\(/.test(trimmed)) return true
  }
  return false
}

// ── Parse all input() calls from Python code ──
function parseInputCalls(code: string): string[] {
  const prompts: string[] = []

  // Match: input("some prompt") or input('some prompt') or input()
  // Works inside int(input(...)), float(input(...)), etc.
  const regex = /\binput\s*\(\s*(?:f?['"]([\s\S]*?)['"]\s*)?\)/g
  let match

  while ((match = regex.exec(code)) !== null) {
    // match[1] is the prompt string, or undefined if input() has no args
    const raw = match[1] ?? ''
    // Clean up the prompt: trim, remove trailing colon+space, collapse whitespace
    const prompt = raw.replace(/\\n/g, '').trim()
    prompts.push(prompt)
  }

  return prompts
}

interface Props {
  code: string
  value: string          // newline-separated values (same format as before)
  onChange: (value: string) => void
  lang: Lang
}

export default function TestInputEditor({ code, value, onChange, lang }: Props) {
  const [rows, setRows] = useState<InputRow[]>([])

  const [hasLoop, setHasLoop] = useState(false)

  // Re-parse whenever code changes
  useEffect(() => {
    const prompts = parseInputCalls(code)
    const loop = isInputInLoop(code)
    setHasLoop(loop)

    if (prompts.length === 0 && !loop) {
      setRows([])
      return
    }

    const currentValues = value.split('\n')

    // For loops: show at least as many rows as current values, minimum 2
    let allPrompts = [...prompts]
    if (loop) {
      const needed = Math.max(currentValues.filter(v => v !== '').length + 1, 2)
      while (allPrompts.length < needed) {
        allPrompts.push(prompts[0] ?? '') // repeat the loop's prompt label
      }
    }

    const newRows: InputRow[] = allPrompts.map((prompt, i) => ({
      prompt,
      value: currentValues[i] ?? '',
    }))

    setRows(newRows)
    onChange(newRows.map(r => r.value).join('\n'))
  }, [code])

  const updateRow = (index: number, newValue: string) => {
    let updated = rows.map((r, i) => i === index ? { ...r, value: newValue } : r)
    // For loops: add a new empty row when user types in the last row
    if (hasLoop && index === updated.length - 1 && newValue !== '') {
      updated = [...updated, { prompt: rows[0]?.prompt ?? '', value: '' }]
    }
    setRows(updated)
    onChange(updated.map(r => r.value).join('\n').replace(/\n+$/, '')) // trim trailing newlines
  }

  const t = {
    en: {
      label: 'Test inputs',
      hint: 'Each field matches an input() call in your code.',
      noInputs: 'This code has no input() calls — no test inputs needed.',
      field: 'Input',
    },
    pt: {
      label: 'Entradas de teste',
      hint: 'Cada campo corresponde a uma chamada input() no seu código.',
      noInputs: 'Este código não tem chamadas input() — sem entradas necessárias.',
      field: 'Entrada',
    }
  }[lang]

  // ── No input() calls in code ──
  if (rows.length === 0 && parseInputCalls(code).length === 0) {
    return (
      <div style={{ marginBottom: 8 }}>
        <div style={{
          fontSize: 11, color: 'var(--c-muted)',
          textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6
        }}>
          {t.label}
        </div>
        <div style={{
          background: '#1e1e1e', border: '1px solid #3e3e3e',
          borderRadius: 8, padding: '10px 14px',
          fontSize: 12, color: '#858585', fontStyle: 'italic',
        }}>
          {t.noInputs}
        </div>
      </div>
    )
  }

  // ── Structured input rows ──
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 11, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {t.label}
        </div>
        <div style={{ fontSize: 11, color: 'var(--c-dimmer)' }}>
          {hasLoop
            ? (lang === 'en'
                ? '⟳ Loop detected — add one value per iteration. New rows appear as you type.'
                : '⟳ Loop detectado — adicione um valor por iteração. Novas linhas aparecem ao digitar.')
            : t.hint}
        </div>
      </div>

      <div style={{
        background: '#1e1e1e', border: '1px solid #3e3e3e',
        borderRadius: 8, overflow: 'hidden',
      }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center',
              borderBottom: i < rows.length - 1 ? '1px solid #2a2a2a' : 'none',
            }}
          >
            {/* Line number + prompt label */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '0 12px',
              minWidth: 0, flexShrink: 0,
              width: '55%', maxWidth: 220,
              borderRight: '1px solid #2a2a2a',
              background: '#1a1a1a',
              alignSelf: 'stretch',
            }}>
              <span style={{
                fontSize: 11, color: '#858585', flexShrink: 0,
                fontFamily: "'JetBrains Mono', monospace",
                minWidth: 16, textAlign: 'right',
              }}>
                {i + 1}
              </span>
              <span style={{
                fontSize: 12, color: '#9cdcfe',
                fontFamily: "'JetBrains Mono', monospace",
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                padding: '10px 0',
              }}>
                {row.prompt
                  ? `${row.prompt}${row.prompt.endsWith(':') ? '' : ':'}`
                  : `${t.field} ${i + 1}:`}
              </span>
            </div>

            {/* Value input */}
            <input
              type="text"
              value={row.value}
              onChange={e => updateRow(i, e.target.value)}
              placeholder="..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                padding: '10px 14px',
                fontSize: 16, // 16px prevents iOS zoom
                fontFamily: "'JetBrains Mono', monospace",
                color: '#d4d4d4',
                minWidth: 0,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
