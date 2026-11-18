// Dishes shown as large tap targets. `radio` = pick exactly one; otherwise pick up to `max`.
export default function DishPicker({ name, options, selected, max, radio, onPick, isTaken = () => false }) {
  return (
    <div className="dishes">
      {options.map(i => {
        const on = selected.includes(i)
        const taken = !on && isTaken(i)
        const off = taken || (!on && !radio && selected.length >= max)
        return (
          <label key={i} className={`dish pickable ${on ? 'on' : ''} ${off ? 'dis' : ''}`}>
            <input type={radio ? 'radio' : 'checkbox'} name={name} checked={on} disabled={off} onChange={() => onPick(i)} />
            <span className="tick" aria-hidden="true">{on ? '✓' : ''}</span>
            <span>{i}{taken && <small> (already on your menu)</small>}</span>
          </label>
        )
      })}
    </div>
  )
}
