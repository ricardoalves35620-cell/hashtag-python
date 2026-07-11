import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabase'
import { ALL_PHASES } from '../data/phases'

interface GroupMember {
  user_id: string
  display_name: string
  progress: { phase_id: number; exam_passed: boolean }[]
  avatar_color?: string
}

interface GroupData {
  id: string
  name: string
  invite_code: string
  created_by: string
  created_at: string
}

interface Challenge {
  id: string
  title: string
  description: string
  level: 'easy' | 'medium' | 'hard'
  created_by: string
  created_by_name: string
  points: number
  attempts?: number
  best_time?: number
}

type ActiveTab = 'friends' | 'challenges' | 'chat'

export default function Group() {
  const { lang, user, displayName } = useApp()
  const [activeTab, setActiveTab] = useState<ActiveTab>('friends')
  const [members, setMembers] = useState<GroupMember[]>([])
  const [groupId, setGroupId] = useState<string | null>(null)
  const [groupData, setGroupData] = useState<GroupData | null>(null)
  const [inviteCode, setInviteCode] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [showNewChallenge, setShowNewChallenge] = useState(false)
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', level: 'easy' as const })

  useEffect(() => { if (user) loadGroup() }, [user])

  const loadGroup = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const { data: memberData } = await supabase
        .from('family_members')
        .select('group_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!memberData) {
        setGroupId(null)
        setLoading(false)
        return
      }

      setGroupId(memberData.group_id)

      const { data: group } = await supabase
        .from('family_groups')
        .select('*')
        .eq('id', memberData.group_id)
        .single()

      if (group) {
        setGroupData(group)
        setInviteCode(group.invite_code)
      }

      const { data: allMembers } = await supabase
        .from('family_members')
        .select('user_id, display_name')
        .eq('group_id', memberData.group_id)

      if (allMembers) {
        const withProgress = await Promise.all(
          allMembers.map(async m => {
            const { data: prog } = await supabase
              .from('user_progress')
              .select('phase_id, exam_passed')
              .eq('user_id', m.user_id)
            return { ...m, progress: prog || [] }
          })
        )
        setMembers(withProgress)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load group'
      setError(msg)
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
        .insert({ name: `${name}'s Group`, created_by: user.id, invite_code: code })
        .select()
        .single()

      if (groupErr) throw groupErr
      if (!group) throw new Error('Group creation returned no data')

      const { error: memberErr } = await supabase
        .from('family_members')
        .insert({ group_id: group.id, user_id: user.id, display_name: name })

      if (memberErr) throw memberErr
      await loadGroup()
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
      const { data: group } = await supabase
        .from('family_groups')
        .select('id')
        .eq('invite_code', joinCode.trim().toUpperCase())
        .maybeSingle()

      if (!group) throw new Error(lang === 'en' ? 'Code not found.' : 'Código não encontrado.')

      const name = displayName || user.email?.split('@')[0] || 'User'
      const { error: memberErr } = await supabase
        .from('family_members')
        .insert({ group_id: group.id, user_id: user.id, display_name: name })

      if (memberErr) {
        if (memberErr.code === '23505') throw new Error(lang === 'en' ? 'Already in this group.' : 'Já faz parte deste grupo.')
        throw memberErr
      }

      await loadGroup()
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

  const createChallenge = async () => {
    if (!user || !groupId) return
    try {
      const { error } = await supabase
        .from('challenges')
        .insert({
          group_id: groupId,
          created_by: user.id,
          title: newChallenge.title,
          description: newChallenge.description,
          level: newChallenge.level,
          points: newChallenge.level === 'easy' ? 10 : newChallenge.level === 'medium' ? 25 : 50
        })

      if (error) throw error
      setNewChallenge({ title: '', description: '', level: 'easy' })
      setShowNewChallenge(false)
      // Reload challenges
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create challenge')
    }
  }

  const t = {
    en: {
      title: 'Group',
      noGroup: 'Create or join a group',
      noGroupDesc: 'Create a group to collaborate and compete with friends.',
      create: creating ? 'Creating...' : 'Create group',
      join: 'Join with code',
      joinPlaceholder: 'e.g. ABC123',
      joinBtn: joining ? 'Joining...' : 'Join',
      inviteCode: 'Invite code',
      shareCode: 'Share this code with your friends',
      copy: 'Copy',
      copied: 'Copied!',
      friends: 'Friends',
      challenges: 'Challenges',
      chat: 'Chat',
      progress: 'Progress',
      phasesComplete: 'phases complete',
      loading: 'Loading...',
      newChallenge: 'New Challenge',
      createChallenge: 'Create Challenge',
      title_label: 'Title',
      description_label: 'Description',
      level_label: 'Level',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      cancel: 'Cancel',
      save: 'Save Challenge',
      online: 'Online',
      away: 'Away'
    },
    pt: {
      title: 'Grupo',
      noGroup: 'Criar ou entrar em um grupo',
      noGroupDesc: 'Crie um grupo para colaborar e competir com amigos.',
      create: creating ? 'Criando...' : 'Criar grupo',
      join: 'Entrar com código',
      joinPlaceholder: 'ex: ABC123',
      joinBtn: joining ? 'Entrando...' : 'Entrar',
      inviteCode: 'Código de convite',
      shareCode: 'Compartilhe este código com seus amigos',
      copy: 'Copiar',
      copied: 'Copiado!',
      friends: 'Amigos',
      challenges: 'Desafios',
      chat: 'Chat',
      progress: 'Progresso',
      phasesComplete: 'fases completas',
      loading: 'Carregando...',
      newChallenge: 'Novo Desafio',
      createChallenge: 'Criar Desafio',
      title_label: 'Título',
      description_label: 'Descrição',
      level_label: 'Nível',
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil',
      cancel: 'Cancelar',
      save: 'Salvar Desafio',
      online: 'Online',
      away: 'Ausente'
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
      <div className="p-4 pb-32">
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#f87171', marginBottom: 12 }}>
            {error}
          </div>
        )}

        {!groupId && loading ? (
          <div className="text-center py-12" style={{ color: 'var(--c-muted)', fontSize: 14 }}>{t.loading}</div>
        ) : !groupId ? (
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
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '0.5px solid var(--c-border)', paddingBottom: 12 }}>
              {(['friends', 'challenges', 'chat'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 14px',
                    background: activeTab === tab ? 'var(--c-purple-dm)' : 'transparent',
                    color: activeTab === tab ? 'var(--c-purple-l)' : 'var(--c-muted)',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {tab === 'friends' ? t.friends : tab === 'challenges' ? t.challenges : t.chat}
                </button>
              ))}
            </div>

            {/* Invite Code Card */}
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
            </div>

            {/* Friends Tab */}
            {activeTab === 'friends' && (
              <>
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

            {/* Challenges Tab */}
            {activeTab === 'challenges' && (
              <>
                <button
                  onClick={() => setShowNewChallenge(!showNewChallenge)}
                  style={{
                    width: '100%', padding: '12px', marginBottom: 12,
                    background: 'var(--c-purple)', color: '#fff',
                    border: 'none', borderRadius: 10,
                    fontSize: 14, fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {t.createChallenge}
                </button>

                {showNewChallenge && (
                  <div style={card}>
                    <input
                      placeholder={t.title_label}
                      value={newChallenge.title}
                      onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })}
                      style={{
                        width: '100%', padding: '10px', marginBottom: 8,
                        background: 'var(--c-bg)', border: '0.5px solid var(--c-border)',
                        borderRadius: 8, fontSize: 14, color: 'var(--c-text)',
                        outline: 'none',
                      }}
                    />
                    <textarea
                      placeholder={t.description_label}
                      value={newChallenge.description}
                      onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })}
                      style={{
                        width: '100%', padding: '10px', marginBottom: 8,
                        background: 'var(--c-bg)', border: '0.5px solid var(--c-border)',
                        borderRadius: 8, fontSize: 14, color: 'var(--c-text)',
                        outline: 'none', minHeight: 80, fontFamily: 'inherit',
                      }}
                    />
                    <select
                      value={newChallenge.level}
                      onChange={e => setNewChallenge({ ...newChallenge, level: e.target.value as any })}
                      style={{
                        width: '100%', padding: '10px', marginBottom: 12,
                        background: 'var(--c-bg)', border: '0.5px solid var(--c-border)',
                        borderRadius: 8, fontSize: 14, color: 'var(--c-text)',
                        outline: 'none',
                      }}
                    >
                      <option value="easy">{t.easy}</option>
                      <option value="medium">{t.medium}</option>
                      <option value="hard">{t.hard}</option>
                    </select>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setShowNewChallenge(false)}
                        style={{
                          flex: 1, padding: '10px',
                          background: 'var(--c-bg)', border: '0.5px solid var(--c-border)',
                          borderRadius: 8, fontSize: 13, fontWeight: 500,
                          cursor: 'pointer', color: 'var(--c-text)',
                        }}
                      >
                        {t.cancel}
                      </button>
                      <button
                        onClick={createChallenge}
                        style={{
                          flex: 1, padding: '10px',
                          background: 'var(--c-purple)', color: '#fff',
                          border: 'none', borderRadius: 8,
                          fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        }}
                      >
                        {t.save}
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ fontSize: 13, color: 'var(--c-muted)', textAlign: 'center', paddingTop: 20 }}>
                  Coming soon: Challenge leaderboard & competition mode 🏆
                </div>
              </>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div style={{ fontSize: 13, color: 'var(--c-muted)', textAlign: 'center', paddingTop: 20 }}>
                Coming soon: Group chat & help requests 💬
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
