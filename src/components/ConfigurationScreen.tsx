import { useMemo } from 'react'
import { Alert, Button, Card, CardHeader } from './ui'

interface Props { missing: string[] }

export default function ConfigurationScreen({ missing }: Props) {
  const lang = useMemo(() => localStorage.getItem('hp_lang') === 'en' ? 'en' : 'pt', [])
  const copy = lang === 'en' ? {
    eyebrow: 'Configuration required', title: 'The app is safe, but it is not connected yet.', body: 'Hashtag Python did not find valid public Supabase settings. Add the variables below to .env.local for local development or to the Cloudflare Pages environment settings for deployment.', local: 'Local development', cloud: 'Cloudflare Pages', localText: 'Create .env.local in the project root, add the two variables, then restart npm run dev.', cloudText: 'Open Settings → Variables and Secrets, add the same variables, then redeploy.', warning: 'Use only the public publishable/anon key. Never place a service_role or secret key in a browser app.', retry: 'Reload after configuring',
  } : {
    eyebrow: 'Configuração necessária', title: 'O app está seguro, mas ainda não está conectado.', body: 'O Hashtag Python não encontrou uma configuração pública válida do Supabase. Adicione as variáveis abaixo ao .env.local no desenvolvimento ou às variáveis do Cloudflare Pages no deploy.', local: 'Desenvolvimento local', cloud: 'Cloudflare Pages', localText: 'Crie .env.local na raiz do projeto, adicione as duas variáveis e reinicie npm run dev.', cloudText: 'Abra Settings → Variables and Secrets, adicione as mesmas variáveis e faça um novo deploy.', warning: 'Use somente a chave pública publishable/anon. Nunca coloque service_role ou secret key em um app de navegador.', retry: 'Recarregar após configurar',
  }

  return (
    <main className="min-h-[100dvh] bg-canvas p-5 grid place-items-center">
      <Card variant="raised" padding="lg" className="w-full max-w-3xl">
        <div className="text-caption uppercase tracking-widest font-bold text-primary-text">{copy.eyebrow}</div>
        <h1 className="mt-2 mb-3 text-h1">{copy.title}</h1>
        <p className="mb-0 text-ink-secondary">{copy.body}</p>
        <div className="my-5 rounded-hp border border-line bg-canvas p-4">
          {missing.map(name => <code key={name} className="block leading-8 text-success-text">{name}=...</code>)}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Card variant="subtle"><CardHeader title={copy.local} description={copy.localText} /></Card>
          <Card variant="subtle"><CardHeader title={copy.cloud} description={copy.cloudText} /></Card>
        </div>
        <Alert variant="warning" className="my-5">{copy.warning}</Alert>
        <Button onClick={() => window.location.reload()}>{copy.retry}</Button>
      </Card>
    </main>
  )
}
