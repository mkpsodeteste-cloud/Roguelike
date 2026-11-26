import sharp from 'sharp'
import { CHARS } from './common.mjs'

const OUT = 'assets/characters'

const eye = (c, x, y, flip = 1) => `<g transform="translate(${x} ${y}) scale(${flip} 1)">
  <ellipse cx="0" cy="0" rx="27" ry="31" fill="#fffaf4"/>
  <ellipse cx="0" cy="2" rx="22" ry="28" fill="url(#iris)"/>
  <ellipse cx="0" cy="-2" rx="20" ry="24" fill="${c.iris[2]}" opacity=".5"/>
  <ellipse cx="0" cy="0" rx="11" ry="15" fill="#180b22"/>
  <ellipse cx="-7" cy="-11" rx="7" ry="9" fill="#fff"/>
  <ellipse cx="7" cy="11" rx="4" ry="4" fill="#fff" opacity=".8"/>
  <path d="M -30 -12 C -20 -30 8 -34 29 -20" fill="none" stroke="#2a1020" stroke-width="7" stroke-linecap="round"/>
  <path d="M -28 20 C -10 32 16 30 29 16" fill="none" stroke="#5b2a44" stroke-width="2.4" opacity=".65"/>
  <path d="M -30 -10 C -40 -16 -48 -12 -54 -20" fill="none" stroke="#2a1020" stroke-width="5" stroke-linecap="round"/>
</g>`

const chibiDefs = c => `<defs>
  <radialGradient id="skin" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#fff1e8"/><stop offset=".7" stop-color="${c.skin[1]}"/><stop offset="1" stop-color="${c.skin[2]}"/></radialGradient>
  <linearGradient id="hair" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${c.hair[0]}"/><stop offset=".4" stop-color="${c.hair[1]}"/><stop offset=".8" stop-color="${c.hair[2]}"/><stop offset="1" stop-color="${c.hair[3]}"/></linearGradient>
  <linearGradient id="cloth" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="${c.cloth[0]}"/><stop offset=".5" stop-color="${c.cloth[1]}"/><stop offset="1" stop-color="${c.cloth[2]}"/></linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2c8"/><stop offset=".45" stop-color="${c.accent}"/><stop offset="1" stop-color="#8a6427"/></linearGradient>
  <radialGradient id="iris" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="${c.iris[0]}"/><stop offset=".5" stop-color="${c.iris[1]}"/><stop offset="1" stop-color="${c.iris[2]}"/></radialGradient>
  <radialGradient id="blush" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f3879d" stop-opacity=".55"/><stop offset="1" stop-color="#f3879d" stop-opacity="0"/></radialGradient>
  <filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>`

const headBase = (c, mouth = 'smile') => `
<g stroke="#2a1020" stroke-width="3">
  <path d="M 256 62 C 340 62 378 128 374 208 C 370 278 330 330 286 344 C 272 349 258 350 256 350 C 250 350 236 348 224 342 C 182 326 142 276 138 206 C 134 126 172 62 256 62 Z" fill="url(#skin)"/>
  <path d="M 138 204 C 128 232 138 258 154 262 C 166 264 174 250 170 234 C 166 218 154 204 138 204 Z" fill="url(#skin)"/>
  <path d="M 374 204 C 384 232 374 258 358 262 C 346 264 338 250 342 234 C 346 218 358 204 374 204 Z" fill="url(#skin)"/>
</g>
<ellipse cx="190" cy="252" rx="42" ry="20" fill="url(#blush)"/>
<ellipse cx="322" cy="252" rx="42" ry="20" fill="url(#blush)"/>
${eye(c, 210, 208, 1)}
${eye(c, 302, 208, -1)}
<path d="M 248 254 C 254 262 258 266 256 270 C 252 274 246 272 242 268" fill="none" stroke="${c.skin[2]}" stroke-width="3" stroke-linecap="round"/>
<g>
  <path d="M 234 298 C 246 290 254 292 256 296 C 260 292 268 290 280 296 C 268 310 246 310 234 298 Z" fill="#b2405f"/>
  <path d="M 238 302 C 250 312 266 312 276 302 C 266 318 248 318 238 302 Z" fill="#d76b82"/>
  <path d="M 244 305 C 250 309 262 309 268 305" fill="none" stroke="#ffd6dc" stroke-width="2.5" opacity=".7"/>
  ${mouth === 'smirk' ? `<path d="M 270 304 C 282 300 288 292 288 286" fill="none" stroke="#8f2c48" stroke-width="2.5" opacity=".8"/>` : ''}
</g>`

const hairFront = (c, variant) => {
  let extra = ''
  if (variant === 'seraphine') extra = `<g filter="url(#glow)"><ellipse cx="256" cy="36" rx="88" ry="20" fill="none" stroke="url(#gold)" stroke-width="7" stroke-dasharray="60 12 34 16"/><ellipse cx="256" cy="36" rx="88" ry="20" fill="none" stroke="#fff1b8" stroke-width="2"/></g>`
  if (variant === 'mirelle') extra = `<g fill="#1d0f1c" stroke="#6b3550" stroke-width="3">
    <path d="M 180 94 C 142 60 124 18 140 -18 C 164 14 186 44 206 70 C 196 80 188 88 180 94 Z"/>
    <path d="M 332 94 C 370 60 388 18 372 -18 C 348 14 326 44 306 70 C 316 80 324 88 332 94 Z"/>
  </g><g opacity=".65" fill="none" stroke="#ff9a5a" stroke-width="2"><path d="M 184 86 C 156 58 142 28 140 0"/><path d="M 328 86 C 356 58 370 28 372 0"/></g>`
  if (variant === 'ysolde') extra = `<g fill="url(#hair)" stroke="#0c2530" stroke-width="2">
    <path d="M 160 150 C 124 210 118 292 132 360 C 144 414 128 468 100 512 C 138 502 164 470 172 428 C 150 374 154 310 178 260 Z"/>
    <path d="M 168 220 C 140 280 140 350 158 404 C 146 350 150 288 176 238 Z" fill="#0a2530" opacity=".5"/>
  </g>`
  return `${extra}<g stroke="#2a1020" stroke-width="3">
    <path d="M 142 206 C 130 116 182 56 256 56 C 330 56 382 116 370 206 C 352 154 322 128 292 122 C 278 96 246 92 232 122 C 208 116 174 140 158 178 Z" fill="url(#hair)"/>
    <path d="M 152 164 C 144 230 148 300 166 350 C 154 290 154 224 168 176 Z" fill="url(#hair)"/>
    <path d="M 360 164 C 368 230 364 300 346 350 C 358 290 358 224 344 176 Z" fill="url(#hair)"/>
    <path d="M 188 122 C 206 98 234 92 256 98 C 278 92 306 98 324 122 C 304 114 278 116 256 126 C 234 116 208 114 188 122 Z" fill="${c.hair[0]}" opacity=".55" stroke="none"/>
    <g fill="url(#hair)" stroke-width="2">
      <path d="M 158 160 C 164 122 188 94 220 84 C 204 110 198 140 204 172 C 188 150 172 152 158 160 Z"/>
      <path d="M 208 94 C 226 110 236 138 240 176 C 228 150 214 132 196 120 Z"/>
      <path d="M 268 88 C 288 108 296 144 292 180 C 284 152 272 132 254 118 Z"/>
      <path d="M 354 160 C 348 122 324 94 292 84 C 308 110 314 140 308 172 C 324 150 340 152 354 160 Z"/>
    </g>
    <g fill="none" stroke="${c.hair[0]}" stroke-width="3.5" stroke-linecap="round" opacity=".75">
      <path d="M 166 198 C 160 258 166 312 180 344"/><path d="M 346 198 C 352 258 346 312 332 344"/>
      <path d="M 216 108 C 204 132 198 158 200 178"/><path d="M 296 108 C 308 132 314 158 312 178"/>
    </g>
  </g>`
}

const chibiBase = (c, variant, opts = {}) => {
  const { scale = 1, outfit = 'gown', weapon = false } = opts
  return `<g transform="translate(256 0) scale(${scale}) translate(-256 0)">
    <ellipse cx="256" cy="612" rx="104" ry="18" fill="#0a0610" opacity=".22"/>
    <g stroke="#2a1020" stroke-width="3">
      <path d="M 196 330 C 170 370 160 430 166 500 L 176 566 L 214 566 L 216 496 L 236 402 Z" fill="url(#skin)"/>
      <path d="M 316 330 C 342 370 352 430 346 500 L 336 566 L 298 566 L 296 496 L 276 402 Z" fill="url(#skin)"/>
      <path d="M 232 338 L 280 338 L 300 404 L 288 566 L 224 566 L 212 404 Z" fill="url(#cloth)"/>
      <path d="M 214 410 C 240 430 272 430 298 410 L 294 500 C 270 520 242 520 218 500 Z" fill="#ffffff" opacity=".06"/>
      <path d="M 176 566 L 226 566 L 228 606 L 166 606 C 160 594 166 578 176 566 Z" fill="${c.cloth[2]}"/>
      <path d="M 286 566 L 336 566 L 346 606 L 284 606 C 278 594 284 578 286 566 Z" fill="${c.cloth[2]}"/>
      <path d="M 214 414 C 240 434 272 434 298 414" fill="none" stroke="url(#gold)" stroke-width="4"/>
      <path d="M 220 476 C 244 496 268 496 292 476" fill="none" stroke="url(#gold)" stroke-width="3" opacity=".8"/>
      <path d="M 256 438 L 256 566" stroke="url(#gold)" stroke-width="2" opacity=".5"/>
    </g>
    <g>
      <path d="M 190 340 C 174 372 170 416 178 452 C 184 480 198 488 206 470 C 212 454 204 430 202 412 C 198 384 204 356 218 340 Z" fill="url(#cloth)" stroke="#2a1020" stroke-width="3"/>
      <path d="M 322 340 C 338 372 342 416 334 452 C 328 480 314 488 306 470 C 300 454 308 430 310 412 C 314 384 308 356 294 340 Z" fill="url(#cloth)" stroke="#2a1020" stroke-width="3"/>
      <circle cx="198" cy="470" r="16" fill="url(#skin)" stroke="#2a1020" stroke-width="2.5"/>
      <circle cx="314" cy="470" r="16" fill="url(#skin)" stroke="#2a1020" stroke-width="2.5"/>
    </g>
    <g>
      <path d="M 186 336 C 214 356 298 356 326 336 L 334 362 C 310 390 202 390 178 362 Z" fill="url(#cloth)" stroke="#2a1020" stroke-width="3"/>
      <path d="M 186 344 C 214 366 298 366 326 344" fill="none" stroke="url(#gold)" stroke-width="3"/>
      <path d="M 246 342 C 250 354 262 354 266 342" fill="none" stroke="url(#gold)" stroke-width="4"/>
      <circle cx="256" cy="356" r="7" fill="${c.gem}" stroke="#2a1020" stroke-width="2"/>
    </g>
    ${hairBackSimple(c, variant)}
    ${headBase(c, variant === 'mirelle' ? 'smirk' : 'smile')}
    ${hairFront(c, variant)}
    ${variant === 'seraphine' ? `<g><path d="M 212 372 C 212 398 222 416 236 424 L 244 408 C 232 400 226 384 228 368 Z" fill="#1a0d1f" stroke="#2a1020" stroke-width="2"/><path d="M 300 372 C 300 398 290 416 276 424 L 268 408 C 280 400 286 384 284 368 Z" fill="#1a0d1f" stroke="#2a1020" stroke-width="2"/></g>` : ''}
    ${variant === 'mirelle' ? `<g><path d="M 206 356 C 200 392 208 430 224 460 L 240 446 C 226 420 220 388 224 360 Z" fill="#2b0c1c" stroke="#2a1020" stroke-width="2"/><path d="M 306 356 C 312 392 304 430 288 460 L 272 446 C 286 420 292 388 288 360 Z" fill="#2b0c1c" stroke="#2a1020" stroke-width="2"/><circle cx="256" cy="390" r="10" fill="${c.gem}" stroke="#2a1020" stroke-width="2"/></g>` : ''}
    ${variant === 'ysolde' ? `<g><path d="M 320 350 L 348 584" stroke="#9aa9b4" stroke-width="7" stroke-linecap="round"/><path d="M 336 384 L 366 372" stroke="url(#gold)" stroke-width="6" stroke-linecap="round"/><circle cx="368" cy="370" r="7" fill="url(#gold)"/></g>` : ''}
    ${weapon ? `<g transform="rotate(-18 350 430)"><rect x="344" y="286" width="10" height="250" rx="5" fill="#a9b6c0" stroke="#2a1020" stroke-width="2"/><rect x="347" y="288" width="3" height="244" fill="#f2fbff" opacity=".8"/><path d="M 322 530 L 376 530 L 362 550 L 336 550 Z" fill="url(#gold)" stroke="#2a1020" stroke-width="2"/><rect x="338" y="524" width="22" height="12" rx="4" fill="#3b2030" stroke="#2a1020" stroke-width="2"/></g>` : ''}
  </g>`
}

const hairBackSimple = (c, variant) => {
  if (variant === 'mirelle') return `<path d="M 150 196 C 126 270 128 350 148 420 C 160 460 154 500 140 530 C 178 514 194 480 196 440 C 184 380 182 300 200 250 Z" fill="url(#hair)" stroke="#2a1020" stroke-width="3"/>
  <path d="M 362 196 C 386 270 384 350 364 420 C 352 460 358 500 372 530 C 334 514 318 480 316 440 C 328 380 330 300 312 250 Z" fill="url(#hair)" stroke="#2a1020" stroke-width="3"/>`
  if (variant === 'ysolde') return `<path d="M 140 180 C 118 280 120 390 136 470 C 146 520 140 550 124 570 C 162 556 180 520 182 474 C 164 390 166 280 188 220 Z" fill="url(#hair)" stroke="#2a1020" stroke-width="3"/>
  <path d="M 372 180 C 394 280 392 390 376 470 C 366 520 372 550 388 570 C 350 556 332 520 330 474 C 348 390 346 280 324 220 Z" fill="url(#hair)" stroke="#2a1020" stroke-width="3"/>`
  return `<path d="M 142 190 C 118 280 122 390 142 480 C 152 522 144 552 128 576 C 170 558 186 520 188 474 C 168 390 168 270 192 214 Z" fill="url(#hair)" stroke="#2a1020" stroke-width="3"/>
  <path d="M 370 190 C 394 280 390 390 370 480 C 360 522 368 552 384 576 C 342 558 326 520 324 474 C 344 390 344 270 320 214 Z" fill="url(#hair)" stroke="#2a1020" stroke-width="3"/>`
}

const SVGS = {
  seraphine: c => chibiDefs(c) + chibiBase(c, 'seraphine'),
  mirelle: c => chibiDefs(c) + chibiBase(c, 'mirelle'),
  ysolde: c => chibiDefs(c) + chibiBase(c, 'ysolde', { weapon: true }),
}

for (const key of Object.keys(CHARS)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="640" viewBox="0 0 512 640">${SVGS[key](CHARS[key])}</svg>`
  await sharp(Buffer.from(svg), { density: 144 }).resize(512, 640).png({ compressionLevel: 9 }).toFile(`${OUT}/${key}_chibi.png`)
  console.log('rendered', `${key}_chibi.png`)
}

// Vesper, the masked player character.
const vesper = `<defs>
  <radialGradient id="skin" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#f6e7df"/><stop offset="1" stop-color="#c79a99"/></radialGradient>
  <linearGradient id="cape" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#301b3e"/><stop offset=".5" stop-color="#1a0f24"/><stop offset="1" stop-color="#08050d"/></linearGradient>
  <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0f7ff"/><stop offset=".5" stop-color="#8ea3b8"/><stop offset="1" stop-color="#3b4b5e"/></linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0bd"/><stop offset=".5" stop-color="#d5ad61"/><stop offset="1" stop-color="#7d5922"/></linearGradient>
  <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<ellipse cx="256" cy="614" rx="100" ry="17" fill="#0a0610" opacity=".25"/>
<g stroke="#170c22" stroke-width="3">
  <path d="M 156 356 C 118 430 112 530 130 600 L 210 600 C 190 520 190 430 210 366 Z" fill="url(#cape)"/>
  <path d="M 356 356 C 394 430 400 530 382 600 L 302 600 C 322 520 322 430 302 366 Z" fill="url(#cape)"/>
  <path d="M 214 340 L 300 340 L 318 430 L 306 572 L 208 572 L 194 430 Z" fill="#1b1522"/>
  <path d="M 206 420 C 236 444 278 444 308 420 L 304 516 C 278 536 236 536 210 516 Z" fill="#2a2134"/>
  <path d="M 214 346 C 232 368 282 368 300 346 L 308 386 C 280 406 234 406 206 386 Z" fill="#3a2b49"/>
  <path d="M 206 574 L 256 574 L 260 610 L 194 610 C 188 598 194 584 206 574 Z" fill="#111019"/>
  <path d="M 256 574 L 306 574 L 318 610 L 252 610 C 246 598 252 584 256 574 Z" fill="#111019"/>
  <path d="M 164 380 C 140 420 138 470 150 500 L 176 492 C 166 462 168 424 182 396 Z" fill="#241732"/>
  <path d="M 348 380 C 372 420 374 470 362 500 L 336 492 C 346 462 344 424 330 396 Z" fill="#241732"/>
  <path d="M 238 300 C 248 320 264 320 274 300 L 288 318 C 274 340 238 340 224 318 Z" fill="#20122b"/>
</g>
<path d="M 150 470 C 190 520 322 520 362 470 L 350 540 C 320 578 192 578 162 540 Z" fill="#3a1626" opacity=".7"/>
<path d="M 160 474 C 200 522 312 522 352 474" fill="none" stroke="#a83251" stroke-width="5" opacity=".8"/>
<g>
  <path d="M 252 170 C 330 170 366 232 362 302 C 358 366 322 414 282 426 C 268 431 258 430 256 430 C 250 430 238 428 228 422 C 188 404 150 356 146 292 C 142 218 178 170 252 170 Z" fill="#140d1d" stroke="#170c22" stroke-width="3"/>
  <path d="M 252 182 C 318 182 350 236 347 298 C 344 352 314 394 280 406 C 268 410 258 410 256 410 C 248 410 238 408 230 402 C 196 386 162 344 158 288 C 154 222 186 182 252 182 Z" fill="#22182f"/>
  <path d="M 190 256 C 206 240 234 236 252 244 C 270 236 298 240 314 256 C 304 276 280 286 256 288 C 232 286 204 276 190 256 Z" fill="#09060e"/>
  <path d="M 206 256 C 218 248 238 248 248 258 C 238 268 218 268 206 256 Z" fill="#c58cff" filter="url(#glow)"/>
  <path d="M 264 258 C 274 248 294 248 306 256 C 294 268 274 268 264 258 Z" fill="#c58cff" filter="url(#glow)"/>
  <path d="M 218 300 C 236 312 276 312 294 300" fill="none" stroke="#5b3a68" stroke-width="4"/>
  <path d="M 206 330 C 226 350 286 350 306 330" fill="none" stroke="#6f4a7c" stroke-width="2" opacity=".7"/>
  <path d="M 250 170 C 258 132 276 108 304 100 C 288 122 282 146 286 170 Z" fill="#2a1638"/>
  <path d="M 300 104 C 318 92 336 96 346 110 C 328 110 312 120 302 136 Z" fill="#2a1638"/>
</g>
<g fill="none" stroke="url(#gold)" stroke-width="3">
  <path d="M 194 430 C 232 460 280 460 318 430"/>
  <path d="M 256 452 L 256 572"/>
</g>
<g transform="rotate(20 360 430)">
  <rect x="352" y="250" width="12" height="290" rx="6" fill="url(#steel)" stroke="#170c22" stroke-width="2.5"/>
  <rect x="356" y="254" width="3" height="280" fill="#fff" opacity=".8"/>
  <path d="M 330 534 L 386 534 L 372 558 L 344 558 Z" fill="url(#gold)" stroke="#170c22" stroke-width="2.5"/>
  <rect x="346" y="526" width="24" height="12" rx="4" fill="#3b2030" stroke="#170c22" stroke-width="2"/>
  <circle cx="358" cy="548" r="5" fill="#a83251"/>
</g>
<g transform="translate(168 430)"><circle cx="0" cy="0" r="26" fill="#241732" stroke="#170c22" stroke-width="3"/><circle cx="0" cy="0" r="10" fill="#c58cff" filter="url(#glow)"/><path d="M -20 18 L 20 -18" stroke="url(#gold)" stroke-width="3"/></g>`

await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="640" viewBox="0 0 512 640">${vesper}</svg>`), { density: 144 }).resize(512, 640).png({ compressionLevel: 9 }).toFile(`${OUT}/vesper_chibi.png`)
console.log('rendered vesper_chibi.png')
