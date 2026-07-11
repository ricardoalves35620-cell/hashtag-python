import React from 'react'

interface State {
  error: Error | null
}

export default class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught application error:', error, info)
  }

  private resetApp = () => {
    this.setState({ error: null })
    window.location.assign('/')
  }

  render() {
    if (!this.state.error) return this.props.children

    const lang = localStorage.getItem('hp_lang') === 'en' ? 'en' : 'pt'
    const copy = lang === 'en' ? {
      title: 'Something interrupted the lesson.',
      body: 'Your progress was not intentionally deleted. Reload the app first. If the problem returns, copy the technical detail below when reporting it.',
      reload: 'Reload app', detail: 'Technical detail',
    } : {
      title: 'Algo interrompeu a aula.',
      body: 'Seu progresso não foi apagado intencionalmente. Primeiro recarregue o app. Se o problema voltar, copie o detalhe técnico abaixo ao reportar o erro.',
      reload: 'Recarregar app', detail: 'Detalhe técnico',
    }

    return (
      <main style={{ minHeight: '100dvh', background: '#090914', color: '#f5f3ff', display: 'grid', placeItems: 'center', padding: 20 }}>
        <section style={{ width: 'min(680px, 100%)', background: '#151326', border: '1px solid #4c1d95', borderRadius: 18, padding: 28 }}>
          <div style={{ fontSize: 36 }}>🧯</div>
          <h1 style={{ margin: '12px 0 10px' }}>{copy.title}</h1>
          <p style={{ color: '#bbb7c8', lineHeight: 1.7 }}>{copy.body}</p>
          <details style={{ margin: '18px 0', background: '#090914', borderRadius: 10, padding: 12 }}>
            <summary style={{ cursor: 'pointer', color: '#c4b5fd' }}>{copy.detail}</summary>
            <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: '#fca5a5', fontSize: 12 }}>{this.state.error.message}</pre>
          </details>
          <button onClick={this.resetApp} style={{ border: 0, borderRadius: 10, padding: '12px 16px', background: '#7c3aed', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>{copy.reload}</button>
        </section>
      </main>
    )
  }
}
