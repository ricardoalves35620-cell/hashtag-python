import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabase'
import { ALL_PHASES } from '../data/phases'

interface Member {
  user_id: string
  display_name: string
  progress: { phase_id: number; exam_passed: boolean }[]
}

export default function Family() {
  const { lang, user, displayName } = useApp()
  const [members, setMembers] = useState<Member[]>([])
  const [groupId, setGroupId] = useState<string | null>(null)
  const [inviteCode, setInviteCode] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { if (user) loadFamily() }, [user])

  const loadFamily = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      // Use maybeSingle() — returns null instead of throwing when no row found
      const { data: memberData, error: memberErr } = await supabase
        .from('family_members')
        .select('group_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (memberErr) throw memberErr

      if (!memberData) {
        setGroupId(null)
        setLoading(false)
        return
      }

      setGroupId(memberData.group_id)

      const { data: group, error: groupErr } = await supabase
        .from('family_groups')
        .select('invite_code')
        .eq('id', memberData.group_id)
        .maybeSingle()

      if (groupErr) throw groupErr
      if (group) setInviteCode(group.invite_code)

      const { data: allMembers, error: membersErr } = await supabase
        .from('family_members')
        .select('user_id, display_name')
        .eq('group_id', memberData.group_id)

      if (membersErr) throw membersErr

      if (allMembers) {
        const withProgress = await Promise.all(allMembers.map(async m => {
          const { data: prog } = await supabase
            .from('user_progress')
            .select('phase_id, exam_passed')
            .eq('user_id', m.user_id)
          return { ...m, progress: prog || [] }
        }))
        setMembers(withProgress)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load family data')
    } finally {
      setLoading(false)
    }
  }

  const createGroup = async () => {
    if (!user) return
    setCreating(true)
    setError('')
    try {
      const name = displayName || user.email?.split('@')[0] || 'User'
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()

      const { data: group, error: groupErr } = await supabase
        .from('family_groups')
        .insert({ name: `${name}'s Family`, created_by: user.id, invite_code: code })
        .select()
        .single()

      if (groupErr) throw groupErr
      if (!group) throw new Error('Group creation returned no data')

      const { error: memberErr } = await supabase
        .from('family_members')
        .insert({ group_id: group.id, user_id: user.id, display_name: name })

      if (memberErr) throw memberErr

      await loadFamily()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create group')
    } finally {
      setCreating(false)
    }
  }

  const joinGroup = async () => {
    if (!user || !joinCode.trim()) return
    setJoining(true)
    setError('')
    try {
      const { data: group, error: groupErr } = await supabase
        .from('family_groups')
        .select('id')
        .eq('invite_code', joinCode.trim().toUpperCase())
        .maybeSingle()

      if (groupErr) throw groupErr
      if (!group) throw new Error(lang === 'en' ? 'Code not found. Check and try again.' : 'Código não encontrado. Verifique e tente novamente.')

      const name = displayName || user.email?.split('@')[0] || 'User'
      const { error: memberErr } = await supabase
        .from('family_members')
        .insert({ group_id: group.id, user_id: user.id, display_name: name })

      if (memberErr) {
        if (memberErr.code === '23505') throw new Error(lang === 'en' ? 'You are already in this group.' : 'Você já faz parte deste grupo.')
        throw memberErr
      }

      await loadFamily()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to join group')
    } finally {
      setJoining(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const t = {
    en: {
      title: 'Family', noGroup: 'Create or join a family group',
      noGroupDesc: 'Create a group and share the code with your family to track progress together.',
      create: creating ? 'Creating...' : 'Create family group',
      join: 'Join with invite code', joinPlaceholder: 'e.g. ABC123', joinBtn: joining ? 'Joining...' : 'Join',
      inviteCode: 'Invite code', shareCode: 'Share this code with your family',
      copy: 'Copy', copied: 'Copied!',
      phasesComplete: 'phases complete', loading: 'Loading...',
    },
    pt: {
      title: 'Família', noGroup: 'Criar ou entrar em um grupo familiar',
      noGroupDesc: 'Crie um grupo e compartilhe o código com a família para acompanhar o progresso juntos.',
      create: creating ? 'Criando...' : 'Criar grupo familiar',
      join: 'Entrar com código de convite', joinPlaceholder: 'ex: ABC123', joinBtn: joining ? 'Entrando...' : 'Entrar',
      inviteCode: 'Código de convite', shareCode: 'Compartilhe este código com sua família',
      copy: 'Copiar', copied: 'Copiado!',
      phasesComplete: 'fases completas', loading: 'Carregando...',
    }
  }[lang]

  const avatarColors = ['#5b21b6', '#0f766e', '#9333ea', '#c2410c', '#1d4ed8', '#b45309']

  const card: React.CSSProperties = {
    background: 'var(--c-card)',
    border: '0.5px solid var(--c-border)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  }

  return (
    <Layout title={t.title}>
      <div className="p-4">
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#f87171', marginBottom: 12 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12" style={{ color: 'var(--c-muted)', fontSize: 14 }}>{t.loading}</div>
        ) : !groupId ? (
          <>
            <div style={card}>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--c-text)', marginBottom: 6 }}>{t.noGroup}</div>
              <p style={{ fontSize: 13, color: 'var(--c-text2)', marginBottom: 16, lineHeight: 1.6 }}>{t.noGroupDesc}</p>

              <button
                onClick={createGroup}
                disabled={creating}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: 'var(--c-purple)', color: '#fff',
                  fontSize: 14, fontWeight: 500, border: 'none',
                  cursor: creating ? 'not-allowed' : 'pointer',
                  opacity: creating ? 0.7 : 1, marginBottom: 16,
                }}
              >
                {t.create}
              </button>

              <div style={{ borderTop: '0.5px solid var(--c-border)', paddingTop: 14 }}>
                <div style={{ fontSize: 12, color: 'var(--c-muted)', marginBottom: 8 }}>{t.join}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    placeholder={t.joinPlaceholder}
                    maxLength={6}
                    style={{
                      flex: 1, background: 'var(--c-bg)', border: '0.5px solid var(--c-border)',
                      borderRadius: 10, padding: '10px 14px', fontSize: 14,
                      color: 'var(--c-text)', outline: 'none', minHeight: 44,
                      fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase',
                    }}
                  />
                  <button
                    onClick={joinGroup}
                    disabled={joining || !joinCode.trim()}
                    style={{
                      padding: '10px 16px', borderRadius: 10,
                      background: 'var(--c-purple-dm)', color: 'var(--c-purple-l)',
                      fontSize: 14, fontWeight: 500, border: 'none',
                      cursor: joining ? 'not-allowed' : 'pointer',
                      opacity: joining ? 0.7 : 1, minHeight: 44, flexShrink: 0,
                    }}
                  >
                    {t.joinBtn}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Invite code */}
            <div style={card}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                {t.inviteCode}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 600, color: 'var(--c-purple-l)', letterSpacing: 4 }}>
                  {inviteCode}
                </span>
                <button
                  onClick={copyCode}
                  style={{
                    padding: '8px 14px', borderRadius: 8,
                    background: copied ? '#166534' : 'var(--c-purple-dm)',
                    color: copied ? '#86efac' : 'var(--c-purple-l)',
                    fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', minHeight: 36,
                  }}
                >
                  {copied ? t.copied : t.copy}
                </button>
              </div>
              <div style={{ fontSize: 12, color: 'var(--c-dimmer)', marginTop: 6 }}>{t.shareCode}</div>
            </div>

            {/* Members */}
            {members.map((m, i) => {
              const passed = m.progress.filter(p => p.exam_passed).length
              const pct = Math.round((passed / 27) * 100)
              const isMe = m.user_id === user?.id
              return (
                <div key={m.user_id} style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                      background: avatarColors[i % avatarColors.length],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 16, fontWeight: 500,
                    }}>
                      {m.display_name[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--c-text)' }}>
                        {m.display_name}
                        {isMe && <span style={{ fontSize: 11, color: 'var(--c-muted)', marginLeft: 6 }}>({lang === 'en' ? 'you' : 'você'})</span>}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--c-muted)' }}>{passed} {t.phasesComplete}</div>
                    </div>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--c-purple-l)' }}>{pct}%</span>
                  </div>

                  <div style={{ height: 4, background: 'var(--c-bg)', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--c-purple)', borderRadius: 2, transition: 'width 0.5s' }} />
                  </div>

                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {ALL_PHASES.slice(0, 10).map(phase => {
                      const done = m.progress.some(pr => pr.phase_id === phase.id && pr.exam_passed)
                      return (
                        <div key={phase.id} style={{
                          width: 26, height: 26, borderRadius: 6,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 500,
                          background: done ? 'rgba(34,197,94,0.15)' : 'var(--c-bg)',
                          color: done ? '#4ade80' : 'var(--c-dimmer)',
                          border: `0.5px solid ${done ? '#166534' : 'var(--c-border)'}`,
                        }}>
                          {phase.id}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </Layout>
  )
}
