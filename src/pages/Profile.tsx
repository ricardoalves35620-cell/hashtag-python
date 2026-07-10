import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabase'
import type { Theme } from '../contexts/AppContext'

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸🇨🇦', label: '+1 (US/CA)' },
  { code: '+55', flag: '🇧🇷', label: '+55 (BR)' },
  { code: '+44', flag: '🇬🇧', label: '+44 (UK)' },
  { code: '+33', flag: '🇫🇷', label: '+33 (FR)' },
  { code: '+49', flag: '🇩🇪', label: '+49 (DE)' },
  { code: '+34', flag: '🇪🇸', label: '+34 (ES)' },
  { code: '+39', flag: '🇮🇹', label: '+39 (IT)' },
  { code: '+351', flag: '🇵🇹', label: '+351 (PT)' },
  { code: '+81', flag: '🇯🇵', label: '+81 (JP)' },
  { code: '+86', flag: '🇨🇳', label: '+86 (CN)' },
  { code: '+91', flag: '🇮🇳', label: '+91 (IN)' },
  { code: '+52', flag: '🇲🇽', label: '+52 (MX)' },
  { code: '+54', flag: '🇦🇷', label: '+54 (AR)' },
  { code: '+61', flag: '🇦🇺', label: '+61 (AU)' },
  { code: '+27', flag: '🇿🇦', label: '+27 (ZA)' },
  { code: '+other', flag: '🌍', label: 'Other' },
]

export default function Profile() {
  const { lang, setLang, theme, setTheme, user, displayName, avatarUrl, refreshProgress, refreshUser } = useApp()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user?.user_metadata?.display_name || '')
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '')
  const [countryCode, setCountryCode] = useState(user?.user_metadata?.country_code || '+1')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatarUrl)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showLogout, setShowLogout] = useState(false)

  const t = {
    en: {
      title: 'Profile', photo: 'Profile photo', changePic: 'Change photo',
      name: 'Display name', email: 'Email', phone: 'Phone number',
      countryCode: 'Country code', phoneNum: 'Number',
      theme: 'App theme', dark: 'Dark', light: 'Light', system: 'System',
      language: 'Language', save: 'Save changes', saving: 'Saving...',
      saved: 'Saved!', logout: 'Sign out', logoutConfirm: 'Are you sure you want to sign out?',
      cancel: 'Cancel', confirm: 'Sign out', section1: 'Personal info', section2: 'Preferences',
      phoneTip: 'Include country code for international format',
    },
    pt: {
      title: 'Perfil', photo: 'Foto de perfil', changePic: 'Mudar foto',
      name: 'Nome de exibição', email: 'Email', phone: 'Telefone',
      countryCode: 'Código do país', phoneNum: 'Número',
      theme: 'Tema do app', dark: 'Escuro', light: 'Claro', system: 'Sistema',
      language: 'Idioma', save: 'Salvar alterações', saving: 'Salvando...',
      saved: 'Salvo!', logout: 'Sair', logoutConfirm: 'Tem certeza que deseja sair?',
      cancel: 'Cancelar', confirm: 'Sair', section1: 'Informações pessoais', section2: 'Preferências',
      phoneTip: 'Inclua o código do país para formato internacional',
    }
  }[lang]

  const handlePhotoClick = () => fileRef.current?.click()

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = data.publicUrl + '?t=' + Date.now()
      setAvatarPreview(url)
      await supabase.auth.updateUser({ data: { avatar_url: url } })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError('')
    try {
      const fullPhone = phone ? `${countryCode} ${phone}` : ''
      await supabase.auth.updateUser({
        data: { display_name: name, phone: phone, country_code: countryCode, full_phone: fullPhone }
      })
      await refreshUser(); setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--c-card)',
    border: '0.5px solid var(--c-border)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--c-text)',
    fontSize: '14px',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: 'var(--c-muted)',
    fontWeight: '500',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '6px',
  }

  const sectionStyle = {
    background: 'var(--c-card)',
    border: '0.5px solid var(--c-border)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
  }

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'dark', label: t.dark, icon: '🌙' },
    { value: 'light', label: t.light, icon: '☀️' },
    { value: 'system', label: t.system, icon: '📱' },
  ]

  return (
    <Layout showBack backTo="/home" title={t.title}>
      <div className="p-4 space-y-3">

        {/* Avatar */}
        <div style={sectionStyle}>
          <div style={labelStyle}>{t.photo}</div>
          <div className="flex items-center gap-4">
            <button onClick={handlePhotoClick} className="relative flex-shrink-0" disabled={uploading}>
              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-medium text-white" style={{ background: 'var(--c-purple-d)' }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  (name || displayName)[0]?.toUpperCase() || '?'
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ background: 'var(--c-purple)' }}>
                {uploading ? '…' : '✎'}
              </div>
            </button>
            <div>
              <button onClick={handlePhotoClick} className="text-sm font-medium" style={{ color: 'var(--c-purple-l)' }}>
                {uploading ? 'Uploading...' : t.changePic}
              </button>
              <div className="text-xs mt-1" style={{ color: 'var(--c-muted)' }}>JPG, PNG or GIF · max 5MB</div>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>

        {/* Personal info */}
        <div style={sectionStyle}>
          <div className="text-xs font-medium uppercase tracking-wide mb-4" style={{ color: 'var(--c-muted)' }}>{t.section1}</div>

          <div className="space-y-3">
            <div>
              <label style={labelStyle}>{t.name}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>{t.email}</label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label style={labelStyle}>{t.phone}</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  style={{ ...inputStyle, width: 'auto', flexShrink: 0, paddingRight: '8px' }}
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="555-123-4567"
                  style={inputStyle}
                />
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--c-dimmer)' }}>{t.phoneTip}</div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div style={sectionStyle}>
          <div className="text-xs font-medium uppercase tracking-wide mb-4" style={{ color: 'var(--c-muted)' }}>{t.section2}</div>

          <div className="space-y-4">
            {/* Theme */}
            <div>
              <label style={labelStyle}>{t.theme}</label>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className="py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      border: theme === opt.value ? '2px solid var(--c-purple)' : '0.5px solid var(--c-border)',
                      background: theme === opt.value ? 'var(--c-purple-dm)' : 'var(--c-bg)',
                      color: theme === opt.value ? 'var(--c-purple-l)' : 'var(--c-muted)',
                      fontWeight: theme === opt.value ? '500' : '400',
                    }}
                  >
                    <div className="text-lg mb-0.5">{opt.icon}</div>
                    <div style={{ fontSize: '12px' }}>{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label style={labelStyle}>{t.language}</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ code: 'en', label: '🇨🇦 English' }, { code: 'pt', label: '🇧🇷 Português' }].map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code as 'en' | 'pt')}
                    className="py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      border: lang === l.code ? '2px solid var(--c-purple)' : '0.5px solid var(--c-border)',
                      background: lang === l.code ? 'var(--c-purple-dm)' : 'var(--c-bg)',
                      color: lang === l.code ? 'var(--c-purple-l)' : 'var(--c-muted)',
                      fontWeight: lang === l.code ? '500' : '400',
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-sm rounded-xl px-4 py-3" style={{ color: 'var(--c-text-danger, #f87171)', background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)' }}>
            {error}
          </div>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full font-medium py-3.5 rounded-xl text-sm transition-colors text-white disabled:opacity-50"
          style={{ background: saved ? '#166534' : 'var(--c-purple)', }}
        >
          {saved ? '✅ ' + t.saved : saving ? t.saving : t.save}
        </button>

        {/* Logout */}
        <button
          onClick={() => setShowLogout(true)}
          className="w-full font-medium py-3 rounded-xl text-sm transition-colors"
          style={{ border: '0.5px solid rgba(239,68,68,0.4)', color: '#f87171', background: 'rgba(239,68,68,0.05)' }}
        >
          {t.logout}
        </button>

        {/* Logout confirm */}
        {showLogout && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div className="w-full max-w-sm rounded-2xl p-6 space-y-3" style={{ background: 'var(--c-card)', border: '0.5px solid var(--c-border)' }}>
              <p className="text-sm text-center" style={{ color: 'var(--c-text2)' }}>{t.logoutConfirm}</p>
              <button onClick={handleLogout} className="w-full py-3 rounded-xl text-sm font-medium text-white" style={{ background: '#dc2626' }}>
                {t.confirm}
              </button>
              <button onClick={() => setShowLogout(false)} className="w-full py-3 rounded-xl text-sm" style={{ border: '0.5px solid var(--c-border)', color: 'var(--c-muted)' }}>
                {t.cancel}
              </button>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </Layout>
  )
}
