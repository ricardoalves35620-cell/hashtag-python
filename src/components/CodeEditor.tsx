import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { Annotation, EditorState } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'

interface Props {
  value: string
  onChange: (value: string) => void
  height?: string
  readOnly?: boolean
}

/**
 * Marks a document change this component made itself, so the update listener can tell
 * it apart from something the learner typed.
 *
 * CodeMirror reports docChanged for programmatic dispatches exactly as it does for
 * keystrokes. Without this, every time the `value` prop changed — switching exercise
 * tabs, restoring a saved draft — the editor announced the new text as a learner edit.
 * The page persisted it, which meant opening an exercise you had already worked on
 * saved the starter code over your solution before you could read it.
 */
const ExternalChange = Annotation.define<boolean>()

export default function CodeEditor({ value, onChange, height = '300px', readOnly = false }: Props) {
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
        keymap.of([indentWithTab]),
        EditorView.updateListener.of(update => {
          if (!update.docChanged) return
          if (update.transactions.some(transaction => transaction.annotation(ExternalChange))) return
          onChangeRef.current(update.state.doc.toString())
        }),
        EditorView.editable.of(!readOnly),
        EditorView.theme({
          '&': { height },
          '.cm-scroller': { overflow: 'auto' }
        })
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
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
        annotations: ExternalChange.of(true),
      })
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      className="rounded-lg overflow-hidden border border-[#2d1b69]"
      style={{ height }}
    />
  )
}
