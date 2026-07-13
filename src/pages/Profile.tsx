import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { getSupabase } from '../lib/supabase'
import type { Theme } from '../contexts/AppContext'
import EditorPreferences from '../components/EditorPreferences'
import SyncStatusIndicator from '../components/SyncStatusIndicator'
import { clearLocalLearningData, resetLearningProgress } from '../lib/resetLearningProgress'

const COUNTRY_CODES = [
  { code: '+1',   label: '+1 (US/CA)' },
  { code: '+55',  label: '+55 (BR)' },
  { code: '+44',  label: '+44 (UK)' },
  { code: '+33',  label: '+33 (FR)' },
  { code: '+49',  label: '+49 (DE)' },
  { code: '+34',  label: '+34 (ES)' },
  { code: '+39',  label: '+39 (IT)' },
  { code: '+351', label: '+351 (PT)' },
  { code: '+81',  label: '+81 (JP)' },
  { code: '+86',  label: '+86 (CN)' },
  { code: '+91',  label: '+91 (IN)' },
  { code: '+52',  label: '+52 (MX)' },
  { code: '+54',  label: '+54 (AR)' },
  { code: '+61',  label: '+61 (AU)' },
  { code: '+27',  label: '+27 (ZA)' },
  { code: '+82',  label: '+82 (KR)' },
  { code: '+7',   label: '+7 (RU)' },
  { code: '+90',  label: '+90 (TR)' },
  { code: '+31',  label: '+31 (NL)' },
  { code: '+46',  label: '+46 (SE)' },
]

export default function Profile() {
  const { lang, setLang, theme, setTheme, user, isGuest, exitGuest, displayName, avatarUrl, refreshUser, refreshProgress } = useApp()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  // Form state — populated from Supabase user metadata
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showLogout, setShowLogout] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [resetConfirmation, setResetConfirmation] = useState('')

  // Load user data when user object is available or changes (multi-device: always fresh)
  useEffect(() => {
    if (!user) return
    const meta = user.user_metadata || {}
    setName(meta.display_name || meta.full_name || meta.name || '')
    setPhone(meta.phone_number || '')
    setCountryCode(meta.country_code || '+1')
    setLocalAvatarUrl(meta.avatar_url || null)
  }, [user])

  // Also sync avatar when avatarUrl prop changes (after photo upload)
  useEffect(() => {
    if (avatarUrl) setLocalAvatarUrl(avatarUrl)
  }, [avatarUrl])

  const t = {
    en: {
      title: 'Profile',
      photo: 'Profile photo', changePhoto: 'Change photo', uploading: 'Uploading...',
      photoTip: 'JPG, PNG or GIF · max 5MB',
      personalInfo: 'Personal info',
      displayName: 'Display name', namePlaceholder: 'Your name',
      email: 'Email (login)', emailTip: 'Contact support to change your login email',
      phone: 'Phone number', phonePlaceholder: '555-123-4567',
      phoneTip: 'Include country code for international format',
      preferences: 'Preferences',
      theme: 'App theme', dark: 'Dark', light: 'Light', system: 'System (device)',
      language: 'Language',
      save: 'Save changes', saving: 'Saving...', saved: '✅ Saved!',
      logout: 'Sign out', logoutConfirm: 'Are you sure you want to sign out?',
      cancel: 'Cancel', confirm: 'Sign out',
      guestTitle: 'Visitor profile', guestText: 'Your progress is stored only in this browser. Create an account to use synchronization and access it on other devices.', guestAction: 'Create account or sign in',
      learningData: 'Learning data', resetProgress: 'Reset all learning progress',
      resetDescription: 'Start the course again from Phase 0. This permanently deletes completed lessons, exercises, quizzes, exams, drafts, diagnostic results and lab progress from this account and this device.',
      resetOpen: 'Reset progress', resetTitle: 'Start from zero?', resetWarning: 'This cannot be undone. Your profile, email, language, theme and editor preferences will be preserved.',
      resetType: 'Type RESET to confirm', resetAction: 'Delete progress and start over', resetting: 'Resetting...', resetCancel: 'Keep my progress', resetDone: 'Progress reset. Returning to the beginning...',
    },
    pt: {
      title: 'Perfil',
      photo: 'Foto de perfil', changePhoto: 'Mudar foto', uploading: 'Enviando...',
      photoTip: 'JPG, PNG ou GIF · máx 5MB',
      personalInfo: 'Informações pessoais',
      displayName: 'Nome de exibição', namePlaceholder: 'Seu nome',
      email: 'Email (login)', emailTip: 'Contate o suporte para alterar o email de login',
      phone: 'Telefone', phonePlaceholder: '555-123-4567',
      phoneTip: 'Inclua o código do país para formato internacional',
      preferences: 'Preferências',
      theme: 'Tema do app', dark: 'Escuro', light: 'Claro', system: 'Sistema (dispositivo)',
      language: 'Idioma',
      save: 'Salvar alterações', saving: 'Salvando...', saved: '✅ Salvo!',
      logout: 'Sair', logoutConfirm: 'Tem certeza que deseja sair?',
      cancel: 'Cancelar', confirm: 'Sair',
      guestTitle: 'Perfil visitante', guestText: 'Seu progresso fica apenas neste navegador. Crie uma conta para sincronizar e acessar em outros dispositivos.', guestAction: 'Criar conta ou entrar',
      learningData: 'Dados de aprendizagem', resetProgress: 'Resetar todo o progresso',
      resetDescription: 'Comece o curso novamente desde a Fase 0. Isso apaga permanentemente aulas, exercícios, quizzes, exames, rascunhos, diagnóstico e progresso dos laboratórios desta conta e deste aparelho.',
      resetOpen: 'Resetar progresso', resetTitle: 'Começar do zero?', resetWarning: 'Esta ação não pode ser desfeita. Seu perfil, email, idioma, tema e preferências do editor serão preservados.',
      resetType: 'Digite RESETAR para confirmar', resetAction: 'Apagar progresso e recomeçar', resetting: 'Resetando...', resetCancel: 'Manter meu progresso', resetDone: 'Progresso resetado. Voltando ao início...',
    }
  }[lang]

  if (isGuest) {
    return (
      <Layout title={t.title}>
        <div className="p-4 space-y-4">
          <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--c-purple-f)', border: '1px solid var(--c-purple-dm)' }}>
            <div className="text-5xl mb-3">👋</div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--c-text)' }}>{t.guestTitle}</h1>
            <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--c-text2)' }}>{t.guestText}</p>
            <button onClick={() => { localStorage.setItem('hp_guest_transfer_pending', 'true'); exitGuest(); navigate('/login', { replace: true }) }} className="w-full rounded-xl py-3 mt-5 text-sm font-semibold text-white" style={{ background: 'var(--c-purple)' }}>{t.guestAction}</button>
          </div>
          <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 14, padding: 16 }}>
            <div className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--c-muted)' }}>{t.preferences}</div>
            <div className="grid grid-cols-3 gap-2 mb-4">{([{ value: 'dark', label: t.dark, icon: '🌙' }, { value: 'light', label: t.light, icon: '☀️' }, { value: 'system', label: t.system, icon: '📱' }] as const).map(option => <button key={option.value} onClick={() => setTheme(option.value)} className="rounded-xl p-3 text-xs" style={{ background: theme === option.value ? 'var(--c-purple-dm)' : 'var(--c-bg)', color: theme === option.value ? 'var(--c-purple-l)' : 'var(--c-muted)', border: '1px solid var(--c-border)' }}><div className="text-xl mb-1">{option.icon}</div>{option.label}</button>)}</div>
            <div className="grid grid-cols-2 gap-2">{([{ code: 'en' as const, label: '🇨🇦 English' }, { code: 'pt' as const, label: '🇧🇷 Português' }]).map(option => <button key={option.code} onClick={() => setLang(option.code)} className="rounded-xl py-3 text-sm" style={{ background: lang === option.code ? 'var(--c-purple-dm)' : 'var(--c-bg)', color: lang === option.code ? 'var(--c-purple-l)' : 'var(--c-muted)', border: '1px solid var(--c-border)' }}>{option.label}</button>)}</div>
          </div>
          <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 14, padding: 16 }}>
            <div className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--c-muted)' }}>{t.learningData}</div>
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--c-text)' }}>{t.resetProgress}</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--c-text2)' }}>{t.resetDescription}</p>
            <button onClick={() => { clearLocalLearningData(); navigate('/phase/0', { replace: true }); window.location.reload() }} className="w-full rounded-xl py-3 text-sm font-semibold" style={{ background: '#3f1117', color: '#fca5a5', border: '1px solid #7f1d1d' }}>{t.resetOpen}</button>
          </div>
          <EditorPreferences />
        </div>
      </Layout>
    )
  }

  // ── Photo upload ──
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    setError('')
    try {
      // Always use same filename to overwrite — no duplicates
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${user.id}/avatar.${ext}`

      // Remove old avatar first (any extension)
      await getSupabase().storage.from('avatars').remove([
        `${user.id}/avatar.jpg`,
        `${user.id}/avatar.jpeg`,
        `${user.id}/avatar.png`,
        `${user.id}/avatar.gif`,
        `${user.id}/avatar.webp`,
      ])

      // Upload new
      const { error: upErr } = await getSupabase().storage
        .from('avatars')
        .upload(path, file, { upsert: true, cacheControl: '1' })
      if (upErr) throw upErr

      // Get public URL with cache buster
      const { data } = getSupabase().storage.from('avatars').getPublicUrl(path)
      const url = `${data.publicUrl}?v=${Date.now()}`

      // Save to user metadata
      const { error: metaErr } = await getSupabase().auth.updateUser({
        data: { avatar_url: url }
      })
      if (metaErr) throw metaErr

      setLocalAvatarUrl(url)
      await refreshUser()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // ── Save profile ──
  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError('')
    try {
      const { error: updateErr } = await getSupabase().auth.updateUser({
        data: {
          display_name: name.trim(),
          phone_number: phone.trim(),
          country_code: countryCode,
          full_phone: phone.trim() ? `${countryCode} ${phone.trim()}` : '',
        }
      })
      if (updateErr) throw updateErr

      // Refresh user so displayName updates everywhere (multi-device: next load gets fresh)
      await refreshUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  // ── Reset learning progress ──
  const handleResetProgress = async () => {
    if (!user) return
    const expected = lang === 'pt' ? 'RESETAR' : 'RESET'
    if (resetConfirmation.trim().toUpperCase() !== expected) return
    setResetting(true)
    setError('')
    try {
      await resetLearningProgress(user.id)
      await refreshProgress()
      setResetConfirmation('')
      setShowReset(false)
      setSaved(true)
      setTimeout(() => {
        navigate('/phase/0', { replace: true })
        window.location.reload()
      }, 900)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reset learning progress')
    } finally {
      setResetting(false)
    }
  }

  // ── Logout ──
  const handleLogout = async () => {
    // 'global' scope signs out from ALL devices/sessions
    // 'local' scope only clears this device's session
    await getSupabase().auth.signOut({ scope: 'local' })
    
    // Clear all local app state
    localStorage.removeItem('hp_onboarding_done')
    localStorage.removeItem('hp_ft_done')
    
    // Force navigate to login — replace so back button can't return
    navigate('/login', { replace: true })
    
    // Hard reload to clear any in-memory auth state
    window.location.href = '/'
  }

  // ── Styles ──
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--c-bg)',
    border: '0.5px solid var(--c-border)',
    borderRadius: 10,
    padding: '10px 14px',
    color: 'var(--c-text)',
    fontSize: 14,
    outline: 'none',
    minHeight: 44,
  }

  const sectionStyle: React.CSSProperties = {
    background: 'var(--c-card)',
    border: '0.5px solid var(--c-border)',
    borderRadius: 14,
    padding: '16px',
    marginBottom: 12,
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    color: 'var(--c-muted)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 6,
  }

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'dark', label: t.dark, icon: '🌙' },
    { value: 'light', label: t.light, icon: '☀️' },
    { value: 'system', label: t.system, icon: '📱' },
  ]

  const initials = (name || displayName || user?.email || '?')[0]?.toUpperCase()

  return (
    <Layout title={t.title}>
      <div className="p-4">

        <SyncStatusIndicator />

        {/* ── Photo ── */}
        <div style={sectionStyle}>
          <label style={labelStyle}>{t.photo}</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{ background: 'none', border: 'none', padding: 0, position: 'relative', flexShrink: 0 }}
            >
              <div
                className="flex items-center justify-center text-white font-medium overflow-hidden"
                style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--c-purple-d)', fontSize: 28 }}
              >
                {localAvatarUrl ? (
                  <img src={localAvatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : initials}
              </div>
              <div
                className="flex items-center justify-center text-white"
                style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: '50%', background: 'var(--c-purple)', fontSize: 11 }}
              >
                {uploading ? '…' : '✎'}
              </div>
            </button>
            <div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--c-purple-l)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >
                {uploading ? t.uploading : t.changePhoto}
              </button>
              <div style={{ fontSize: 11, color: 'var(--c-dimmer)', marginTop: 4 }}>{t.photoTip}</div>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
        </div>

        {/* ── Personal info ── */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
            {t.personalInfo}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>{t.displayName}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>{t.email}</label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              style={{ ...inputStyle, opacity: 0.5, cursor: 'default' }}
            />
            <div style={{ fontSize: 11, color: 'var(--c-dimmer)', marginTop: 4 }}>{t.emailTip}</div>
          </div>

          <div>
            <label style={labelStyle}>{t.phone}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                style={{ ...inputStyle, width: 'auto', flexShrink: 0, paddingRight: 8 }}
              >
                {COUNTRY_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                style={inputStyle}
              />
            </div>
            <div style={{ fontSize: 11, color: 'var(--c-dimmer)', marginTop: 4 }}>{t.phoneTip}</div>
          </div>
        </div>

        {/* ── Preferences ── */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
            {t.preferences}
          </div>

          {/* Theme */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t.theme}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {themeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  style={{
                    border: theme === opt.value ? '2px solid var(--c-purple)' : '0.5px solid var(--c-border)',
                    background: theme === opt.value ? 'var(--c-purple-dm)' : 'var(--c-bg)',
                    color: theme === opt.value ? 'var(--c-purple-l)' : 'var(--c-muted)',
                    borderRadius: 10, padding: '10px 4px',
                    fontSize: 12, fontWeight: theme === opt.value ? 500 : 400,
                    cursor: 'pointer', minHeight: 60,
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{opt.icon}</div>
                  <div>{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label style={labelStyle}>{t.language}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[{ code: 'en' as const, label: '🇨🇦 English' }, { code: 'pt' as const, label: '🇧🇷 Português' }].map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  style={{
                    border: lang === l.code ? '2px solid var(--c-purple)' : '0.5px solid var(--c-border)',
                    background: lang === l.code ? 'var(--c-purple-dm)' : 'var(--c-bg)',
                    color: lang === l.code ? 'var(--c-purple-l)' : 'var(--c-muted)',
                    borderRadius: 10, padding: '10px 4px',
                    fontSize: 13, fontWeight: lang === l.code ? 500 : 400,
                    cursor: 'pointer', minHeight: 44,
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <EditorPreferences />

        {/* Error */}
        {error && (
          <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 14px', fontSize: 13, marginBottom: 12 }}>
            {error}
          </div>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: saved ? '#166534' : 'var(--c-purple)',
            color: '#fff', fontSize: 14, fontWeight: 500,
            border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1, marginBottom: 10,
          }}
        >
          {saving ? t.saving : saved ? t.saved : t.save}
        </button>

        {/* Logout */}
        <button
          onClick={() => setShowLogout(true)}
          style={{
            width: '100%', padding: '12px', borderRadius: 12,
            background: 'transparent',
            color: '#f87171', fontSize: 14, fontWeight: 500,
            border: '0.5px solid rgba(239,68,68,0.35)', cursor: 'pointer',
            marginBottom: 8,
          }}
        >
          {t.logout}
        </button>

        {/* Logout confirm overlay */}
        {showReset && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80, padding: 16 }} role="dialog" aria-modal="true">
            <div style={{ width: '100%', maxWidth: 440, background: 'var(--c-card)', border: '1px solid #7f1d1d', borderRadius: 18, padding: 20 }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>⚠️</div>
              <h2 style={{ fontSize: 18, color: 'var(--c-text)', fontWeight: 700, marginBottom: 8 }}>{t.resetTitle}</h2>
              <p style={{ fontSize: 13, color: 'var(--c-text2)', lineHeight: 1.6, marginBottom: 14 }}>{t.resetWarning}</p>
              <label style={labelStyle}>{t.resetType}</label>
              <input
                value={resetConfirmation}
                onChange={event => setResetConfirmation(event.target.value)}
                autoComplete="off"
                style={{ ...inputStyle, marginBottom: 12 }}
                data-testid="reset-progress-confirmation"
              />
              <button
                onClick={handleResetProgress}
                disabled={resetting || resetConfirmation.trim().toUpperCase() !== (lang === 'pt' ? 'RESETAR' : 'RESET')}
                style={{ width: '100%', padding: 14, borderRadius: 12, background: '#dc2626', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', marginBottom: 8, opacity: resetting || resetConfirmation.trim().toUpperCase() !== (lang === 'pt' ? 'RESETAR' : 'RESET') ? 0.45 : 1 }}
              >
                {resetting ? t.resetting : t.resetAction}
              </button>
              <button
                onClick={() => { setShowReset(false); setResetConfirmation('') }}
                disabled={resetting}
                style={{ width: '100%', padding: 12, borderRadius: 12, background: 'transparent', color: 'var(--c-muted)', fontSize: 14, border: '1px solid var(--c-border)', cursor: 'pointer' }}
              >
                {t.resetCancel}
              </button>
            </div>
          </div>
        )}

        {showLogout && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 16,
            }}
            onClick={() => setShowLogout(false)}
          >
            <div
              style={{
                width: '100%', maxWidth: 480,
                background: 'var(--c-card)', borderRadius: 20, padding: 24,
              }}
              onClick={e => e.stopPropagation()}
            >
              <p style={{ fontSize: 14, color: 'var(--c-text2)', textAlign: 'center', marginBottom: 16 }}>
                {t.logoutConfirm}
              </p>
              <button
                onClick={handleLogout}
                style={{ width: '100%', padding: 14, borderRadius: 12, background: '#dc2626', color: '#fff', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer', marginBottom: 8 }}
              >
                {t.confirm}
              </button>
              <button
                onClick={() => setShowLogout(false)}
                style={{ width: '100%', padding: 12, borderRadius: 12, background: 'transparent', color: 'var(--c-muted)', fontSize: 14, border: '0.5px solid var(--c-border)', cursor: 'pointer' }}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}

        <div style={{ height: 8 }} />
      </div>
    </Layout>
  )
}
