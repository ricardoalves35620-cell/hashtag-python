import { useApp } from '../contexts/AppContext'
import type { EditorFontSize, EditorHeightMode, EditorWrapMode } from '../contexts/AppContext'

export default function EditorPreferences() {
  const {
    lang,
    editorHeightMode,
    setEditorHeightMode,
    editorWrapMode,
    setEditorWrapMode,
    editorFontSize,
    setEditorFontSize,
  } = useApp()

  const copy = lang === 'pt'
    ? {
        title: 'Editor de código',
        description: 'Escolha como a caixa de código se comporta neste e nos outros dispositivos.',
        height: 'Altura',
        auto: 'Automática',
        autoHelp: 'O editor cresce para mostrar todo o código.',
        compact: 'Compacta',
        compactHelp: 'Mantém altura fixa com rolagem interna.',
        lines: 'Linhas longas',
        wrap: 'Quebrar linhas',
        wrapHelp: 'Todo o código cabe na largura da tela.',
        scroll: 'Rolagem horizontal',
        scrollHelp: 'Mantém cada linha sem quebra.',
        textSize: 'Tamanho do texto',
        sync: 'As preferências ficam salvas na conta e neste dispositivo.',
      }
    : {
        title: 'Code editor',
        description: 'Choose how the code box behaves on this and your other devices.',
        height: 'Height',
        auto: 'Automatic',
        autoHelp: 'The editor grows to show all code.',
        compact: 'Compact',
        compactHelp: 'Keeps a fixed height with internal scrolling.',
        lines: 'Long lines',
        wrap: 'Wrap lines',
        wrapHelp: 'All code stays within the screen width.',
        scroll: 'Horizontal scroll',
        scrollHelp: 'Keeps each line unwrapped.',
        textSize: 'Text size',
        sync: 'Preferences are saved to your account and this device.',
      }

  const heightOptions: Array<{ value: EditorHeightMode; label: string; help: string }> = [
    { value: 'auto', label: copy.auto, help: copy.autoHelp },
    { value: 'compact', label: copy.compact, help: copy.compactHelp },
  ]

  const wrapOptions: Array<{ value: EditorWrapMode; label: string; help: string }> = [
    { value: 'wrap', label: copy.wrap, help: copy.wrapHelp },
    { value: 'scroll', label: copy.scroll, help: copy.scrollHelp },
  ]

  const fontSizes: EditorFontSize[] = [14, 16, 18, 20, 22]

  return (
    <section className="hp-editor-preferences">
      <div className="hp-editor-preferences__heading">
        <div>
          <h3>{copy.title}</h3>
          <p>{copy.description}</p>
        </div>
        <span aria-hidden="true">{'</>'}</span>
      </div>

      <fieldset>
        <legend>{copy.height}</legend>
        <div className="hp-editor-preferences__grid">
          {heightOptions.map(option => (
            <button
              type="button"
              key={option.value}
              className={editorHeightMode === option.value ? 'is-selected' : ''}
              aria-pressed={editorHeightMode === option.value}
              onClick={() => setEditorHeightMode(option.value)}
            >
              <strong>{option.label}</strong>
              <small>{option.help}</small>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{copy.lines}</legend>
        <div className="hp-editor-preferences__grid">
          {wrapOptions.map(option => (
            <button
              type="button"
              key={option.value}
              className={editorWrapMode === option.value ? 'is-selected' : ''}
              aria-pressed={editorWrapMode === option.value}
              onClick={() => setEditorWrapMode(option.value)}
            >
              <strong>{option.label}</strong>
              <small>{option.help}</small>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{copy.textSize}</legend>
        <div className="hp-editor-preferences__sizes">
          {fontSizes.map(size => (
            <button
              type="button"
              key={size}
              className={editorFontSize === size ? 'is-selected' : ''}
              aria-pressed={editorFontSize === size}
              onClick={() => setEditorFontSize(size)}
            >
              {size}px
            </button>
          ))}
        </div>
      </fieldset>

      <p className="hp-editor-preferences__sync">{copy.sync}</p>
    </section>
  )
}
