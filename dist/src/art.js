import { CHARACTERS } from './data.js'

const fallbackCache = new Map()

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}

export function makePlaceholder(charId, kind = 'portrait') {
  const key = `${charId}-${kind}`
  if (fallbackCache.has(key)) return fallbackCache.get(key)
  const c = CHARACTERS[charId] || { name: 'Unknown', color: '#b47cff', accent: '#d9b978', title: 'Unbound' }
  const w = kind === 'portrait' ? 600 : 640
  const h = kind === 'portrait' ? 760 : 960
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const x = canvas.getContext('2d')
  const rgb = hexToRgb(c.color), rgb2 = hexToRgb(c.accent)
  const bg = x.createRadialGradient(w * .5, h * .35, 20, w * .5, h * .4, h * .7)
  bg.addColorStop(0, `rgba(${rgb},.25)`); bg.addColorStop(.5, 'rgba(14,9,20,.96)'); bg.addColorStop(1, '#06040a')
  x.fillStyle = bg; x.fillRect(0, 0, w, h)
  // arch
  x.strokeStyle = `rgba(${rgb2},.35)`; x.lineWidth = 2
  x.beginPath(); x.moveTo(w * .18, h * .88); x.lineTo(w * .18, h * .34)
  x.quadraticCurveTo(w * .18, h * .12, w * .5, h * .08)
  x.quadraticCurveTo(w * .82, h * .12, w * .82, h * .34)
  x.lineTo(w * .82, h * .88); x.stroke()
  x.strokeStyle = 'rgba(255,255,255,.05)'
  for (let i = 0; i < 8; i++) { x.beginPath(); x.moveTo(w * .5, h * .2); x.lineTo(w * (.12 + i * .11), h * .9); x.stroke() }
  // silhouette
  x.fillStyle = 'rgba(0,0,0,.6)'; x.strokeStyle = `rgba(${rgb},.55)`; x.lineWidth = 3
  x.beginPath()
  const cx = w / 2
  x.moveTo(cx, h * .2)
  x.bezierCurveTo(cx + w * .1, h * .2, cx + w * .12, h * .28, cx + w * .1, h * .34)
  x.bezierCurveTo(cx + w * .2, h * .42, cx + w * .22, h * .55, cx + w * .13, h * .66)
  x.lineTo(cx + w * .18, h * .9); x.lineTo(cx - w * .18, h * .9)
  x.lineTo(cx - w * .13, h * .66)
  x.bezierCurveTo(cx - w * .22, h * .55, cx - w * .2, h * .42, cx - w * .1, h * .34)
  x.bezierCurveTo(cx - w * .12, h * .28, cx - w * .1, h * .2, cx, h * .2)
  x.closePath(); x.fill(); x.stroke()
  // glyph
  x.fillStyle = `rgba(${rgb2},.9)`; x.font = `600 ${Math.round(w * .09)}px Georgia, serif`; x.textAlign = 'center'
  x.fillText((c.name || '?')[0], cx, h * .58)
  x.fillStyle = 'rgba(240,230,216,.8)'; x.font = `500 ${Math.round(w * .027)}px system-ui`; x.letterSpacing = '4px'
  x.fillText((c.name || 'Unbound').toUpperCase(), cx, h * .72)
  x.fillStyle = 'rgba(217,185,120,.6)'; x.font = `${Math.round(w * .022)}px Georgia, serif`
  x.fillText('ILLUSTRATION PENDING', cx, h * .76)
  x.strokeStyle = 'rgba(217,185,120,.3)'; x.lineWidth = 1
  x.strokeRect(16, 16, w - 32, h - 32)
  const url = canvas.toDataURL('image/png')
  fallbackCache.set(key, url)
  return url
}

export function setImage(img, charId, kind) {
  if (!img) return
  const c = CHARACTERS[charId]
  const src = kind === 'gallery' ? c?.gallery : kind === 'chibi' ? c?.chibi : c?.portrait
  img.onerror = () => {
    img.onerror = null
    img.src = makePlaceholder(charId, kind)
    img.classList.add('fallback')
  }
  img.src = src || makePlaceholder(charId, kind)
  return img
}

export function imageSrc(charId, kind) {
  const c = CHARACTERS[charId]
  return kind === 'gallery' ? c?.gallery : kind === 'chibi' ? c?.chibi : c?.portrait
}

export function placeholderDataURL(charId, kind) { return makePlaceholder(charId, kind) }
