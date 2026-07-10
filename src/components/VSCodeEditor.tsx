import { useEffect, useRef, useCallback } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { indentWithTab, insertTab, indentLess } from '@codemirror/commands'

interface Props {
  value: string
  onChange: (value: string) => void
  filename?: string
  height?: string
  readOnly?: boolean
  label?: string
}

const vscodeDarkTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    height: '100%',
    fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
    fontSize: '13px',
  },
  '.cm-content': { caretColor: '#d4d4d4', padding: '8px 0' },
  '.cm-focused': { outline: 'none' },
  '.cm-gutters': {
    backgroundColor: '#1e1e1e', borderRight: '1px solid #3e3e3e',
    color: '#858585', minWidth: '40px',
  },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 10px 0 8px', minWidth: '32px' },
  '.cm-activeLine': { backgroundColor: '#ffffff08' },
  '.cm-activeLineGutter': { backgroundColor: '#ffffff08' },
  '.cm-selectionBackground, ::selection': { backgroundColor: '#264f78 !important' },
  '.cm-cursor': { borderLeftColor: '#d4d4d4', borderLeftWidth: '2px' },
  '.cm-scroller': {
    fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace !important",
    lineHeight: '1.6',
  },
}, { dark: true })

// Python mobile toolbar — grouped by category
const TOOLBAR_GROUPS = [
  {
    label: 'Indent',
    items: [
      { label: '⇥ Tab', action: 'tab' },
      { label: '⌫ Untab', action: 'untab' },
    ]
  },
  {
    label: 'Common',
    items: [
      { label: ':', action: ':' },
      { label: '=', action: '=' },
      { label: '==', action: '==' },
      { label: '!=', action: '!=' },
      { label: '+=', action: '+=' },
      { label: '-=', action: '-=' },
    ]
  },
  {
    label: 'Brackets',
    items: [
      { label: '()', action: '()' },
      { label: '[]', action: '[]' },
      { label: '{}', action: '{}' },
      { label: '""', action: '""' },
      { label: "''", action: "''" },
    ]
  },
  {
    label: 'Python',
    items: [
      { label: '#', action: '# ' },
      { label: '_', action: '_' },
      { label: 'f"', action: 'f"' },
      { label: '->', action: ' -> ' },
      { label: '**', action: '**' },
      { label: '//', action: '//' },
    ]
  },
]

export default function VSCodeEditor({
  value, onChange, filename = 'exercise.py', height = '240px', readOnly = false, label
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (!containerRef.current) return

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        python(),
        oneDark,
        vscodeDarkTheme,
        keymap.of([indentWithTab]),
        EditorView.updateListener.of(update => {
          if (update.docChanged) onChangeRef.current(update.state.doc.toString())
        }),
        EditorView.editable.of(!readOnly),
        EditorView.theme({ '&': { height }, '.cm-scroller': { overflow: 'auto' } }),
      ]
    })

    const view = new EditorView({ state, parent: containerRef.current })
    viewRef.current = view
    return () => view.destroy()
  }, [])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (current !== value) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } })
    }
  }, [value])

  // ── Toolbar action handler ──
  const handleToolbarAction = useCallback((action: string) => {
    const view = viewRef.current
    if (!view) return

    view.focus()

    if (action === 'tab') {
      insertTab(view)
      return
    }

    if (action === 'untab') {
      indentLess(view)
      return
    }

    // Paired brackets — insert both and place cursor between them
    const pairs: Record<string, [string, string]> = {
      '()': ['(', ')'],
      '[]': ['[', ']'],
      '{}': ['{', '}'],
      '""': ['"', '"'],
      "''": ["'", "'"],
    }

    if (pairs[action]) {
      const [open, close] = pairs[action]
      const { from, to } = view.state.selection.main
      const selected = view.state.sliceDoc(from, to)

      view.dispatch({
        changes: { from, to, insert: open + selected + close },
        selection: { anchor: from + open.length, head: from + open.length + selected.length }
      })
      return
    }

    // Default: insert text at cursor
    view.dispatch(view.state.replaceSelection(action))
  }, [])

  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #3e3e3e' }}>

      {/* ── VS Code title bar ── */}
      <div style={{
        background: '#252526', display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 12px', borderBottom: '1px solid #3e3e3e',
      }}>
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(color => (
            <div key={color} style={{ width: 11, height: 11, borderRadius: '50%', background: color }} />
          ))}
        </div>
        <div style={{
          background: '#1e1e1e', borderRadius: '4px 4px 0 0',
          padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 5,
          border: '1px solid #3e3e3e', borderBottom: '1px solid #1e1e1e', marginBottom: -8,
        }}>
          <span style={{ fontSize: 13 }}>🐍</span>
          <span style={{ fontSize: 12, color: '#d4d4d4', fontFamily: 'monospace' }}>{filename}</span>
          {!readOnly && (
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#d4d4d4', opacity: 0.4, marginLeft: 4 }} />
          )}
        </div>
        {label && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#858585' }}>{label}</span>}
      </div>

      {/* ── Mobile toolbar ── */}
      {!readOnly && (
        <div style={{
          background: '#2d2d2d',
          borderBottom: '1px solid #3e3e3e',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch' as any,
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          padding: '4px 8px',
          scrollbarWidth: 'none',
        }}>
          {TOOLBAR_GROUPS.map((group, gi) => (
            <div key={gi} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {/* Group separator */}
              {gi > 0 && (
                <div style={{ width: 1, height: 20, background: '#3e3e3e', margin: '0 6px', flexShrink: 0 }} />
              )}
              {group.items.map(item => (
                <button
                  key={item.action}
                  onPointerDown={e => {
                    e.preventDefault() // prevent blur on editor
                    handleToolbarAction(item.action)
                  }}
                  style={{
                    background: item.action === 'tab' || item.action === 'untab'
                      ? '#3e3e3e' : 'transparent',
                    border: 'none',
                    borderRadius: 5,
                    color: item.action === 'tab' || item.action === 'untab'
                      ? '#dcdcaa' : '#9cdcfe',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    padding: '5px 8px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    minHeight: 30,
                    flexShrink: 0,
                    fontWeight: item.action === 'tab' || item.action === 'untab' ? 500 : 400,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── CodeMirror editor ── */}
      <div ref={containerRef} style={{ height }} />
    </div>
  )
}
