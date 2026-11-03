// Placeholder photos. Replace ph(...) with paths from /public/images (e.g. '/images/carousel/lechon.jpg').
export const ph = (t, c) => 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="400" fill="${c}"/><text x="300" y="205" font-family="sans-serif" font-size="26" fill="#2B190D" text-anchor="middle">${t}</text></svg>`)
