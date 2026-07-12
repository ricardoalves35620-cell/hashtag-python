export default function AppLoadingScreen({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="hp-app-loading" role="status" aria-live="polite">
      <div className="hp-app-loading__mark" aria-hidden="true">#</div>
      <div className="hp-app-loading__bar" aria-hidden="true"><span /></div>
      <p>{label}</p>
    </div>
  )
}
