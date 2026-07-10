import React from 'react'

// ── VS Code Dark+ color palette ──
const C = {
  bg:        '#1e1e1e',
  gutter:    '#858585',
  border:    '#3e3e3e',
  titleBar:  '#252526',
  tabActive: '#1e1e1e',
  text:      '#d4d4d4',
  keyword:   '#569cd6',   // def, if, for, return, import...
  builtin:   '#dcdcaa',   // print, input, len, range...
  string:    '#ce9178',   // "text" 'text'
  comment:   '#6a9955',   // # comment
  number:    '#b5cea8',   // 42, 3.14
  cls:       '#4ec9b0',   // class names
  param:     '#9cdcfe',   // self, cls, parameters
  decorator: '#c586c0',   // @decorator
  operator:  '#d4d4d4',   // = + - * /
  fprefix:   '#569cd6',   // f in f-strings
}

const KEYWORDS = new Set([
  'def','class','if','elif','else','for','while','return','import','from',
  'in','not','and','or','is','True','False','None','try','except','finally',
  'with','as','raise','break','continue','pass','lambda','yield','global',
  'nonlocal','del','assert','async','await'
])

const BUILTINS = new Set([
  'print','input','len','range','int','float','str','bool','list','dict',
  'tuple','set','type','max','min','sum','sorted','enumerate','zip','open',
  'super','abs','round','map','filter','any','all','isinstance','hasattr',
  'getattr','setattr','vars','dir','repr','hash','id','iter','next',
  'reversed','format','chr','ord','hex','bin','oct','pow','divmod',
])

type Token = { t: 'kw'|'bi'|'str'|'cm'|'nm'|'cl'|'pm'|'dc'|'tx'|'op'|'fp'; v: string }

function tokenize(line: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const L = line.length

  while (i < L) {
    const ch = line[i]

    // Comment
    if (ch === '#') {
      tokens.push({ t: 'cm', v: line.slice(i) })
      break
    }

    // Decorator
    if (ch === '@') {
      let j = i + 1
      while (j < L && /[\w.]/.test(line[j])) j++
      tokens.push({ t: 'dc', v: line.slice(i, j) })
      i = j
      continue
    }

    // F-string prefix
    if ((ch === 'f' || ch === 'F') && i + 1 < L && (line[i+1] === '"' || line[i+1] === "'")) {
      tokens.push({ t: 'fp', v: ch })
      i++
      continue
    }

    // String (single or double quote, handle triple quotes)
    if (ch === '"' || ch === "'") {
      let j = i
      const q = ch
      const triple = line.slice(i, i+3) === q+q+q
      if (triple) {
        j = i + 3
        while (j < L) {
          if (line[j] === q && line[j+1] === q && line[j+2] === q) { j += 3; break }
          j++
        }
      } else {
        j = i + 1
        while (j < L && line[j] !== q) {
          if (line[j] === '\\') j++
          j++
        }
        j = Math.min(j + 1, L)
      }
      tokens.push({ t: 'str', v: line.slice(i, j) })
      i = j
      continue
    }

    // Number
    if (/\d/.test(ch) || (ch === '.' && i+1 < L && /\d/.test(line[i+1]))) {
      let j = i
      while (j < L && /[\d.xXoObBeE_]/.test(line[j])) j++
      tokens.push({ t: 'nm', v: line.slice(i, j) })
      i = j
      continue
    }

    // Identifier / keyword / builtin
    if (/[a-zA-Z_]/.test(ch)) {
      let j = i
      while (j < L && /\w/.test(line[j])) j++
      const word = line.slice(i, j)
      // Check if next non-space char is '(' → function call or def name
      let k = j
      while (k < L && line[k] === ' ') k++
      const isCall = line[k] === '('
      // Check if preceded by 'class ' → class name
      const isClassName = tokens.length > 0 &&
        tokens[tokens.length-1].t === 'kw' &&
        tokens[tokens.length-1].v === 'class'
      // 'self' and 'cls' first parameter
      const isSelf = word === 'self' || word === 'cls'

      let type: Token['t'] = 'tx'
      if (KEYWORDS.has(word)) type = 'kw'
      else if (isClassName) type = 'cl'
      else if (isSelf) type = 'pm'
      else if (BUILTINS.has(word) && isCall) type = 'bi'
      else if (isCall) type = 'bi' // any function call gets builtin color (dcdcaa)

      tokens.push({ t: type, v: word })
      i = j
      continue
    }

    // Operator or punctuation
    tokens.push({ t: 'op', v: ch })
    i++
  }

  return tokens
}

function tokenColor(t: Token['t']): string {
  switch (t) {
    case 'kw': return C.keyword
    case 'bi': return C.builtin
    case 'str': return C.string
    case 'cm': return C.comment
    case 'nm': return C.number
    case 'cl': return C.cls
    case 'pm': return C.param
    case 'dc': return C.decorator
    case 'fp': return C.fprefix
    default:   return C.text
  }
}

interface Props {
  code: string
  filename?: string
}

export default function VSCodeBlock({ code, filename = 'example.py' }: Props) {
  if (!code || !code.trim()) return null
  const lines = code.split('\n')
  // Remove leading/trailing empty lines
  while (lines.length > 0 && lines[0].trim() === '') lines.shift()
  while (lines.length > 0 && lines[lines.length-1].trim() === '') lines.pop()

  const padWidth = String(lines.length).length

  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', margin: '10px 0', fontSize: 13 }}>
      {/* ── Title bar ── */}
      <div style={{
        background: C.titleBar,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 12px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        {/* Traffic light dots */}
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
        </div>
        {/* Tab */}
        <div style={{
          background: C.tabActive, borderRadius: '4px 4px 0 0',
          padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 5,
          border: `1px solid ${C.border}`, borderBottom: `1px solid ${C.bg}`,
          marginBottom: -8,
        }}>
          <span style={{ fontSize: 13 }}>🐍</span>
          <span style={{ fontSize: 12, color: C.text, fontFamily: 'monospace' }}>{filename}</span>
        </div>
      </div>

      {/* ── Code area ── */}
      <div style={{ background: C.bg, overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 'max-content' }}>
          <tbody>
            {lines.map((line, idx) => {
              const tokens = tokenize(line)
              return (
                <tr key={idx} style={{ lineHeight: 1.6 }}>
                  {/* Line number */}
                  <td style={{
                    color: C.gutter, fontSize: 12, textAlign: 'right',
                    padding: '0 12px 0 16px', userSelect: 'none',
                    borderRight: `1px solid ${C.border}`,
                    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                    verticalAlign: 'top', whiteSpace: 'nowrap',
                    minWidth: `${padWidth + 2}ch`,
                  }}>
                    {idx + 1}
                  </td>
                  {/* Code */}
                  <td style={{
                    padding: '0 16px',
                    fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
                    whiteSpace: 'pre',
                    verticalAlign: 'top',
                  }}>
                    {line === '' ? (
                      <span style={{ color: C.text }}>{'\u00A0'}</span>
                    ) : (
                      tokens.map((tok, ti) => (
                        <span key={ti} style={{ color: tokenColor(tok.t) }}>{tok.v}</span>
                      ))
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* Bottom padding */}
        <div style={{ height: 10 }} />
      </div>
    </div>
  )
}
