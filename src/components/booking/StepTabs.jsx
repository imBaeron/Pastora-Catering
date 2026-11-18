// Numbered steps. A step shows a check mark once its information is complete.
export default function StepTabs({ steps, step, onGo }) {
  return (
    <div className="tabs" role="tablist" aria-label="Booking steps">
      {steps.map((s, i) => (
        <button type="button" key={s.name} role="tab" aria-selected={step === i + 1}
          className={`tab ${step === i + 1 ? 'on' : ''} ${s.done ? 'done' : ''}`} onClick={() => onGo(i + 1)}>
          <span className="num">{s.done ? '✓' : i + 1}</span> {s.name}
        </button>
      ))}
    </div>
  )
}
