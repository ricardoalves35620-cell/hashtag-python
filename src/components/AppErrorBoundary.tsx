import React from 'react'
import { Button, Card } from './ui'

interface State { error: Error | null }

export default class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { error: null }
  static getDerivedStateFromError(error: Error): State { return { error } }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('Uncaught application error:', error, info) }
  private resetApp = () => { this.setState({ error: null }); window.location.assign('/') }

  render() {
    if (!this.state.error) return this.props.children
    const lang = localStorage.getItem('hp_lang') === 'en' ? 'en' : 'pt'
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
