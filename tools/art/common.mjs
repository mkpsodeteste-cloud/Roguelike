// Shared SVG art helpers for EMBERWAKE's original character illustrations.
import sharp from 'sharp'

export let seed = 920417
export const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296 }
export const R = (a, b) => a + rnd() * (b - a)
export const pick = a => a[Math.floor(rnd() * a.length)]

export const CHARS = {
  seraphine: {
    name: 'Seraphine Vale', title: 'The Fallen Saint',
    hair: ['#fbeeff', '#e3cff8', '#b797dd', '#76539f'], hairDark: '#4a2d66',
    skin: ['#fff3ec', '#f8d2c7', '#dca39e'], iris: ['#fae3ff', '#cf98ff', '#6232b8'],
    cloth: ['#4a1c3b', '#220f25', '#0b0710'], accent: '#e9cc8d', gem: '#e23a60',
    rim: '#b27bff', inner: '#c22e50', glow: '#b47cff',
  },
  mirelle: {
    name: 'Mirelle Nox', title: 'The Velvet Ember',
    hair: ['#ffc0b1', '#f07a80', '#b63454', '#701932'], hairDark: '#4a0d21',
    skin: ['#fff1e5', '#f6cab5', '#d79a8e'], iris: ['#fff0b8', '#ffb849', '#a94d0c'],
    cloth: ['#6a1837', '#370c1f', '#14050e'], accent: '#f4cc70', gem: '#31d5a1',
    rim: '#ff9466', inner: '#8a1738', glow: '#ff9a5a',
  },
  ysolde: {
    name: 'Ysolde of the Thorn', title: 'The Crimson Duelist',
    hair: ['#b9f2ee', '#61b4bb', '#236573', '#0d2f3b'], hairDark: '#08202b',
    skin: ['#fff1e8', '#f5ccc0', '#d79c96'], iris: ['#ffd9df', '#ff5d74', '#9e0f2a'],
    cloth: ['#263847', '#121d28', '#05090d'], accent: '#dfc486', gem: '#bb1c42',
    rim: '#5fe2db', inner: '#1f5d66', glow: '#62e3db',
  },
}

export const svgDefs = (c, bg = true) => `
<defs>
  ${bg ? `<radialGradient id="bg" cx="50%" cy="34%" r="82%">
    <stop offset="0" stop-color="#2b1839"/><stop offset=".42" stop-color="#150d21"/><stop offset="1" stop-color="#050409"/>
  </radialGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0d0815"/><stop offset="1" stop-color="#030207"/>
  </linearGradient>` : ''}
  <linearGradient id="hair" x1="0" y1="0" x2=".3" y2="1">
    <stop offset="0" stop-color="${c.hair[0]}"/><stop offset=".3" stop-color="${c.hair[1]}"/>
    <stop offset=".72" stop-color="${c.hair[2]}"/><stop offset="1" stop-color="${c.hair[3]}"/>
  </linearGradient>
  <linearGradient id="hairShade" x1="0" y1="0" x2="1" y2=".6">
    <stop offset="0" stop-color="${c.hair[3]}" stop-opacity=".0"/><stop offset=".55" stop-color="${c.hairDark}" stop-opacity=".7"/>
    <stop offset="1" stop-color="${c.hairDark}" stop-opacity=".15"/>
  </linearGradient>
  <linearGradient id="hairLight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${c.hair[0]}" stop-opacity=".95"/><stop offset="1" stop-color="${c.hair[0]}" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="skin" cx="42%" cy="32%" r="78%">
    <stop offset="0" stop-color="${c.skin[0]}"/><stop offset=".56" stop-color="${c.skin[1]}"/><stop offset="1" stop-color="${c.skin[2]}"/>
  </radialGradient>
  <radialGradient id="skinShade" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="${c.skin[2]}" stop-opacity=".75"/><stop offset="1" stop-color="${c.skin[2]}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="blush" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#f07f99" stop-opacity=".42"/><stop offset="1" stop-color="#f07f99" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="iris" cx="40%" cy="32%" r="72%">
    <stop offset="0" stop-color="${c.iris[0]}"/><stop offset=".48" stop-color="${c.iris[1]}"/><stop offset="1" stop-color="${c.iris[2]}"/>
  </radialGradient>
  <linearGradient id="cloth" x1="0" y1="0" x2=".65" y2="1">
    <stop offset="0" stop-color="${c.cloth[0]}"/><stop offset=".5" stop-color="${c.cloth[1]}"/><stop offset="1" stop-color="${c.cloth[2]}"/>
  </linearGradient>
  <linearGradient id="cloth2" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c.inner}"/><stop offset="1" stop-color="${c.cloth[2]}"/>
  </linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff2c8"/><stop offset=".35" stop-color="${c.accent}"/><stop offset=".7" stop-color="#8b6528"/><stop offset="1" stop-color="#f7e1a2"/>
  </linearGradient>
  <linearGradient id="gem" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".25" stop-color="${c.gem}"/><stop offset="1" stop-color="#3d0620"/>
  </linearGradient>
  <linearGradient id="lips" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#c4546d"/><stop offset=".55" stop-color="#a93654"/><stop offset="1" stop-color="#7f203d"/>
  </linearGradient>
  <linearGradient id="glassA" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c.rim}" stop-opacity=".55"/><stop offset="1" stop-color="#3b1450" stop-opacity=".15"/>
  </linearGradient>
  <linearGradient id="glassB" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${c.gem}" stop-opacity=".55"/><stop offset="1" stop-color="#220b36" stop-opacity=".12"/>
  </linearGradient>
  <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="glowS" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>
  <filter id="soft8"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="7" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope=".055"/></feComponentTransfer>
  </filter>
  <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${c.rim}" stop-opacity=".22"/><stop offset="1" stop-color="${c.rim}" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="vignette" cx="50%" cy="44%" r="71%">
    <stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset=".82" stop-color="#020106" stop-opacity=".45"/>
    <stop offset="1" stop-color="#020106" stop-opacity=".93"/>
  </radialGradient>
  <clipPath id="eyeClip"><path d="M -34 1 C -27 -17 -8 -24 12 -19 C 26 -15 34 -6 35 2 C 26 15 7 20 -10 16 C -24 13 -32 8 -34 1 Z"/></clipPath>
</defs>`

const candle = (x, y, s = 1) => `
<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-4" y="0" width="8" height="34" rx="3" fill="#c9b38d" opacity=".7"/>
  <ellipse cx="0" cy="-3" rx="5" ry="9" fill="#ffb15c" filter="url(#glowS)"/>
  <ellipse cx="0" cy="-5" rx="2.5" ry="6" fill="#fff3c4"/>
  <ellipse cx="0" cy="36" rx="22" ry="5" fill="#000" opacity=".25" filter="url(#soft8)"/>
</g>`

const archWindow = (c, cx, top, w, h, opacity = 1) => {
  const x1 = cx - w / 2, x2 = cx + w / 2, spring = top + h * .38
  const path = `M ${x1} ${top + h} L ${x1} ${spring} Q ${x1} ${top} ${cx} ${top} Q ${x2} ${top} ${x2} ${spring} L ${x2} ${top + h} Z`
  return `<g opacity="${opacity}">
    <path d="${path}" fill="#0a0712"/>
    <path d="${path}" fill="url(#glassA)" opacity=".9"/>
    <path d="M ${x1 + 16} ${top + h} L ${x1 + 16} ${spring} Q ${x1 + 16} ${top + 18} ${cx} ${top + 18} Q ${x2 - 16} ${top + 18} ${x2 - 16} ${spring} L ${x2 - 16} ${top + h} Z" fill="#150b25" opacity=".55"/>
    <g stroke="#3a2450" stroke-width="3" opacity=".8" fill="none">
      <path d="${path}"/>
      <path d="M ${cx} ${top + 12} L ${cx} ${top + h}"/>
      <path d="M ${x1 + 12} ${spring} L ${x2 - 12} ${spring}"/>
      <path d="M ${x1 + 12} ${spring + (top + h - spring) * .33} L ${x2 - 12} ${spring + (top + h - spring) * .33}"/>
      <path d="M ${x1 + 12} ${spring + (top + h - spring) * .66} L ${x2 - 12} ${spring + (top + h - spring) * .66}"/>
      <path d="M ${x1 + 12} ${spring} L ${cx - w * .22} ${top + 18}"/>
      <path d="M ${x2 - 12} ${spring} L ${cx + w * .22} ${top + 18}"/>
    </g>
    <path d="M ${cx - w * .35} ${top + h} L ${cx - w * .12} ${top + 30} L ${cx + w * .06} ${top + 30} L ${cx - w * .12} ${top + h} Z" fill="url(#ray)" opacity=".8"/>
    <circle cx="${cx}" cy="${top + h * .2}" r="${w * .17}" fill="none" stroke="${c.accent}" stroke-width="2" opacity=".35"/>
    <circle cx="${cx}" cy="${top + h * .2}" r="${w * .1}" fill="none" stroke="${c.accent}" stroke-width="1.5" opacity=".3"/>
  </g>`
}

const candlesRow = c => `
<g opacity=".85">
  ${candle(120, 1040, 1.1)}${candle(170, 1000, .8)}${candle(860, 1030, 1.2)}${candle(815, 990, .75)}
  ${candle(300, 1070, .7)}${candle(700, 1080, .7)}
</g>`

const dust = (w, h, n) => {
  let out = ''
  for (let i = 0; i < n; i++) out += `<circle cx="${R(0, w).toFixed(1)}" cy="${R(0, h).toFixed(1)}" r="${R(.6, 2.4).toFixed(1)}" fill="#ffe6c9" opacity="${R(.08, .5).toFixed(2)}"/>`
  return out
}

export const portraitBg = c => `
<rect width="1000" height="1250" fill="url(#bg)"/>
<g opacity=".9">
  ${archWindow(c, 250, 60, 250, 980, .75)}
  ${archWindow(c, 755, 100, 210, 920, .55)}
  <path d="M 0 0 L 96 0 L 96 1120 L 0 1180 Z" fill="#0a0711"/>
  <path d="M 1000 0 L 904 0 L 904 1120 L 1000 1180 Z" fill="#0a0711"/>
  <path d="M 80 0 L 112 0 L 100 900 Q 96 1050 60 1180 L 30 1180 Q 66 1030 72 900 Z" fill="#1c1129" opacity=".9"/>
  <path d="M 920 0 L 888 0 L 900 900 Q 904 1050 940 1180 L 970 1180 Q 934 1030 928 900 Z" fill="#1c1129" opacity=".9"/>
  <circle cx="500" cy="330" r="190" fill="url(#glassB)" opacity=".22" filter="url(#soft)"/>
  <circle cx="500" cy="330" r="150" fill="none" stroke="#2b1838" stroke-width="4" opacity=".7"/>
  <circle cx="500" cy="330" r="102" fill="none" stroke="#2b1838" stroke-width="3" opacity=".6"/>
  <g stroke="${c.accent}" stroke-width="1.5" opacity=".2">
    <path d="M 500 180 L 500 480 M 350 330 L 650 330 M 394 224 L 606 436 M 606 224 L 394 436"/>
  </g>
</g>
<rect y="1010" width="1000" height="240" fill="url(#floor)"/>
<path d="M 0 1010 L 1000 1010" stroke="${c.accent}" stroke-width="1" opacity=".2"/>
<g opacity=".32" filter="url(#soft)">
  <path d="M 300 1010 L 420 1250 L 700 1250 L 560 1010 Z" fill="${c.rim}"/>
  <path d="M 660 1010 L 740 1250 L 860 1250 L 760 1010 Z" fill="${c.gem}"/>
</g>
${candlesRow(c)}
<g opacity=".16">
  <path d="M 500 40 L 270 1250 L 450 1250 Z" fill="url(#ray)"/>
  <path d="M 540 40 L 610 1250 L 760 1250 Z" fill="url(#ray)"/>
</g>
${dust(1000, 1100, 60)}
<rect width="1000" height="1250" fill="url(#vignette)"/>
<rect width="1000" height="1250" filter="url(#grain)" opacity=".6"/>`

export const galleryBg = c => `
<rect width="1000" height="1500" fill="url(#bg)"/>
<g opacity=".95">
  ${archWindow(c, 500, 40, 520, 1050, .8)}
  ${archWindow(c, 150, 240, 190, 760, .38)}
  ${archWindow(c, 850, 240, 190, 760, .38)}
  <path d="M 0 0 L 110 0 L 110 1270 L 0 1330 Z" fill="#090610"/>
  <path d="M 1000 0 L 890 0 L 890 1270 L 1000 1330 Z" fill="#090610"/>
  <path d="M 86 0 L 124 0 L 112 1050 Q 108 1220 64 1390 L 28 1390 Q 74 1210 82 1050 Z" fill="#1d122a"/>
  <path d="M 914 0 L 876 0 L 888 1050 Q 892 1220 936 1390 L 972 1390 Q 926 1210 918 1050 Z" fill="#1d122a"/>
  <circle cx="500" cy="300" r="235" fill="url(#glassB)" opacity=".25" filter="url(#soft)"/>
  <circle cx="500" cy="300" r="185" fill="none" stroke="#321c44" stroke-width="5"/>
  <circle cx="500" cy="300" r="128" fill="none" stroke="#321c44" stroke-width="3"/>
  <g stroke="${c.accent}" stroke-width="1.4" opacity=".22">
    <path d="M 500 120 L 500 480 M 315 300 L 685 300 M 368 168 L 632 432 M 632 168 L 368 432"/>
  </g>
</g>
<rect y="1260" width="1000" height="240" fill="url(#floor)"/>
<path d="M 0 1260 L 1000 1260" stroke="${c.accent}" stroke-width="1" opacity=".25"/>
<g opacity=".35" filter="url(#soft)">
  <ellipse cx="500" cy="1350" rx="280" ry="60" fill="${c.rim}"/>
  <path d="M 260 1260 L 360 1500 L 640 1500 L 740 1260 Z" fill="${c.gem}" opacity=".6"/>
</g>
${candlesRow(c).replaceAll('1040', '1210').replaceAll('1000', '1170').replaceAll('1030', '1200').replaceAll('990', '1160').replaceAll('1070', '1240').replaceAll('1080', '1250')}
<g opacity=".2">
  <path d="M 500 20 L 220 1500 L 420 1500 Z" fill="url(#ray)"/>
  <path d="M 560 20 L 650 1500 L 820 1500 Z" fill="url(#ray)"/>
</g>
${dust(1000, 1350, 80)}
<rect width="1000" height="1500" fill="url(#vignette)"/>
<rect width="1000" height="1500" filter="url(#grain)" opacity=".6"/>`

export const hairBack = c => {
  let braid = ''
  if (c === CHARS.ysolde) {
    braid = `<g fill="url(#hair)" stroke="${c.hairDark}" stroke-width="1">
      <path d="M -150 140 C -190 190 -200 250 -178 302 C -154 358 -186 410 -218 448 C -180 438 -148 410 -134 370 C -158 326 -150 280 -124 244 Z" opacity=".95"/>
      ${[0, 1, 2, 3, 4].map(i => `<path d="M ${-188 + i * 4} ${225 + i * 46} q 30 18 58 -2" fill="none" stroke="${c.hairDark}" stroke-width="3" opacity=".7"/>`).join('')}
    </g>`
  }
  return `<g>
    <path d="M 0 -172 C -104 -174 -165 -110 -166 -16 C -168 62 -142 122 -154 202 C -164 266 -196 318 -232 362 C -150 348 -106 298 -80 244 C -52 288 -26 312 0 322 C 26 312 52 288 80 244 C 106 298 150 348 232 362 C 196 318 164 266 154 202 C 142 122 168 62 166 -16 C 165 -110 104 -174 0 -172 Z" fill="url(#hair)"/>
    <path d="M 0 -160 C -88 -160 -146 -104 -148 -18 C -150 60 -126 126 -138 200 C -146 250 -168 296 -196 330 C -128 310 -94 268 -72 224 C -46 266 -22 288 0 296 C 22 288 46 266 72 224 C 94 268 128 310 196 330 C 168 296 146 250 138 200 C 126 126 150 60 148 -18 C 146 -104 88 -160 0 -160 Z" fill="url(#hairShade)" opacity=".65"/>
    ${braid}
    <g fill="none" stroke="url(#hairLight)" stroke-width="5" stroke-linecap="round" opacity=".8">
      <path d="M -126 -58 C -164 20 -150 104 -162 188"/>
      <path d="M 132 -50 C 160 28 148 108 158 190"/>
      <path d="M -104 -128 C -142 -92 -152 -36 -148 12"/>
      <path d="M 108 -134 C 146 -94 154 -34 150 16"/>
    </g>
  </g>`
}

const eye = (c, x, mirror, open = 1) => `<g transform="translate(${x} -2) scale(${mirror} ${open})">
  <path d="M -35 0 C -30 -14 -12 -22 9 -20 C 25 -18 34 -10 36 1 C 26 11 8 15 -10 12 C -24 10 -32 5 -35 0 Z" fill="#f7ecef"/>
  <g clip-path="url(#eyeClip)">
    <circle cx="1" cy="-3" r="19" fill="url(#iris)"/>
    <circle cx="1" cy="-3" r="13" fill="${c.iris[2]}" opacity=".5"/>
    <circle cx="1" cy="-1" r="7.2" fill="#160b20"/>
    <circle cx="1" cy="0" r="4" fill="#06030b"/>
    <ellipse cx="1" cy="10" rx="13" ry="4" fill="${c.iris[0]}" opacity=".45"/>
    <circle cx="8" cy="-11" r="5.4" fill="#fff" opacity=".95"/>
    <circle cx="-7" cy="5" r="2.4" fill="#fff" opacity=".7"/>
    <circle cx="14" cy="5" r="1.8" fill="${c.iris[0]}" opacity=".8"/>
    <path d="M -18 -15 C -8 -23 8 -24 22 -16" fill="none" stroke="#2a0c20" stroke-width="4.5" opacity=".35"/>
  </g>
  <path d="M -36 -1 C -29 -16 -10 -23 10 -21 C 26 -19 35 -11 37 0" fill="none" stroke="#2b0f25" stroke-width="5.4" stroke-linecap="round"/>
  <path d="M -34 2 C -25 12 -7 17 12 14 C 25 12 33 6 37 1" fill="none" stroke="#4a2038" stroke-width="1.5" opacity=".7"/>
  <path d="M -36 0 C -46 -5 -53 -1 -60 -8 C -51 4 -44 8 -34 9 Z" fill="#1f0919"/>
  <path d="M -18 -19 L -24 -28 M -7 -21 L -10 -30" stroke="#1f0919" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M -36 -6 C -22 -14 0 -17 24 -11 C 12 -18 -12 -20 -36 -6 Z" fill="${c.iris[2]}" opacity=".22"/>
</g>`

const headFeatures = (c, variant) => {
  const browLift = variant === 'smile' ? -3 : 0
  return `
  <g>
    <path d="M 0 -142 C 78 -142 110 -84 108 -20 C 106 32 88 72 56 100 C 36 118 17 126 0 126 C -17 126 -36 118 -56 100 C -88 72 -106 32 -108 -20 C -110 -84 -78 -142 0 -142 Z" fill="url(#skin)"/>
    <path d="M -111 -8 C -126 -16 -136 4 -132 32 C -128 58 -110 66 -101 48 C -95 34 -98 8 -111 -8 Z" fill="url(#skin)"/>
    <path d="M 111 -8 C 126 -16 136 4 132 32 C 128 58 110 66 101 48 C 95 34 98 8 111 -8 Z" fill="url(#skin)"/>
    <path d="M -90 62 C -70 108 -38 130 0 132 C 38 130 70 108 90 62 C 74 110 44 134 0 136 C -44 134 -74 110 -90 62 Z" fill="url(#skinShade)" opacity=".5"/>
    <ellipse cx="-66" cy="48" rx="54" ry="30" fill="url(#blush)"/>
    <ellipse cx="66" cy="48" rx="54" ry="30" fill="url(#blush)"/>
    <g transform="translate(0 ${browLift})">
      <path d="M -74 -50 C -62 -57 -42 -57 -28 -51" fill="none" stroke="${c.hairDark}" stroke-width="4.4" stroke-linecap="round"/>
      <path d="M 74 -48 C 62 -56 42 -56 28 -50" fill="none" stroke="${c.hairDark}" stroke-width="4.4" stroke-linecap="round"/>
    </g>
    <path d="M -84 -28 C -62 -34 -37 -33 -24 -26 M 84 -26 C 62 -33 37 -32 24 -25" fill="none" stroke="${c.iris[2]}" stroke-width="2.2" opacity=".2"/>
    ${eye(c, -44, 1)}
    ${eye(c, 44, -1)}
    <path d="M 1 22 C 4 30 5 36 2 41 C 0 44 -4 45 -7 44" fill="none" stroke="${c.skin[2]}" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>
    <ellipse cx="4" cy="40" rx="3" ry="1.6" fill="#fff" opacity=".35"/>
    <g>
      <path d="M -27 73 C -16 64 -5 63 0 68 C 5 63 16 63 27 72 C 17 80 8 82 0 82 C -8 82 -17 80 -27 73 Z" fill="url(#lips)"/>
      <path d="M -26 75 C -14 83 10 85 26 77 C 17 92 -5 94 -26 75 Z" fill="url(#lips)"/>
      <path d="M -15 76 C -7 79 7 80 16 76 C 7 83 -5 83 -15 76 Z" fill="#f6b6c1" opacity=".5"/>
      <path d="M -12 87 C -1 91 9 91 18 86" fill="none" stroke="#6e2038" stroke-width="1.3" opacity=".45"/>
      <path d="M -27 72 C -18 69 -8 70 -2 73 M 27 71 C 18 68 8 69 2 72" fill="none" stroke="#e9a0ad" stroke-width="1.2" opacity=".5"/>
    </g>
    <g opacity=".35">
      <path d="M -32 -112 C -20 -128 18 -130 32 -112" fill="none" stroke="#fff" stroke-width="2"/>
      <path d="M -72 10 C -54 4 -30 8 -18 21" fill="none" stroke="${c.hairDark}" stroke-width="2" opacity=".45"/>
    </g>
    <g transform="translate(-112 35)"><path d="M 0 0 L 2 26 L 8 34 L 14 26 L 16 0 Z" fill="url(#gem)"/><circle cx="8" cy="6" r="4" fill="url(#gold)"/></g>
    <g transform="translate(112 35)"><path d="M 0 0 L 2 26 L 8 34 L 14 26 L 16 0 Z" fill="url(#gem)"/><circle cx="8" cy="6" r="4" fill="url(#gold)"/></g>
  </g>`
}

export const headFront = c => {
  let horns = '', halo = ''
  if (c === CHARS.mirelle) {
    horns = `<g fill="#1d0f1c" stroke="#5c2b44" stroke-width="2">
      <path d="M -86 -118 C -132 -155 -158 -206 -142 -258 C -112 -218 -88 -180 -64 -150 C -76 -132 -82 -120 -86 -118 Z"/>
      <path d="M 86 -118 C 132 -155 158 -206 142 -258 C 112 -218 88 -180 64 -150 C 76 -132 82 -120 86 -118 Z"/>
      <path d="M -126 -194 C -142 -218 -146 -238 -142 -258 C -126 -236 -110 -214 -98 -192 Z" fill="#6d3550" opacity=".6"/>
      <path d="M 126 -194 C 142 -218 146 -238 142 -258 C 126 -236 110 -214 98 -192 Z" fill="#6d3550" opacity=".6"/>
    </g>
    <g opacity=".6" fill="none" stroke="#ff9a5a" stroke-width="1.4">
      <path d="M -80 -126 C -116 -160 -136 -200 -136 -238"/>
      <path d="M 80 -126 C 116 -160 136 -200 136 -238"/>
    </g>`
  }
  if (c === CHARS.seraphine) {
    halo = `<g filter="url(#glow)" opacity=".9">
      <ellipse cx="0" cy="-192" rx="104" ry="27" fill="none" stroke="url(#gold)" stroke-width="9" stroke-dasharray="78 16 42 22 110 20"/>
      <ellipse cx="0" cy="-192" rx="104" ry="27" fill="none" stroke="#fff0b8" stroke-width="2" opacity=".8"/>
      <path d="M -86 -198 L -78 -224 L -68 -200" fill="url(#gold)" opacity=".8"/>
      <path d="M 60 -206 L 68 -230 L 78 -204" fill="url(#gold)" opacity=".7"/>
    </g>`
  }
  return `<g>
    ${halo}${horns}
    ${headFeatures(c, 'smile')}
    <path d="M -112 -22 C -126 -104 -72 -158 0 -162 C 72 -158 126 -104 112 -22 C 100 -76 74 -105 46 -111 C 30 -142 -2 -152 -20 -122 C -40 -142 -76 -132 -86 -96 C -98 -112 -106 -78 -112 -22 Z" fill="url(#hair)"/>
    <g fill="url(#hair)">
      <path d="M -112 -58 C -108 -112 -82 -146 -42 -158 C -58 -124 -60 -92 -46 -51 C -70 -82 -96 -74 -112 -58 Z"/>
      <path d="M -70 -150 C -42 -130 -24 -96 -16 -48 C -34 -80 -54 -104 -82 -122 Z"/>
      <path d="M 10 -158 C 30 -128 34 -86 24 -36 C 14 -76 0 -110 -22 -138 Z"/>
      <path d="M 68 -146 C 100 -124 110 -90 113 -50 C 94 -84 72 -104 46 -118 Z"/>
      <path d="M 34 -150 C 52 -118 56 -80 46 -54 C 54 -96 60 -122 74 -142 Z" opacity=".85"/>
      <path d="M -96 -58 C -106 -24 -104 18 -92 58 C -82 20 -80 -18 -86 -50 Z"/>
      <path d="M 94 -60 C 106 -24 104 18 92 60 C 82 22 80 -16 86 -48 Z"/>
    </g>
    <g fill="none" stroke="url(#hairLight)" stroke-width="3" stroke-linecap="round" opacity=".7">
      <path d="M -84 -142 C -54 -120 -34 -84 -24 -52"/>
      <path d="M -2 -154 C 18 -118 18 -78 8 -44"/>
      <path d="M 70 -140 C 94 -114 100 -80 102 -54"/>
      <path d="M -52 -151 C -30 -130 -18 -100 -12 -68"/>
    </g>
    <path d="M -112 -22 C -130 36 -120 102 -88 142 C -104 78 -104 14 -92 -24 Z" fill="url(#hair)"/>
    <path d="M 112 -22 C 130 36 120 102 88 142 C 104 78 104 14 92 -24 Z" fill="url(#hair)"/>
    <path d="M -74 -104 C -52 -134 -16 -146 8 -130 C -18 -120 -44 -100 -58 -74 C -64 -86 -70 -96 -74 -104 Z" fill="${c.hair[0]}" opacity=".55"/>
    <path d="M 86 -60 C 108 0 104 62 86 112 C 74 62 72 4 78 -42 Z" fill="${c.hairDark}" opacity=".25"/>
    <g fill="none" stroke="url(#hairLight)" stroke-width="4" stroke-linecap="round" opacity=".9">
      <path d="M -92 -60 C -104 0 -98 60 -84 108"/>
      <path d="M 94 -58 C 104 0 100 56 86 104"/>
      <path d="M -46 -120 C -30 -138 -6 -142 12 -132"/>
      <path d="M 30 -130 C 52 -134 74 -120 84 -100"/>
    </g>
  </g>`
}

export const portraitFigure = (c, body) => `
<g>
  ${hairBack(c)}
  ${body}
  ${headFront(c)}
</g>`

export async function render(svg, file, w, h) {
  await sharp(Buffer.from(svg), { density: 144 })
    .resize(w, h, { fit: 'fill' })
    .png({ compressionLevel: 9, quality: 95 })
    .toFile(`${'assets/characters'}/${file}`)
  console.log('rendered', file)
}

export const crown = (c, x = 0, y = 0) => `<g transform="translate(${x} ${y})" fill="url(#gold)" stroke="#6e4c1c" stroke-width="1">
  <path d="M -28 0 L -20 -20 L -8 -6 L 0 -26 L 8 -6 L 20 -20 L 28 0 Z"/>
  <circle cx="0" cy="-24" r="3" fill="${c.gem}"/>
</g>`
