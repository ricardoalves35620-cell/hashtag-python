import { useEffect, useRef, useCallback } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { indentWithTab, insertTab, indentLess } from '@codemirror/commands'
import { useApp } from '../contexts/AppContext'

interface Props {
  value: string
  onChange: (value: string) => void
  filename?: string
  height?: string
  readOnly?: boolean
  label?: string
}

const TOOLBAR_GROUPS = [
  {
    items: [
      { label: '⇥ Tab', action: 'tab' },
      { label: '⌫ Untab', action: 'untab' },
    ],
  },
  {
    items: [
      { label: ':', action: ':' },
      { label: '=', action: '=' },
      { label: '==', action: '==' },
      { label: '!=', action: '!=' },
      { label: '+=', action: '+=' },
      { label: '-=', action: '-=' },
    ],
  },
  {
    items: [
      { label: '()', action: '()' },
      { label: '[]', action: '[]' },
      { label: '{}', action: '{}' },
      { label: '""', action: '""' },
      { label: "''", action: "''" },
    ],
  },
  {
    items: [
      { label: '#', action: '# ' },
      { label: '_', action: '_' },
      { label: 'f"', action: 'f"' },
      { label: '→', action: ' -> ' },
      { label: '**', action: '**' },
      { label: '//', action: '//' },
    ],
  },
]

export default function VSCodeEditor({
  value,
  onChange,
  filename = 'exercise.py',
  height = '240px',
  readOnly = false,
  label,
}: Props) {
  const {
    lang,
    editorHeightMode,
    editorWrapMode,
    editorFontSize,
    setEditorFontSize,
  } = useApp()
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const autoHeight = !readOnly && editorHeightMode === 'auto'
  const effectiveHeight = autoHeight ? 'auto' : height

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const extensions = [
      basicSetup,
      python(),
      oneDark,
      keymap.of([indentWithTab]),
      EditorView.updateListener.of(update => {
        if (!update.docChanged) return
        const nextValue = update.state.doc.toString()
        container.dataset.editorValue = nextValue
        onChangeRef.current(nextValue)
      }),
      EditorView.editable.of(!readOnly),
      EditorView.theme({
        '&': {
          width: '100%',
          maxWidth: '100%',
          minWidth: '0',
          height: effectiveHeight,
          backgroundColor: '#1e1e1e',
          color: '#d4d4d4',
          fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
          fontSize: `${editorFontSize}px`,
        },
        '.cm-editor': { width: '100%', maxWidth: '100%', minWidth: '0' },
        '.cm-content': {
          caretColor: '#d4d4d4',
          padding: '8px 0',
          minHeight: autoHeight ? '9rem' : '100%',
          whiteSpace: editorWrapMode === 'wrap' ? 'pre-wrap' : 'pre',
          overflowWrap: editorWrapMode === 'wrap' ? 'anywhere' : 'normal',
        },
        '.cm-focused': { outline: 'none' },
        '.cm-gutters': {
          backgroundColor: '#1e1e1e',
          borderRight: '1px solid #3e3e3e',
          color: '#858585',
          minWidth: '40px',
          flexShrink: '0',
        },
        '.cm-lineNumbers .cm-gutterElement': { padding: '0 10px 0 8px', minWidth: '32px' },
        '.cm-activeLine': { backgroundColor: '#ffffff08' },
        '.cm-activeLineGutter': { backgroundColor: '#ffffff08' },
        '.cm-selectionBackground, ::selection': { backgroundColor: '#264f78 !important' },
        '.cm-cursor': { borderLeftColor: '#d4d4d4', borderLeftWidth: '2px' },
        '.cm-scroller': {
          fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace !important",
          fontSize: `${editorFontSize}px !important`,
          lineHeight: '1.6',
          overflowY: autoHeight ? 'visible' : 'auto',
          overflowX: editorWrapMode === 'wrap' ? 'hidden' : 'auto',
          maxWidth: '100%',
        },
      }, { dark: true }),
    ]

    if (editorWrapMode === 'wrap') extensions.push(EditorView.lineWrapping)

    const state = EditorState.create({ doc: value, extensions })
    const view = new EditorView({ state, parent: container })
    viewRef.current = view

    const handleProgrammaticCode = (event: Event) => {
      if (!(event instanceof CustomEvent) || typeof event.detail !== 'string') return
      const current = view.state.doc.toString()
      view.dispatch({
        changes: { from: 0, to: current.length, insert: event.detail },
        selection: { anchor: event.detail.length },
      })
    }

    container.dataset.editorReady = 'true'
    container.dataset.editorValue = value
    container.addEventListener('hp:set-code', handleProgrammaticCode)

    return () => {
      container.removeEventListener('hp:set-code', handleProgrammaticCode)
      delete container.dataset.editorReady
      delete container.dataset.editorValue
      view.destroy()
      viewRef.current = null
    }
  }, [autoHeight, editorFontSize, editorWrapMode, effectiveHeight, readOnly])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (current !== value) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } })
    }
  }, [value])

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
        selection: { anchor: from + open.length, head: from + open.length + selected.length },
      })
      return
    }

    view.dispatch(view.state.replaceSelection(action))
  }, [])

  const decreaseFont = () => {
    const sizes = [14, 16, 18, 20, 22] as const
    const index = sizes.indexOf(editorFontSize)
    if (index > 0) setEditorFontSize(sizes[index - 1])
  }

  const increaseFont = () => {
    const sizes = [14, 16, 18, 20, 22] as const
    const index = sizes.indexOf(editorFontSize)
    if (index < sizes.length - 1) setEditorFontSize(sizes[index + 1])
  }

  return (
    <section className="hp-code-editor" aria-label={label || filename}>
      <header className="hp-code-editor__titlebar">
        <div className="hp-code-editor__window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="hp-code-editor__file">
          <span aria-hidden="true">🐍</span>
          <span>{filename}</span>
          {!readOnly && <span className="hp-code-editor__dirty" aria-hidden="true" />}
        </div>

        <div className="hp-code-editor__actions">
          {label && <span className="hp-code-editor__label">{label}</span>}
          {!readOnly && (
            <div className="hp-code-editor__zoom" aria-label={lang === 'pt' ? 'Zoom do editor' : 'Editor zoom'}>
              <button
                type="button"
                onClick={decreaseFont}
                disabled={editorFontSize === 14}
                aria-label={lang === 'pt' ? 'Diminuir texto do editor' : 'Decrease editor text'}
              >
                −
              </button>
              <span>{editorFontSize}px</span>
              <button
                type="button"
                onClick={increaseFont}
                disabled={editorFontSize === 22}
                aria-label={lang === 'pt' ? 'Aumentar texto do editor' : 'Increase editor text'}
              >
                +
              </button>
            </div>
          )}
        </div>
      </header>

      {!readOnly && (
        <div className="hp-code-editor__toolbar" aria-label={lang === 'pt' ? 'Atalhos do editor' : 'Editor shortcuts'}>
          {TOOLBAR_GROUPS.map((group, groupIndex) => (
            <div key={groupIndex} className="hp-code-editor__toolbar-group">
              {group.items.map(item => (
                <button
                  type="button"
                  key={item.action}
                  onPointerDown={event => {
                    event.preventDefault()
                    handleToolbarAction(item.action)
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div
        ref={containerRef}
        data-testid="python-editor-surface"
        data-editor-value={value}
        className={`hp-code-editor__surface ${autoHeight ? 'hp-code-editor__surface--auto' : 'hp-code-editor__surface--compact'} ${editorWrapMode === 'wrap' ? 'hp-code-editor__surface--wrap' : 'hp-code-editor__surface--scroll'}`}
        style={autoHeight ? undefined : { height }}
      />
    </section>
  )
}
