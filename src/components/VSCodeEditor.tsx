import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'

interface Props {
  value: string
  onChange: (value: string) => void
  filename?: string
  height?: string
  readOnly?: boolean
  label?: string  // optional right-side label e.g. "editable" or "exam.py"
}

// Match the exact VS Code Dark+ colors
const vscodeDarkTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    height: '100%',
    fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
    fontSize: '13px',
  },
  '.cm-content': {
    caretColor: '#d4d4d4',
    padding: '8px 0',
  },
  '.cm-focused': { outline: 'none' },
  '.cm-gutters': {
    backgroundColor: '#1e1e1e',
    borderRight: '1px solid #3e3e3e',
    color: '#858585',
    minWidth: '40px',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 10px 0 8px',
    minWidth: '32px',
  },
  '.cm-activeLine': { backgroundColor: '#ffffff08' },
  '.cm-activeLineGutter': { backgroundColor: '#ffffff08' },
  '.cm-selectionBackground, ::selection': { backgroundColor: '#264f78 !important' },
  '.cm-cursor': { borderLeftColor: '#d4d4d4' },
  '.cm-foldPlaceholder': { backgroundColor: '#3e3e3e', borderColor: '#3e3e3e' },
  '.cm-scroller': {
    fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace !important",
    lineHeight: '1.6',
  },
}, { dark: true })

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

  // Update content externally
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (current !== value) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } })
    }
  }, [value])

  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #3e3e3e' }}>
      {/* ── VS Code title bar ── */}
      <div style={{
        background: '#252526',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 12px',
        borderBottom: '1px solid #3e3e3e',
      }}>
        {/* Traffic light dots */}
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(color => (
            <div key={color} style={{
              width: 11, height: 11, borderRadius: '50%', background: color,
            }} />
          ))}
        </div>

        {/* Tab */}
        <div style={{
          background: '#1e1e1e',
          borderRadius: '4px 4px 0 0',
          padding: '3px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          border: '1px solid #3e3e3e',
          borderBottom: '1px solid #1e1e1e',
          marginBottom: -8,
        }}>
          <span style={{ fontSize: 13 }}>🐍</span>
          <span style={{ fontSize: 12, color: '#d4d4d4', fontFamily: 'monospace' }}>{filename}</span>
          {!readOnly && (
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#d4d4d4', opacity: 0.5, marginLeft: 4
            }} />
          )}
        </div>

        {label && (
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#858585' }}>{label}</span>
        )}
      </div>

      {/* ── CodeMirror editor ── */}
      <div ref={containerRef} style={{ height }} />
    </div>
  )
}
