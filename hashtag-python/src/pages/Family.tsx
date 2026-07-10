import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabase'
import { ALL_PHASES } from '../data/phases'

interface Member {
  user_id: string
  display_name: string
  progress: { phase_id: number; exam_passed: boolean; exam_score: number }[]
}

export default function Family() {
  const { lang, user } = useApp()
  const [members, setMembers] = useState<Member[]>([])
  const [groupId, setGroupId] = useState<string | null>(null)
  const [inviteCode, setInviteCode] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadFamily()
  }, [user])

  const loadFamily = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data: memberData } = await supabase
        .from('family_members')
        .select('group_id')
        .eq('user_id', user.id)
        .single()

      if (memberData) {
        setGroupId(memberData.group_id)
        const { data: group } = await supabase
          .from('family_groups')
          .select('invite_code')
          .eq('id', memberData.group_id)
          .single()
        if (group) setInviteCode(group.invite_code)

        const { data: allMembers } = await supabase
          .from('family_members')
          .select('user_id, display_name')
          .eq('group_id', memberData.group_id)

        if (allMembers) {
          const withProgress = await Promise.all(allMembers.map(async (m) => {
            const { data: prog } = await supabase
              .from('user_progress')
              .select('phase_id, exam_passed, exam_score')
              .eq('user_id', m.user_id)
            return { ...m, progress: prog || [] }
          }))
          setMembers(withProgress)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const createGroup = async () => {
    if (!user) return
    const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const { data: group } = await supabase
      .from('family_groups')
      .insert({ name: `${displayName}'s Family`, created_by: user.id, invite_code: code })
      .select().single()
    if (group) {
      await supabase.from('family_members').insert({ group_id: group.id, user_id: user.id, display_name: displayName })
      await loadFamily()
    }
  }

  const joinGroup = async () => {
    if (!user || !joinCode.trim()) return
    const { data: group } = await supabase
      .from('family_groups')
      .select('id')
      .eq('invite_code', joinCode.trim().toUpperCase())
      .single()
    if (group) {
      const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'
      await supabase.from('family_members').insert({ group_id: group.id, user_id: user.id, display_name: displayName })
      await loadFamily()
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const t = {
    en: {
      title: 'Family Progress',
      noGroup: 'Create or join a family group',
      create: 'Create family group',
      join: 'Join with code',
      joinPlaceholder: 'Enter code (e.g. ABC123)',
      inviteCode: 'Invite code',
      shareCode: 'Share this code with family members',
      copy: 'Copy', copied: 'Copied!',
      phasesComplete: 'phases complete',
      loading: 'Loading...'
    },
    pt: {
      title: 'Progresso da Família',
      noGroup: 'Criar ou entrar em um grupo familiar',
      create: 'Criar grupo familiar',
      join: 'Entrar com código',
      joinPlaceholder: 'Digite o código (ex: ABC123)',
      inviteCode: 'Código de convite',
      shareCode: 'Compartilhe este código com a família',
      copy: 'Copiar', copied: 'Copiado!',
      phasesComplete: 'fases completas',
      loading: 'Carregando...'
    }
  }[lang]

  const avatarColors = ['#5b21b6', '#0f766e', '#9333ea', '#c2410c', '#1d4ed8']

  return (
    <Layout showBack backTo="/home" title={t.title}>
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-center text-muted py-8">{t.loading}</div>
        ) : !groupId ? (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="text-sm font-medium text-white mb-1">{t.noGroup}</h2>
              <p className="text-xs text-muted mb-4">
                {lang === 'en'
                  ? 'Create a group and share the code with your family to track progress together.'
                  : 'Crie um grupo e compartilhe o código com a família para acompanhar o progresso juntos.'}
              </p>
              <button
                onClick={createGroup}
                className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3 rounded-xl text-sm transition-colors mb-3"
              >
                {t.create}
              </button>

              <div className="border-t border-border pt-3">
                <div className="text-xs text-muted mb-2">{t.join}</div>
                <div className="flex gap-2">
                  <input
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value)}
                    placeholder={t.joinPlaceholder}
                    className="flex-1 bg-[#0d0d1f] border border-[#1e1e40] rounded-xl px-3 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus:border-purple-DEFAULT"
                  />
                  <button
                    onClick={joinGroup}
                    className="bg-purple-dim text-purple-light px-4 py-2 rounded-xl text-sm hover:bg-purple-dark hover:text-white transition-colors"
                  >
                    {lang === 'en' ? 'Join' : 'Entrar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Invite code */}
            <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-4">
              <div className="text-xs text-muted mb-1 uppercase tracking-wide">{t.inviteCode}</div>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-2xl font-medium text-purple-light tracking-widest">{inviteCode}</span>
                <button
                  onClick={copyCode}
                  className="text-xs bg-purple-dim text-purple-light px-3 py-1.5 rounded-lg hover:bg-purple-dark hover:text-white transition-colors"
                >
                  {copied ? t.copied : t.copy}
                </button>
              </div>
              <div className="text-xs text-muted mt-2">{t.shareCode}</div>
            </div>

            {/* Members */}
            <div className="space-y-3">
              {members.map((m, i) => {
                const passedPhases = m.progress.filter(p => p.exam_passed).length
                const pct = Math.round((passedPhases / 10) * 100)
                const isCurrentUser = m.user_id === user?.id

                return (
                  <div key={m.user_id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0"
                        style={{ background: avatarColors[i % avatarColors.length] }}
                      >
                        {m.display_name[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">
                          {m.display_name}
                          {isCurrentUser && <span className="ml-2 text-xs text-muted">(you)</span>}
                        </div>
                        <div className="text-xs text-muted">{passedPhases} {t.phasesComplete}</div>
                      </div>
                      <span className="text-xs font-mono text-purple-light">{pct}%</span>
                    </div>

                    {/* Phase dots */}
                    <div className="flex gap-1.5 flex-wrap">
                      {ALL_PHASES.map(phase => {
                        const p = m.progress.find(pr => pr.phase_id === phase.id)
                        return (
                          <div
                            key={phase.id}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium ${
                              p?.exam_passed
                                ? 'bg-green-900/50 text-green-400 border border-green-700'
                                : 'bg-[#0a0a18] text-muted border border-border'
                            }`}
                            title={`Phase ${phase.id}: ${phase.title[lang]}`}
                          >
                            {phase.id}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
