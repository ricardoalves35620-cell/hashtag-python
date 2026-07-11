import { useMemo } from 'react'

interface Props {
  missing: string[]
}

export default function ConfigurationScreen({ missing }: Props) {
  const lang = useMemo(() => localStorage.getItem('hp_lang') === 'en' ? 'en' : 'pt', [])
  const copy = lang === 'en' ? {
    eyebrow: 'Configuration required',
    title: 'The app is safe, but it is not connected yet.',
    body: 'Hashtag Python did not find valid public Supabase settings. Add the variables below to .env.local for local development or to the Cloudflare Pages environment settings for deployment.',
    local: 'Local development',
    cloud: 'Cloudflare Pages',
    localText: 'Create .env.local in the project root, add the two variables, then restart npm run dev.',
    cloudText: 'Open Settings → Variables and Secrets, add the same variables, then redeploy.',
    warning: 'Use only the public publishable/anon key. Never place a service_role or secret key in a browser app.',
    retry: 'Reload after configuring',
  } : {
    eyebrow: 'Configuração necessária',
    title: 'O app está seguro, mas ainda não está conectado.',
    body: 'O Hashtag Python não encontrou uma configuração pública válida do Supabase. Adicione as variáveis abaixo ao .env.local no desenvolvimento ou às variáveis do Cloudflare Pages no deploy.',
    local: 'Desenvolvimento local',
    cloud: 'Cloudflare Pages',
    localText: 'Crie .env.local na raiz do projeto, adicione as duas variáveis e reinicie npm run dev.',
    cloudText: 'Abra Settings → Variables and Secrets, adicione as mesmas variáveis e faça um novo deploy.',
    warning: 'Use somente a chave pública publishable/anon. Nunca coloque service_role ou secret key em um app de navegador.',
    retry: 'Recarregar após configurar',
  }

  return (
    <main style={{
      minHeight: '100dvh', background: 'var(--c-bg, #090914)', color: 'var(--c-text, #f5f3ff)',
      display: 'grid', placeItems: 'center', padding: 20,
    }}>
      <section style={{
        width: 'min(720px, 100%)', border: '1px solid rgba(139,92,246,.35)', borderRadius: 20,
        padding: 'clamp(22px, 5vw, 40px)', background: 'rgba(20,18,40,.96)', boxShadow: '0 24px 80px rgba(0,0,0,.35)'
      }}>
        <div style={{ color: '#c4b5fd', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{copy.eyebrow}</div>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', lineHeight: 1.12, margin: '10px 0 14px' }}>{copy.title}</h1>
        <p style={{ color: '#c4c1d4', lineHeight: 1.7, margin: 0 }}>{copy.body}</p>

        <div style={{ margin: '22px 0', background: '#080812', border: '1px solid #312e50', borderRadius: 12, padding: 16 }}>
          {missing.map(name => <code key={name} style={{ display: 'block', color: '#86efac', lineHeight: 1.9 }}>{name}=...</code>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
          <article style={{ border: '1px solid #312e50', borderRadius: 12, padding: 16 }}>
            <strong>{copy.local}</strong>
            <p style={{ color: '#a9a5b8', fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>{copy.localText}</p>
          </article>
          <article style={{ border: '1px solid #312e50', borderRadius: 12, padding: 16 }}>
            <strong>{copy.cloud}</strong>
            <p style={{ color: '#a9a5b8', fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>{copy.cloudText}</p>
          </article>
        </div>

        <p style={{ color: '#fbbf24', fontSize: 13, lineHeight: 1.6, margin: '18px 0' }}>⚠️ {copy.warning}</p>
        <button onClick={() => window.location.reload()} style={{
          border: 0, borderRadius: 10, padding: '12px 16px', background: '#7c3aed', color: 'white', fontWeight: 700, cursor: 'pointer'
        }}>{copy.retry}</button>
      </section>
    </main>
  )
}
