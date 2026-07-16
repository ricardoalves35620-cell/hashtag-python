import { Alert, Button } from '../ui'
import type { MiniProjectGuide } from '../../data/miniProjectGuides'

type Lang = 'en' | 'pt'

function labels(lang: Lang) {
  return lang === 'pt' ? {
    yourJob: 'Seu trabalho, um passo por vez',
    input: 'O que entra no programa',
    output: 'O que sai do programa',
    happens: 'O que o programa faz',
    guidedHelp: 'Precisa de ajuda? Use estas respostas como ponto de partida. Depois leia e edite com suas palavras.',
    guidedAnswers: 'Colocar respostas guiadas nas caixas',
    guidedPlanHelp: 'Este é um roteiro correto. Leia cada linha antes de usar.',
    guidedPlan: 'Colocar a receita guiada na caixa',
    codeWords: 'O que os nomes do código significam',
    buildOrder: 'Corrija o código nesta ordem',
    testPurpose: 'Por que este cenário existe',
    change: 'Mudança',
    example: 'Exemplo',
    reason: 'Por que ajuda',
    doNotChange: 'Não altere isto',
    choose: 'Escolha uma pequena melhoria',
    noteExample: 'Exemplo de explicação',
  } : {
    yourJob: 'Your job, one step at a time',
    input: 'What goes into the program',
    output: 'What comes out of the program',
    happens: 'What the program does',
    guidedHelp: 'Need help? Use these answers as a starting point. Then read and edit them in your own words.',
    guidedAnswers: 'Put guided answers in the boxes',
    guidedPlanHelp: 'This is a correct outline. Read every line before using it.',
    guidedPlan: 'Put the guided recipe in the box',
    codeWords: 'What the code names mean',
    buildOrder: 'Fix the code in this order',
    testPurpose: 'Why this scenario exists',
    change: 'Change',
    example: 'Example',
    reason: 'Why it helps',
    doNotChange: 'Do not change this',
    choose: 'Choose one small improvement',
    noteExample: 'Explanation example',
  }
}

export function MiniProjectMissionBrief({
  guide,
  lang,
  onUseAnswers,
}: {
  guide: MiniProjectGuide
  lang: Lang
  onUseAnswers: () => void
}) {
  const t = labels(lang)
  return <>
    <section className="mt-5" data-testid="project-child-friendly-brief">
      <h3 className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{t.yourJob}</h3>
      <ol className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>
        {guide.exactTasks.map((step, index) => <li key={step.en} className="flex gap-3">
          <strong className="shrink-0" style={{ color: 'var(--c-purple)' }}>{index + 1}.</strong>
          <span>{step[lang]}</span>
        </li>)}
      </ol>
    </section>

    <div className="grid md:grid-cols-2 gap-4 mt-5">
      <section className="rounded-xl p-4" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{t.input}</h3>
        <div className="mt-3 space-y-3">
          {guide.inputItems.map(item => <div key={item.label.en}>
            <div className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{item.label[lang]}</div>
            <div className="text-sm mt-1" style={{ color: 'var(--c-text2)' }}>{item.meaning[lang]}</div>
            <code className="inline-block mt-1 max-w-full break-words text-xs rounded px-2 py-1" style={{ background: 'var(--c-code-bg)', color: 'var(--c-text2)' }}>{item.example[lang]}</code>
          </div>)}
        </div>
      </section>

      <section className="rounded-xl p-4" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{t.output}</h3>
        <div className="mt-3 space-y-3">
          {guide.outputItems.map(item => <div key={item.label.en}>
            <div className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{item.label[lang]}</div>
            <div className="text-sm mt-1" style={{ color: 'var(--c-text2)' }}>{item.meaning[lang]}</div>
            <code className="inline-block mt-1 max-w-full break-words text-xs rounded px-2 py-1" style={{ background: 'var(--c-code-bg)', color: 'var(--c-text2)' }}>{item.example[lang]}</code>
          </div>)}
        </div>
      </section>
    </div>

    <section className="rounded-xl p-4 mt-5" style={{ background: 'var(--c-purple-f)', border: '1px solid var(--c-purple-dm)' }}>
      <h3 className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{guide.sample.title[lang]}</h3>
      <div className="grid md:grid-cols-3 gap-4 mt-3 text-sm">
        <div>
          <strong style={{ color: 'var(--c-text)' }}>{t.input}</strong>
          <ul className="mt-2 space-y-1" style={{ color: 'var(--c-text2)' }}>{guide.sample.inputs.map(item => <li key={item.en}>• {item[lang]}</li>)}</ul>
        </div>
        <div>
          <strong style={{ color: 'var(--c-text)' }}>{t.happens}</strong>
          <ul className="mt-2 space-y-1" style={{ color: 'var(--c-text2)' }}>{guide.sample.happens.map(item => <li key={item.en}>• {item[lang]}</li>)}</ul>
        </div>
        <div>
          <strong style={{ color: 'var(--c-text)' }}>{t.output}</strong>
          <ul className="mt-2 space-y-1" style={{ color: 'var(--c-text2)' }}>{guide.sample.outputs.map(item => <li key={item.en}>• {item[lang]}</li>)}</ul>
        </div>
      </div>
    </section>

    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm max-w-2xl" style={{ color: 'var(--c-text2)' }}>{t.guidedHelp}</div>
      <Button variant="secondary" size="sm" onClick={onUseAnswers}>{t.guidedAnswers}</Button>
    </div>
  </>
}

export function MiniProjectGuidedPlan({ guide, lang, onUsePlan }: { guide: MiniProjectGuide; lang: Lang; onUsePlan: () => void }) {
  const t = labels(lang)
  return <div className="rounded-xl p-4 mt-4" data-testid="project-guided-plan" style={{ background: 'var(--c-purple-f)', color: 'var(--c-text2)', border: '1px solid var(--c-purple-dm)' }}>
    <div className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{t.guidedPlanHelp}</div>
    <ol className="mt-3 space-y-2 text-sm font-mono">
      {guide.planSteps.map((item, index) => <li key={item.en}>{index + 1}. {item[lang]}</li>)}
    </ol>
    <Button className="mt-4" variant="secondary" size="sm" onClick={onUsePlan}>{t.guidedPlan}</Button>
  </div>
}

export function MiniProjectBuildGuide({ guide, lang }: { guide: MiniProjectGuide; lang: Lang }) {
  const t = labels(lang)
  return <div className="grid md:grid-cols-2 gap-4 mt-4" data-testid="project-build-guide">
    <section className="rounded-xl p-4" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)' }}>
      <h3 className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{t.codeWords}</h3>
      <dl className="mt-3 space-y-3 text-sm">
        {guide.codeWords.map(item => <div key={item.code}>
          <dt><code className="rounded px-2 py-1 text-xs" style={{ background: 'var(--c-code-bg)', color: 'var(--c-text)' }}>{item.code}</code></dt>
          <dd className="mt-1" style={{ color: 'var(--c-text2)' }}>{item.meaning[lang]}</dd>
        </div>)}
      </dl>
    </section>
    <section className="rounded-xl p-4" style={{ background: 'var(--c-purple-f)', border: '1px solid var(--c-purple-dm)' }}>
      <h3 className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{t.buildOrder}</h3>
      <ol className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>
        {guide.buildHints.map((hint, index) => <li key={hint.en} className="flex gap-2">
          <strong style={{ color: 'var(--c-purple)' }}>{index + 1}.</strong><span>{hint[lang]}</span>
        </li>)}
      </ol>
    </section>
  </div>
}

export function MiniProjectTestPurpose({ guide, testId, lang }: { guide: MiniProjectGuide; testId: string; lang: Lang }) {
  const t = labels(lang)
  const purpose = guide.testPurposes[testId]
  if (!purpose) return null
  return <div className="mt-3 rounded-lg p-3 text-sm" style={{ background: 'var(--c-purple-f)', color: 'var(--c-text2)', border: '1px solid var(--c-purple-dm)' }}>
    <strong style={{ color: 'var(--c-text)' }}>{t.testPurpose}:</strong> {purpose[lang]}
  </div>
}

export function MiniProjectImprovementGuide({
  guide,
  lang,
  selectedIndex,
  onSelect,
}: {
  guide: MiniProjectGuide
  lang: Lang
  selectedIndex: number | undefined
  onSelect: (index: number) => void
}) {
  const t = labels(lang)
  return <>
    <Alert variant="info" className="mt-4">{guide.improveIntro[lang]}</Alert>
    <Alert variant="warning" className="mt-3"><strong>{t.doNotChange}:</strong> {guide.doNotChange[lang]}</Alert>
    <h3 className="text-sm font-semibold mt-5" style={{ color: 'var(--c-text)' }}>{t.choose}</h3>
    <div className="space-y-3 mt-3" data-testid="project-explicit-improvement-choices">
      {guide.improveChoices.map((option, index) => {
        const checked = selectedIndex === index
        return <label key={option.title.en} className="flex gap-3 items-start rounded-xl p-4 cursor-pointer" style={{ background: checked ? 'var(--c-purple-f)' : 'var(--c-bg)', border: checked ? '2px solid var(--c-purple)' : '1px solid var(--c-border)' }}>
          <input type="radio" name="project-improvement" checked={checked} onChange={() => onSelect(index)} className="mt-1" />
          <span className="min-w-0 flex-1">
            <strong className="block text-sm" style={{ color: 'var(--c-text)' }}>{option.title[lang]}</strong>
            <span className="block text-sm mt-2" style={{ color: 'var(--c-text2)' }}><strong>{t.change}:</strong> {option.change[lang]}</span>
            <span className="block text-sm mt-2" style={{ color: 'var(--c-text2)' }}><strong>{t.example}:</strong> <code className="whitespace-pre-wrap break-words">{option.example[lang]}</code></span>
            <span className="block text-sm mt-2" style={{ color: 'var(--c-text2)' }}><strong>{t.reason}:</strong> {option.why[lang]}</span>
          </span>
        </label>
      })}
    </div>
    <div className="text-xs mt-4" style={{ color: 'var(--c-muted)' }}><strong>{t.noteExample}:</strong> {guide.improveNoteExample[lang]}</div>
  </>
}
