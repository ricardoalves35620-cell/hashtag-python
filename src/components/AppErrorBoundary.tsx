import React from 'react'
import { Button, Card } from './ui'
import AppLoadingScreen from './AppLoadingScreen'
import { isRecoveryReloadPending } from '../lib/appUpdate'

interface State { error: Error | null }

export default class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { error: null }
  static getDerivedStateFromError(error: Error): State { return { error } }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('Uncaught application error:', error, info) }
  private resetApp = () => { this.setState({ error: null }); window.location.assign('/') }

  render() {
    if (!this.state.error) return this.props.children
    const lang = localStorage.getItem('hp_lang') === 'en' ? 'en' : 'pt'
    // A chunk failure with a recovery reload already on the way is not a crash: the
    // page is about to land on the new build. location.reload() takes a few hundred
    // milliseconds to commit and React renders this boundary inside that window —
    // measured in the 2026-07-30 repro as a flash of the crash card on every
    // successful recovery. Show the quiet loading screen for that moment instead.
    if (isRecoveryReloadPending()) {
      return <AppLoadingScreen label={lang === 'en' ? 'Updating the app…' : 'Atualizando o app…'} />
    }
    const copy = lang === 'en' ? {
      title: 'Something interrupted the lesson.', body: 'Your progress was not intentionally deleted. Reload the app first. If the problem returns, copy the technical detail below when reporting it.', reload: 'Reload app', detail: 'Technical detail',
    } : {
      title: 'Algo interrompeu a aula.', body: 'Seu progresso não foi apagado intencionalmente. Primeiro recarregue o app. Se o problema voltar, copie o detalhe técnico abaixo ao reportar o erro.', reload: 'Recarregar app', detail: 'Detalhe técnico',
    }

    return (
      <main className="min-h-[100dvh] bg-canvas p-5 grid place-items-center">
        <Card variant="danger" padding="lg" className="w-full max-w-2xl">
          <div className="text-4xl" aria-hidden="true">!</div>
          <h1 className="mt-3 mb-2 text-h2">{copy.title}</h1>
          <p className="text-sm">{copy.body}</p>
          <details className="mt-5 mb-5 rounded-hp bg-canvas p-3 border border-danger-border">
            <summary className="cursor-pointer font-semibold">{copy.detail}</summary>
            <pre className="mt-3 mb-0 whitespace-pre-wrap break-words text-xs text-danger-text">{this.state.error.message}</pre>
          </details>
          <Button variant="danger" onClick={this.resetApp}>{copy.reload}</Button>
        </Card>
      </main>
    )
  }
}
