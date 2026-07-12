import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { SKILLS, getSkill } from '../data/skills'
import { getDueSkillStates, getLearningSummary, getWeakestSkillStates, masteryLabel } from '../lib/learningEngine'
import { calculateGamification } from '../lib/gamification'

export default function LearningProgress() {
  const navigate = useNavigate()
  const { lang, learningState } = useApp()
  const summary = getLearningSummary(learningState)
  const game = calculateGamification(learningState)
  const due = getDueSkillStates(learningState)
  const weakest = getWeakestSkillStates(learningState, 4)
  const recent = [...learningState.attempts].reverse().slice(0, 8)
  const commonErrors = Object.entries(learningState.attempts.reduce<Record<string, number>>((counts, attempt) => {
    if (attempt.errorCategory) counts[attempt.errorCategory] = (counts[attempt.errorCategory] || 0) + 1
    return counts
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const t = {
    en: {
      title: 'Learning progress', subtitle: 'Mastery by skill, not just completed screens.',
      mastery: 'Average mastery', practiced: 'Skills assessed', attempts: 'Recorded attempts',
      review: due.length ? `${due.length} review${due.length === 1 ? '' : 's'} due` : 'Practice weakest skills',
      diagnostic: learningState.diagnosticCompletedAt ? 'Retake diagnostic' : 'Take initial diagnostic',
      gaps: 'Priority gaps', allSkills: 'All skills', history: 'Recent attempts', commonErrors: 'Errors to understand', notAssessed: 'Not assessed',
      noHistory: 'Your attempts will appear here after exercises, quizzes, exams and reviews.',
      success: 'Success', needsWork: 'Needs work', phase: 'Phase', level: 'Level', streak: 'day streak', xp: 'XP earned', badges: 'Achievements',
    },
    pt: {
      title: 'Progresso de aprendizagem', subtitle: 'Domínio por habilidade, não apenas telas concluídas.',
      mastery: 'Domínio médio', practiced: 'Habilidades avaliadas', attempts: 'Tentativas registradas',
      review: due.length ? `${due.length} revis${due.length === 1 ? 'ão pendente' : 'ões pendentes'}` : 'Praticar pontos mais fracos',
      diagnostic: learningState.diagnosticCompletedAt ? 'Refazer diagnóstico' : 'Fazer diagnóstico inicial',
      gaps: 'Lacunas prioritárias', allSkills: 'Todas as habilidades', history: 'Tentativas recentes', commonErrors: 'Erros para entender', notAssessed: 'Não avaliada',
      noHistory: 'Suas tentativas aparecerão aqui após exercícios, quizzes, exames e revisões.',
      success: 'Sucesso', needsWork: 'Precisa revisar', phase: 'Fase', level: 'Nível', streak: 'dias de sequência', xp: 'XP conquistado', badges: 'Conquistas',
    },
  }[lang]

  const cardStyle: React.CSSProperties = {
    background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 14, padding: 16,
  }

  return (
    <Layout title={t.title}>
      <div className="p-4 space-y-4">
        <button onClick={() => navigate('/career')} className="w-full rounded-xl border border-primary/30 bg-primary-soft p-4 text-left transition hover:border-primary">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">{lang === 'en' ? 'Career readiness' : 'Preparação para o mercado'}</div>
          <div className="mt-1 font-semibold text-ink">{lang === 'en' ? 'See the evidence and portfolio projects employers expect' : 'Veja as evidências e projetos de portfólio esperados pelo mercado'}</div>
          <div className="mt-1 text-sm text-ink-secondary">{lang === 'en' ? 'Turn phase completion into demonstrable professional skills.' : 'Transforme fases concluídas em habilidades profissionais demonstráveis.'}</div>
        </button>
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--c-text)' }}>{t.title}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--c-text2)' }}>{t.subtitle}</p>
        </div>

        <section className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, var(--c-purple-f), var(--c-card))', border: '1px solid var(--c-purple-dm)' }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--c-purple-l)' }}>{t.level} {game.level}</div>
              <div className="text-2xl font-semibold mt-1" style={{ color: 'var(--c-text)' }}>{game.xp} {t.xp}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl">🔥</div>
              <div className="text-xs" style={{ color: 'var(--c-text2)' }}>{game.streak} {t.streak}</div>
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden mt-4" style={{ background: 'var(--c-bg)' }}>
            <div className="h-full rounded-full" style={{ width: `${game.progressPercent}%`, background: 'var(--c-purple)' }} />
          </div>
          <div className="flex justify-between text-[11px] mt-1" style={{ color: 'var(--c-muted)' }}>
            <span>{game.currentLevelXp}/{game.nextLevelXp} XP</span><span>{game.progressPercent}%</span>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-2">
          {[
            [summary.averageMastery + '%', t.mastery],
            [`${summary.practicedSkills}/${summary.totalSkills}`, t.practiced],
            [String(summary.totalAttempts), t.attempts],
          ].map(([value, label]) => (
            <div key={label} style={{ ...cardStyle, padding: 12, textAlign: 'center' }}>
              <div className="text-xl font-mono font-semibold" style={{ color: 'var(--c-purple-l)' }}>{value}</div>
              <div className="text-[11px] mt-1 leading-tight" style={{ color: 'var(--c-muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => navigate('/review')} style={{ ...cardStyle, textAlign: 'left', minHeight: 96 }}>
            <div className="text-xl">🧠</div>
            <div className="text-sm font-semibold mt-2" style={{ color: 'var(--c-text)' }}>{t.review}</div>
          </button>
          <button onClick={() => navigate('/diagnostic')} style={{ ...cardStyle, textAlign: 'left', minHeight: 96 }}>
            <div className="text-xl">🩺</div>
            <div className="text-sm font-semibold mt-2" style={{ color: 'var(--c-text)' }}>{t.diagnostic}</div>
          </button>
        </div>

        {weakest.length > 0 && (
          <section style={cardStyle}>
            <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--c-muted)' }}>{t.gaps}</h2>
            <div className="space-y-3">
              {weakest.map(state => {
                const skill = getSkill(state.skillId)
                if (!skill) return null
                return (
                  <div key={state.skillId}>
                    <div className="flex justify-between gap-3 text-sm mb-1">
                      <span style={{ color: 'var(--c-text)' }}>{skill.title[lang]}</span>
                      <span style={{ color: state.mastery >= 70 ? '#4ade80' : '#f8d477' }}>{state.mastery}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--c-bg)' }}>
                      <div className="h-full rounded-full" style={{ width: `${state.mastery}%`, background: state.mastery >= 70 ? '#22c55e' : 'var(--c-purple)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <section style={cardStyle}>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--c-muted)' }}>{t.allSkills}</h2>
          <div className="space-y-3">
            {SKILLS.map(skill => {
              const state = learningState.skills[skill.id]
              const mastery = state?.mastery ?? 0
              return (
                <div key={skill.id} className="rounded-xl p-3" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)' }}>
                  <div className="flex justify-between gap-3 items-start">
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--c-text)' }}>{skill.title[lang]}</div>
                      <div className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--c-muted)' }}>{skill.description[lang]}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-mono" style={{ color: state ? 'var(--c-purple-l)' : 'var(--c-muted)' }}>{state ? `${mastery}%` : '—'}</div>
                      <div className="text-[10px]" style={{ color: 'var(--c-muted)' }}>{state ? masteryLabel(mastery, lang) : t.notAssessed}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {game.badges.length > 0 && (
          <section style={cardStyle}>
            <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--c-muted)' }}>{t.badges}</h2>
            <div className="grid grid-cols-2 gap-2">
              {game.badges.map(id => {
                const names: Record<string, [string, string, string]> = {
                  'first-step': ['🌱', 'First step', 'Primeiro passo'],
                  consistent: ['🎯', 'Consistent learner', 'Aluno consistente'],
                  'perfect-exam': ['💯', 'Perfect exam', 'Exame perfeito'],
                  'three-day-streak': ['🔥', '3-day streak', 'Sequência de 3 dias'],
                  'skill-master': ['🏆', 'Skill mastery', 'Domínio de habilidade'],
                }
                const badge = names[id]
                return <div key={id} className="rounded-xl p-3" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)' }}><div className="text-xl">{badge?.[0]}</div><div className="text-xs font-semibold mt-1" style={{ color: 'var(--c-text)' }}>{lang === 'en' ? badge?.[1] : badge?.[2]}</div></div>
              })}
            </div>
          </section>
        )}

        {commonErrors.length > 0 && (
          <section style={cardStyle}>
            <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--c-muted)' }}>{t.commonErrors}</h2>
            <div className="flex flex-wrap gap-2">
              {commonErrors.map(([error, count]) => (
                <span key={error} className="text-xs px-3 py-2 rounded-lg font-mono" style={{ background: 'rgba(239,68,68,.08)', border: '1px solid #7f1d1d', color: '#fca5a5' }}>
                  {error} · {count}
                </span>
              ))}
            </div>
          </section>
        )}

        <section style={cardStyle}>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--c-muted)' }}>{t.history}</h2>
          {recent.length === 0 ? (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.noHistory}</p>
          ) : (
            <div className="space-y-2">
              {recent.map(attempt => (
                <div key={attempt.id} className="flex items-center justify-between gap-3 rounded-lg p-3" style={{ background: 'var(--c-bg)' }}>
                  <div>
                    <div className="text-sm" style={{ color: 'var(--c-text)' }}>{t.phase} {attempt.phaseId} · {attempt.activity}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>{new Date(attempt.timestamp).toLocaleString()}{attempt.errorCategory ? ` · ${attempt.errorCategory}` : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono" style={{ color: attempt.passed ? '#4ade80' : '#f87171' }}>{attempt.score}%</div>
                    <div className="text-[10px]" style={{ color: 'var(--c-muted)' }}>{attempt.passed ? t.success : t.needsWork}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  )
}
