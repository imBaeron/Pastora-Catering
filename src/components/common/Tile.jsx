import { pic } from '../../utils/placeholders'

// A photo with a caption on top. Used for events, food, and the gallery.
export default function Tile({ label, c, src, className = '' }) {
  return (
    <figure className={`tile ${className}`}>
      <img src={pic(label, c, src)} alt={label} loading="lazy" />
      <figcaption>{label}</figcaption>
    </figure>
  )
}
