// EMBERWAKE — a gothic courtship roguelike.
// Game loop, procedural chambers, combat, hub, dialogue, shop, and gallery.

import * as THREE from 'three'
import { World, clamp, TAU } from './world.js'
import {
  CHARACTERS, CHARACTER_ORDER, BOONS, BOON_MAP, PERKS, PERK_MAP,
  ROOM_NAMES, DEPTH_NAMES, ENEMY_LORE, SHOP_QUOTES, FLAVOR_QUOTES,
} from './data.js'
import {
  loadSave, getSave, commit, bondLevel, bondGain, bondTitle, perkLevel,
  perkCost, addCinders, recordRun, markSeen, hasSeen,
} from './save.js'
import { AudioEngine } from './audio.js'
import { setImage } from './art.js'

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

const $ = id => document.getElementById(id)
const $$ = sel => [...document.querySelectorAll(sel)]
const dom = {
  canvas: $('game'), loading: $('loading'),
  hud: $('hud'), hudPortrait: $('hud-portrait-img'), hudName: $('hud-name'),
  hpFill: $('hp-fill'), hpText: $('hp-text'), manaFill: $('mana-fill'), manaText: $('mana-text'),
  depthLabel: $('depth-label'), roomObjective: $('room-objective'),
  runEmbers: $('run-embers'), metaCinders: $('meta-cinders'), btnPause: $('btn-pause'),
  bossWrap: $('boss-wrap'), bossName: $('boss-name'), bossPhase: $('boss-phase'), bossFill: $('boss-fill'),
  prompt: $('interact-prompt'), promptText: $('interact-text'),
  boonRail: $('boon-rail'), bondRail: $('bond-rail'),
  cdMelee: $('cd-melee'), cdRanged: $('cd-ranged'), cdDash: $('cd-dash'),
  abMelee: $('ab-melee'), abRanged: $('ab-ranged'), abDash: $('ab-dash'),
  titlePortraits: $('title-portraits'), titleRecord: $('title-record'), titleContinue: $('title-continue-label'),
  hubCinders: $('hub-cinders'), hubDepth: $('hub-depth'), hubBonds: $('hub-bonds'), hubObjective: $('hub-objective-text'),
  dialoguePortrait: $('dialogue-portrait'), portraitAura: $('portrait-aura'),
  dialogueTitle: $('dialogue-title'), dialogueName: $('dialogue-name'), dialogueBond: $('dialogue-bond'),
  dialogueSpeaker: $('dialogue-speaker'), dialogueText: $('dialogue-text'), dialogueChoices: $('dialogue-choices'),
  dialogueNote: $('dialogue-affection-note'), dialogueClose: $('dialogue-close'),
  galleryRail: $('gallery-rail'), galleryArt: $('gallery-art'), artFrame: $('art-frame'),
  artLockText: $('art-lock-text'), artCaption: $('art-caption'), galleryTitle: $('gallery-title'),
  galleryName: $('gallery-name'), galleryQuote: $('gallery-quote'), galleryLore: $('gallery-lore'),
  galleryBondLabel: $('gallery-bond-label'), galleryStatus: $('gallery-status'),
  galleryMemory: $('gallery-memory'), galleryExpand: $('gallery-expand'),
  artModal: $('art-modal'), artModalImg: $('art-modal-img'), artModalCap: $('art-modal-cap'),
  shopPortrait: $('shop-portrait'), shopSpeech: $('shop-speech-text'), shopEyebrow: $('shop-eyebrow'),
  shopTitle: $('shop-title'), shopCurrency: $('shop-currency'), shopCurrencyLabel: $('shop-currency-label'),
  shopSub: $('shop-sub'), shopGrid: $('shop-grid'), shopFootNote: $('shop-foot-note'),
  boonsEyebrow: $('boons-eyebrow'), boonsTitle: $('boons-title'), boonsSub: $('boons-sub'),
  boonCards: $('boon-cards'), skipBoons: $('skip-boons'),
  pauseStats: $('pause-stats'), resultEyebrow: $('result-eyebrow'), resultTitle: $('result-title'),
  resultText: $('result-text'), resultStats: $('result-stats'),
  toasts: $('toasts'), touchUI: $('touch-ui'), joystick: $('joystick'), stick: $('joystick')?.querySelector('.stick'),
}

const screens = $$('.screen')
const isTouch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
const audio = new AudioEngine()
const world = new World(dom.canvas)

const RUN_ROOMS = 5
const BOSS_ROOM = 5
const START_MANA = 100
const BOLT_COST = 10
const F = { x: -Math.SQRT1_2, z: -Math.SQRT1_2 }
const R = { x: Math.SQRT1_2, z: -Math.SQRT1_2 }

const state = {
  mode: 'title',
  overlay: null,
  overlayReturn: null,
  baseScreen: 'screen-title',
  keys: new Set(),
  pointer: { x: innerWidth / 2, y: innerHeight / 2, active: false },
  touch: { x: 0, y: 0, id: null },
  player: null,
  playerVisual: null,
  run: null,
  enemies: [],
  projectiles: [],
  pickups: [],
  interactables: [],
  near: null,
  dialogue: null,
  galleryChar: 0,
  boonChoices: [],
  boonAfter: null,
  shopContext: 'hub',
  shopOffering: [],
  enemySeq: 0,
  elapsed: 0,
  tensionClock: 0,
  lastTime: performance.now(),
  started: false,
}

const hurtFlash = document.createElement('div')
hurtFlash.style.cssText = 'position:fixed;inset:0;z-index:18;pointer-events:none;opacity:0;transition:opacity .32s ease;background:radial-gradient(ellipse at 50% 55%,transparent 38%,rgba(190,20,55,.55) 100%)'
document.body.appendChild(hurtFlash)

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function showOnly(id) {
  for (const s of screens) s.classList.toggle('active', s.id === id)
}
function showScreen(id) {
  state.overlay = id
  showOnly(id)
  hidePrompt()
  updateChrome()
}
function openOverlay(id) {
  state.overlayReturn = state.overlay || state.baseScreen || null
  state.overlay = id
  showOnly(id)
  hidePrompt()
  updateChrome()
  audio.click()
}
function closeOverlay() {
  const ret = state.overlayReturn
  state.overlay = ret && ret !== state.baseScreen ? ret : null
  state.overlayReturn = null
  showOnly(state.overlay || state.baseScreen || null)
  hidePrompt()
  updateChrome()
  audio.back()
  if (state.overlay === 'screen-pause') renderPause()
  if (!state.overlay && state.mode === 'hub') renderHub()
}
function toggleScreen(screen, show) {
  const el = typeof screen === 'string' ? $(screen) : screen
  if (el) el.classList.toggle('hidden', !show)
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function sample(arr, n) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, n)
}
function dist(ax, az, bx, bz) { return Math.hypot(ax - bx, az - bz) }
function angleDiff(a, b) {
  let d = (a - b) % TAU
  if (d > Math.PI) d -= TAU
  if (d < -Math.PI) d += TAU
  return d
}
function fmt(n) { return Math.max(0, Math.round(n)).toLocaleString('en-US') }
function shake(amount) {
  if (getSave().settings.shake) world.shake(amount)
}
function toast(title, msg = '', kind = '') {
  const el = document.createElement('div')
  el.className = `toast ${kind}`
  el.innerHTML = `<b>${title}</b>${msg ? `<span>${msg}</span>` : ''}`
  dom.toasts.appendChild(el)
  while (dom.toasts.children.length > 4) dom.toasts.firstElementChild.remove()
  setTimeout(() => el.remove(), 4200)
}
function brushFlash() {
  hurtFlash.style.transition = 'opacity .05s'
  hurtFlash.style.opacity = '.8'
  requestAnimationFrame(() => {
    hurtFlash.style.transition = 'opacity .5s ease'
    hurtFlash.style.opacity = '0'
  })
}
function hidePrompt() {
  if (dom.prompt) dom.prompt.classList.add('hidden')
}
function setPrompt(text) {
  if (!dom.prompt) return
  dom.promptText.textContent = text
  dom.prompt.classList.remove('hidden')
}

// ---------------------------------------------------------------------------
// Save-derived progression
// ---------------------------------------------------------------------------

function applyEffects(stats, e, mult = 1) {
  if (!e) return
  stats.maxHp += (e.maxHp || 0) * mult
  stats.maxMana += (e.maxMana || 0) * mult
  stats.speed *= 1 + (e.speed || 0) * mult
  stats.meleeDmg *= 1 + (e.meleeDmg || 0) * mult
  stats.rangedDmg *= 1 + (e.rangedDmg || 0) * mult
  stats.attackSpeed *= 1 + (e.attackSpeed || 0) * mult
  stats.crit += (e.crit || 0) * mult
  stats.lifesteal += (e.lifesteal || 0) * mult
  stats.meleeRange += (e.meleeRange || 0) * mult
  stats.meleeArc += (e.meleeArc || 0) * mult
  stats.multishot += (e.multishot || 0) * mult
  stats.pierce += (e.pierce || 0) * mult
  stats.shield += (e.shield || 0) * mult
  stats.dashBurst += (e.dashBurst || 0) * mult
  stats.burn += (e.burn || 0) * mult
  stats.enemyVulnerable += (e.enemyVulnerable || 0) * mult
  stats.manaOnHit += (e.manaOnHit || 0) * mult
  stats.manaRegen += (e.manaRegen || 0) * mult
  stats.critHeal += (e.critHeal || 0) * mult
  stats.cinderGain += (e.cinderGain || 0) * mult
  stats.startHeal += (e.startHeal || 0) * mult
  stats.dashCdMul *= Math.max(.35, 1 + (e.dashCd || 0) * mult)
  stats.projectileMul *= Math.max(.3, 1 + (e.projectileDmg || 0) * mult)
  const dr = clamp((e.damageReduction || 0) * mult, 0, .6)
  stats.dmgReduction = 1 - (1 - stats.dmgReduction) * (1 - dr)
}

function computeStats() {
  const s = getSave()
  const stats = {
    maxHp: 100, maxMana: START_MANA, speed: 6.4, meleeDmg: 27, rangedDmg: 17,
    attackSpeed: 1, crit: .06, dmgReduction: 0, lifesteal: 0, meleeRange: 0,
    meleeArc: 0, multishot: 0, projectileMul: 1, pierce: 0, shield: 0,
    dashBurst: 0, burn: 0, enemyVulnerable: 0, manaOnHit: 0, emberGain: 1,
    manaRegen: 8, critHeal: 0, dashCdMul: 1, cinderGain: 0, startHeal: 0,
  }
  for (const perk of PERKS) {
    const lvl = perkLevel(perk.id)
    if (lvl > 0) applyEffects(stats, perk.effects, lvl)
  }
  for (const id of state.run?.boons || []) applyEffects(stats, BOON_MAP[id]?.effects, 1)
  // Oaths sworn at Bond V. Each immortal has her own clause.
  if (bondLevel('seraphine') >= 5) stats.shield += 1
  if (bondLevel('mirelle') >= 5) stats.emberGain *= 1.25
  if (bondLevel('ysolde') >= 5) stats.critHeal += .2
  // Last Rites turns its promised start-heal into a little extra vitality.
  stats.maxHp += stats.startHeal
  stats.maxHp = Math.round(Math.max(30, stats.maxHp))
  stats.maxMana = Math.round(Math.max(40, stats.maxMana))
  return stats
}

function oathSummary() {
  const oaths = CHARACTER_ORDER.filter(id => bondLevel(id) >= 5)
  if (!oaths.length) return 'Reach Bond V with one of them to swear an oath before the next descent.'
  return oaths.map(id => CHARACTERS[id].oath.split('—')[0].trim()).join(' · ')
}

// ---------------------------------------------------------------------------
// Screen chrome
// ---------------------------------------------------------------------------

function updateChrome() {
  const runVisible = state.mode === 'run' && !state.overlay
  toggleScreen(dom.hud, runVisible)
  const touchVisible = isTouch && !state.overlay && (state.mode === 'run' || state.mode === 'hub')
  toggleScreen(dom.touchUI, touchVisible)
  if (state.overlay || state.mode === 'result' || state.mode === 'title') hidePrompt()
  if (state.mode === 'run') updateHUD()
}

// ---------------------------------------------------------------------------
// World / sanctum
// ---------------------------------------------------------------------------

function buildSanctum(kind = 'hub') {
  world.setMode(kind === 'title' ? 'title' : 'play')
  world.buildRoom({ hub: true })
  state.interactables = []
  state.near = null
  state.enemies = []
  state.projectiles = []
  state.pickups = []

  const spots = [
    { x: -6.6, z: -2.2, char: 'seraphine' },
    { x: -3.4, z: -6.4, char: 'mirelle' },
    { x: 5.4, z: -1.4, char: 'ysolde' },
  ]
  for (const spot of spots) {
    const c = CHARACTERS[spot.char]
    const vis = world.addChibi(spot.char, spot.x, spot.z, { height: 3.05, ringColor: c.color })
    vis.sprite.userData.idle = spot.char
    world.addLabelSprite(c.short.toUpperCase(), spot.x, 3.65, spot.z, c.color, .78)
    if (kind === 'hub') {
      state.interactables.push({
        type: 'talk', charId: spot.char, x: spot.x, z: spot.z, r: 2.4,
        label: `Speak with ${c.short}`,
      })
    }
  }

  if (kind === 'hub') {
    const gate = world.addGate('descend', 'DESCEND', 0.2, -10.4, 0xe05071)
    state.interactables.push({
      type: 'hub-gate', x: 0.2, z: -10.4, r: 2.6, visual: gate,
      label: 'Descend into the Nave',
    })
    state.player = makePlayer()
    spawnPlayerVisual()
    world.setPlayerLight(state.player.x, 0, state.player.z)
    world.cameraFollow({ x: state.player.x, z: state.player.z }, .016, true)
  } else {
    state.player = null
    state.playerVisual = null
    world.setPlayerLight(0, 0, 0)
  }
}

function makePlayer() {
  const stats = computeStats()
  const b = world.bounds
  const p = {
    x: 0, z: b.maxZ - 2.6, facing: { x: 0, z: -1 }, moving: false,
    hp: stats.maxHp, maxHp: stats.maxHp, mana: stats.maxMana, maxMana: stats.maxMana,
    stats, shield: stats.shield, invuln: 0, hurtFlash: 0,
    meleeTimer: 0, rangedTimer: 0, dashTimer: 0, combo: 0, comboTimer: 0,
    dashTime: 0, dashDir: { x: 0, z: -1 }, dead: false,
    meleeMax: .42 / stats.attackSpeed,
    rangedMax: .55 / stats.attackSpeed,
    dashMax: 1.7 * stats.dashCdMul,
    ghostClock: 0,
  }
  return p
}

let _haloTexture = null
function haloTexture() {
  if (_haloTexture) return _haloTexture
  const c = document.createElement('canvas')
  c.width = 128; c.height = 128
  const x = c.getContext('2d')
  const g = x.createRadialGradient(64, 64, 2, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,214,170,.9)')
  g.addColorStop(.28, 'rgba(255,150,90,.4)')
  g.addColorStop(1, 'rgba(255,90,60,0)')
  x.fillStyle = g; x.fillRect(0, 0, 128, 128)
  _haloTexture = new THREE.CanvasTexture(c)
  _haloTexture.colorSpace = THREE.SRGBColorSpace
  return _haloTexture
}

function spawnPlayerVisual() {
  const p = state.player
  if (!p) return
  const vis = world.addChibi('vesper', p.x, p.z, { height: 2.55, ring: false })
  vis.faceScale = vis.height * .8
  vis.sprite.renderOrder = 3
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: haloTexture(), color: 0xffb078, transparent: true, opacity: .34,
    blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false,
  }))
  halo.scale.set(3.6, 3.6, 1)
  halo.position.set(p.x, 1.25, p.z)
  halo.renderOrder = 2
  world.entityGroup.add(halo)
  const marker = new THREE.Mesh(new THREE.RingGeometry(.46, .62, 32), new THREE.MeshBasicMaterial({
    color: 0xffb15c, transparent: true, opacity: .62, side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }))
  marker.rotation.x = -Math.PI / 2
  marker.position.set(p.x, .035, p.z)
  world.entityGroup.add(marker)
  vis.halo = halo
  vis.marker = marker
  state.playerVisual = vis
}

function syncPlayerVisual(dt) {
  const p = state.player
  const vis = state.playerVisual
  if (!p || !vis) return
  const bob = Math.sin(world.time * (p.moving ? 12 : 4)) * (p.moving ? .06 : .028)
  vis.sprite.position.set(p.x, vis.baseY + bob, p.z)
  vis.shadow.position.set(p.x, .015, p.z)
  if (vis.ring) vis.ring.position.set(p.x, .02, p.z)
  const flip = p.facing.x < -.06 ? -1 : 1
  vis.sprite.scale.x = vis.faceScale * flip
  if (vis.halo) {
    vis.halo.position.set(p.x, 1.25 + bob, p.z)
    vis.halo.material.opacity = p.dead ? 0 : .3 + Math.sin(world.time * 3) * .04
  }
  if (vis.marker) {
    vis.marker.position.set(p.x, .035, p.z)
    vis.marker.rotation.z += dt * .7
    vis.marker.visible = !p.dead
  }
  p.hurtFlash = Math.max(0, p.hurtFlash - dt)
  vis.sprite.material.color.setHex(p.hurtFlash > 0 ? 0xff98a8 : 0xffffff)
  world.setPlayerLight(p.x, 0, p.z)
}

// ---------------------------------------------------------------------------
// Title / hub rendering
// ---------------------------------------------------------------------------

function titlePortraitMarkup() {
  return CHARACTER_ORDER.map(id => {
    const c = CHARACTERS[id]
    return `<div class="title-hero"><img alt="${c.name}"><span class="th-name">${c.short.toUpperCase()}</span></div>`
  }).join('')
}

let titleBuilt = false
function updateTitleUI() {
  const s = getSave()
  if (!titleBuilt) {
    dom.titlePortraits.innerHTML = titlePortraitMarkup()
    $$('.title-hero img').forEach((img, i) => setImage(img, CHARACTER_ORDER[i], 'gallery'))
    titleBuilt = true
  }
  dom.titleRecord.textContent = `CINDERS ${fmt(s.cinders)} · BEST DEPTH ${s.bestDepth || 0} · ${s.runs} DESCENT${s.runs === 1 ? '' : 'S'} · ${s.wins} VICTOR${s.wins === 1 ? 'Y' : 'IES'}`
  dom.titleContinue.textContent = s.runs > 0 ? 'Continue your descent' : 'Begin your descent'
}

function renderHub() {
  const s = getSave()
  dom.hubCinders.textContent = fmt(s.cinders)
  dom.hubDepth.textContent = s.bestDepth || 0
  dom.hubBonds.innerHTML = CHARACTER_ORDER.map(id => {
    const c = CHARACTERS[id]
    const lvl = bondLevel(id)
    return `<div class="hub-bond" data-char="${id}">
      <img alt="${c.name}" data-char-img="${id}">
      <div><div class="hb-name">${c.short}</div><div class="hb-sub">${bondTitle(lvl)}</div></div>
      <div class="hb-hearts">${Array.from({ length: 6 }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('')}</div>
    </div>`
  }).join('')
  dom.hubBonds.querySelectorAll('[data-char-img]').forEach(img => setImage(img, img.dataset.charImg, 'portrait'))
  const equipped = oathSummary()
  dom.hubObjective.textContent = `${equipped} The abyss is open. Take a moment with them before you go.`
  dom.hubBonds.querySelectorAll('[data-char]').forEach(el => {
    el.addEventListener('click', () => openDialogue(el.dataset.char))
  })
}

function enterTitle() {
  state.mode = 'title'
  state.baseScreen = 'screen-title'
  state.overlay = null
  state.overlayReturn = null
  state.run = null
  state.player = null
  state.playerVisual = null
  buildSanctum('title')
  showOnly('screen-title')
  state.overlay = null
  updateChrome()
  updateTitleUI()
  renderHub()
  audio.setTheme('hub')
  audio.setTension(0)
}

function enterHub() {
  state.mode = 'hub'
  state.baseScreen = 'screen-hub'
  state.overlay = null
  state.overlayReturn = null
  state.run = null
  buildSanctum('hub')
  showOnly('screen-hub')
  updateChrome()
  renderHub()
  updateTitleUI()
  audio.setTheme('hub')
  audio.setTension(0)
}

// ---------------------------------------------------------------------------
// Run management
// ---------------------------------------------------------------------------

function startRun() {
  audio.unlock()
  state.mode = 'run'
  state.baseScreen = null
  state.overlay = null
  state.overlayReturn = null
  state.run = {
    room: 1, roomInfo: null, embers: 0, kills: 0, boons: [], cleared: false,
    ended: false, settled: false, ending: false, gatesOffered: false,
    boss: null, bossPhase: 1, nextElite: false, cindersGain: 0, roomToken: 0,
  }
  state.enemies = []
  state.projectiles = []
  state.pickups = []
  showOnly(null)
  enterRoom(1, { boss: false, elite: false })
  updateChrome()
  audio.setTheme('run')
  audio.portal()
  toast('DESCENT BEGINS', 'Four chambers stand between you and the Gilded Widow.', 'danger')
}

function enterRoom(room, { boss = false, elite = false } = {}) {
  const run = state.run
  if (!run || run.ended) return
  run.room = room
  run.cleared = false
  run.gatesOffered = false
  run.ending = false
  run.nextElite = elite
  run.roomToken += 1
  run.boss = null
  run.bossPhase = 1
  state.overlay = null
  state.overlayReturn = null
  state.baseScreen = null
  state.enemies = []
  state.projectiles = []
  state.pickups = []
  state.interactables = []
  state.near = null
  hidePrompt()
  showOnly(null)

  const roomName = ROOM_NAMES[(room - 1) % ROOM_NAMES.length]
  const info = world.buildRoom({ hub: false, depth: room, seed: Math.random(), roomName })
  run.roomInfo = info
  world.setMode('play')
  state.player = makePlayer()
  spawnPlayerVisual()
  world.cameraFollow({ x: state.player.x, z: state.player.z }, .016, true)
  world.setPlayerLight(state.player.x, 0, state.player.z)

  if (boss) {
    const bx = 0
    const bz = info.bounds.minZ + 5.2
    const bossEnemy = spawnEnemy('boss', bx, bz, true)
    run.boss = bossEnemy
    world.addBossAura(0xff5078)
    audio.bossRoar()
    toast('THE GILDED WIDOW', 'The Throne remembers every beautiful thing it has taken.', 'danger')
  } else {
    const count = 2 + room + (elite ? 2 : 0)
    for (let i = 0; i < count; i++) {
      const type = chooseEnemyType(room)
      const pos = findSpawnPoint(info, state.player, 6.6 + Math.random() * 1.8)
      spawnEnemy(type, pos.x, pos.z, false)
    }
    toast(`CHAMBER ${roman(room)} · ${roomName.toUpperCase()}`, elite ? 'An elite presence stains this room.' : `${count} souls bar the way.`, elite ? 'danger' : '')
  }

  updateHUD()
  updateChrome()
  audio.setTheme(boss ? 'boss' : 'run')
  audio.setTension(boss ? .9 : clamp(.2 + room * .13, 0, .8))
  state.tensionClock = 0
}

function roman(n) {
  return ['I', 'II', 'III', 'IV', 'V', 'VI'][Math.max(0, Math.min(5, n - 1))] || String(n)
}

function chooseEnemyType(room) {
  const pool = ['wraith']
  if (room >= 2) pool.push('hound', 'cultist')
  if (room >= 3) pool.push('knight')
  if (room >= 4) pool.push('knight', 'cultist', 'hound')
  return pick(pool)
}

function findSpawnPoint(info, player, minDist = 5) {
  for (let i = 0; i < 80; i++) {
    const x = info.bounds.minX + 1.5 + Math.random() * (info.bounds.maxX - info.bounds.minX - 3)
    const z = info.bounds.minZ + 1.5 + Math.random() * (info.bounds.maxZ - info.bounds.minZ - 3)
    if (dist(x, z, player.x, player.z) < minDist) continue
    let blocked = false
    for (const o of world.obstacles) if (dist(x, z, o.x, o.z) < o.r + 1) { blocked = true; break }
    if (blocked) continue
    for (const e of state.enemies) if (dist(x, z, e.x, e.z) < 2) { blocked = true; break }
    if (!blocked) return { x, z }
  }
  return { x: info.bounds.minX + 2, z: info.bounds.minZ + 2 }
}

function spawnEnemy(type, x, z, isBoss = false) {
  const cfg = {
    wraith: { hp: 46, speed: 2.45, dmg: 7, radius: .55, attack: 1.65, range: 1.3 },
    hound: { hp: 34, speed: 3.8, dmg: 6, radius: .7, attack: 1.25, range: 1.35 },
    cultist: { hp: 52, speed: 1.75, dmg: 8, radius: .58, attack: 2.4, range: 1.6 },
    knight: { hp: 100, speed: 1.7, dmg: 12, radius: .72, attack: 1.9, range: 1.65 },
    boss: { hp: 560, speed: 2.15, dmg: 15, radius: 1.75, attack: 2.4, range: 3.1 },
  }[type] || {}
  const room = state.run?.room || 1
  const scale = 1 + (room - 1) * .16 + (state.run?.nextElite ? .22 : 0)
  const hp = Math.round((isBoss ? cfg.hp : cfg.hp * scale) * (isBoss ? 1 : 1))
  const dmg = Math.round(cfg.dmg * (1 + (room - 1) * .11))
  const mesh = world.makeEnemyMesh(type)
  mesh.position.set(x, 0, z)
  const e = {
    id: ++state.enemySeq, type, x, z, hp, maxHp: hp, dmg, speed: cfg.speed,
    radius: cfg.radius, range: cfg.range, attackInterval: cfg.attack, attackCd: 1 + Math.random(),
    mesh, flash: 0, burn: null, phase: 1, dead: false, summoned: {},
  }
  if (type === 'hound') mesh.rotation.y = Math.random() * TAU
  state.enemies.push(e)
  return e
}

function removeEnemyMesh(e) {
  if (e.mesh && e.mesh.parent) e.mesh.parent.remove(e.mesh)
  e.mesh = null
}

function enemyRadius(e) { return e.radius || .6 }

// ---------------------------------------------------------------------------
// Gates & room clear
// ---------------------------------------------------------------------------

function onRoomCleared() {
  const run = state.run
  if (!run || run.cleared || run.ended) return
  run.cleared = true
  if (run.boss) {
    run.ending = true
    hidePrompt()
    audio.bossRoar()
    toast('THE WIDOW FALLS', 'The crown rolls into the dark. The Nave exhales.', 'unlock')
    setTimeout(() => finishRun(true), 1300)
    return
  }
  const bonus = Math.round((12 + run.room * 6) * (state.player?.stats.emberGain || 1))
  run.embers += bonus
  audio.levelUp()
  toast('CHAMBER CLEARED', `+${bonus} Embers · the gates awaken`, 'unlock')
  updateHUD()
  const token = run.roomToken
  setTimeout(() => {
    if (state.run === run && !run.ended && run.roomToken === token && run.cleared && !run.gatesOffered) {
      openBoonSelect()
    }
  }, 650)
}

function offerGates() {
  const run = state.run
  if (!run || run.ended || run.gatesOffered || !run.cleared) return
  run.gatesOffered = true
  const info = run.roomInfo
  const z = world.bounds.minZ + 2.1
  const descendLabel = run.room >= RUN_ROOMS - 1 ? 'THE THRONE' : `DESCEND · ${roman(run.room + 1)}`
  const a = world.addGate('descend', descendLabel, -4.6, z, 0xd9b978)
  state.interactables.push({
    type: 'gate', gateType: 'descend', x: -4.6, z, r: 2.3, visual: a,
    label: run.room >= RUN_ROOMS - 1 ? 'Enter the Throne' : 'Descend to the next chamber',
  })
  const special = pick(['elite', 'shop', 'rest'])
  const defs = {
    elite: { label: 'ELITE TRIAL', color: 0xe05071, prompt: 'Face the elite trial' },
    shop: { label: 'VELVET WARES', color: 0xd9b978, prompt: 'Browse Mirelle’s field ledger' },
    rest: { label: 'SHELTER', color: 0x4bd6cc, prompt: 'Rest at the hidden shrine' },
  }
  const def = defs[special]
  const b = world.addGate(special, def.label, 4.6, z, def.color)
  state.interactables.push({
    type: 'gate', gateType: special, x: 4.6, z, r: 2.3, visual: b, label: def.prompt,
  })
  toast('THE CHAMBER YIELDS', 'Two gates open. Choose what you carry deeper.', '')
}

function removeGate(inter) {
  inter.used = true
  const p = inter.visual
  if (p) {
    if (p.group?.parent) p.group.parent.remove(p.group)
    if (p.label?.parent) p.label.parent.remove(p.label)
    world.portals = world.portals.filter(x => x !== p)
    inter.visual = null
  }
}

function useGate(inter) {
  const run = state.run
  if (!run || run.ended) return
  if (inter.gateType === 'descend') {
    enterRoom(run.room + 1, { boss: run.room >= RUN_ROOMS - 1 })
    return
  }
  if (inter.gateType === 'elite') {
    audio.confirm()
    enterRoom(run.room + 1, { boss: run.room >= RUN_ROOMS - 1, elite: true })
    return
  }
  if (inter.gateType === 'shop') {
    openShop('run')
    return
  }
  if (inter.gateType === 'rest') {
    const p = state.player
    const heal = Math.round(p.maxHp * .38)
    p.hp = Math.min(p.maxHp, p.hp + heal)
    p.mana = p.maxMana
    p.shield = Math.max(p.shield, p.stats.shield + 1)
    audio.heal()
    world.burst({ x: p.x, y: 1.4, z: p.z }, 0x6fffe0, 20, 3, .14, .8)
    world.floatText(`+${heal}`, { x: p.x, y: 2.2, z: p.z }, '#8effe6', 34)
    toast('SHELTER', `+${heal} health · Ember restored · a ward for the road`, 'unlock')
    removeGate(inter)
    updateHUD()
  }
}

// ---------------------------------------------------------------------------
// Dialogue
// ---------------------------------------------------------------------------

function repeatChoices(id) {
  return [
    { text: '“I came back for you. That should count for something.”', reply: 'She lets the silence stretch, then smiles. “It counts for more than you know. Stay a moment longer.”', delta: 1, tag: 'SINCERE' },
    { text: '“Tell me something no one else knows.”', reply: 'She looks at you for a long, measuring moment. “I am afraid of the quiet after you leave. There. Now you have something of mine.”', delta: 1, tag: 'INTIMATE' },
    { text: '“Only checking that you’re still terrifying.”', reply: '“Terrifying, and terribly pleased to see you.” She inclines her head. “Go on. The dark is waiting, and so am I.”', delta: 0 },
  ]
}

function findDialogueEntry(charId) {
  const c = CHARACTERS[charId]
  const bond = bondLevel(charId)
  const entries = c?.dialogue || []
  const idx = entries.findIndex((entry, i) => bond >= entry.minBond && !hasSeen(charId, i))
  return idx >= 0 ? { entry: entries[idx], index: idx, isRepeat: false } : null
}

function openDialogue(charId) {
  if (!CHARACTERS[charId] || charId === 'vesper') return
  const c = CHARACTERS[charId]
  const found = findDialogueEntry(charId)
  const lvl = bondLevel(charId)
  const entry = found?.entry
  state.dialogue = {
    charId, index: found?.index ?? null, isRepeat: !found, stage: 'line',
  }
  if (found && found.index !== null) markSeen(charId, found.index)

  setImage(dom.dialoguePortrait, charId, 'portrait')
  dom.portraitAura.style.background = `radial-gradient(ellipse, ${c.color}44, ${c.accent}18 45%, transparent 72%)`
  dom.dialogueTitle.textContent = c.title
  dom.dialogueName.textContent = c.name
  dom.dialogueSpeaker.textContent = c.short.toUpperCase()
  dom.dialogueNote.textContent = found ? 'A NEW CONFESSION' : 'SHE REMEMBERS YOU'
  renderHearts(dom.dialogueBond, lvl)
  const text = entry?.text || pick(c.repeats)
  renderDialogueLine(text, entry?.choices || repeatChoices(charId))
  state.overlayReturn = state.overlay || state.baseScreen || null
  state.overlay = 'screen-dialogue'
  showOnly('screen-dialogue')
  hidePrompt()
  updateChrome()
  audio.dialogue()
}

function renderHearts(el, level) {
  if (!el) return
  el.innerHTML = Array.from({ length: 6 }, (_, i) => `<i class="${i < level ? 'on' : ''}"></i>`).join('')
}

function renderDialogueLine(text, choices) {
  dom.dialogueText.textContent = text
  dom.dialogueText.classList.remove('typed')
  dom.dialogueChoices.innerHTML = ''
  for (const choice of choices) {
    const b = document.createElement('button')
    b.className = 'choice'
    b.innerHTML = `${choice.text}${choice.tag ? `<span class="tag">${choice.tag}</span>` : ''}`
    b.addEventListener('click', () => chooseDialogue(choice))
    dom.dialogueChoices.appendChild(b)
  }
}

function chooseDialogue(choice) {
  const d = state.dialogue
  if (!d) return
  const charId = d.charId
  const c = CHARACTERS[charId]
  const before = bondLevel(charId)
  const gain = bondGain(charId, choice.delta || 0)
  const after = bondLevel(charId)
  d.stage = 'reply'
  dom.dialogueText.textContent = choice.reply
  dom.dialogueChoices.innerHTML = ''
  const note = gain > 0 ? `AFFECTION +${gain} · ${bondTitle(after)}` : `BOND ${bondTitle(after)}`
  dom.dialogueNote.textContent = note
  renderHearts(dom.dialogueBond, after)
  audio.confirm()

  if (gain > 0 && after > before) {
    toast(`BOND ${roman(after)} — ${bondTitle(after)}`, `${c.short} will remember this.`, 'unlock')
    if (after === 2) toast('ILLUSTRATION UNSEALED', `${c.short}'s full-body portrait waits in the gallery.`, 'unlock')
    if (after === 5) toast('OATH AVAILABLE', c.oath, 'unlock')
  }

  const next = document.createElement('button')
  next.className = 'choice'
  next.textContent = `“I should go.”`
  next.addEventListener('click', closeDialogue)
  const stay = document.createElement('button')
  stay.className = 'choice'
  stay.textContent = 'Stay a little longer.'
  stay.addEventListener('click', () => openDialogue(charId))
  dom.dialogueChoices.appendChild(stay)
  dom.dialogueChoices.appendChild(next)
}

function closeDialogue() {
  state.dialogue = null
  const ret = state.overlayReturn
  state.overlay = ret && ret !== state.baseScreen ? ret : null
  state.overlayReturn = null
  showOnly(state.overlay || state.baseScreen || null)
  updateChrome()
  renderHub()
  audio.back()
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

function openGallery() {
  state.galleryChar = 0
  openOverlay('screen-gallery')
  renderGallery()
}

function renderGallery() {
  const s = getSave()
  dom.galleryRail.innerHTML = CHARACTER_ORDER.map((id, i) => {
    const c = CHARACTERS[id]
    const unlocked = bondLevel(id) >= 2
    return `<button class="gallery-tab ${i === state.galleryChar ? 'active' : ''} ${unlocked ? '' : 'locked'}" data-gallery="${i}">
      <img alt="${c.name}" data-gallery-img="${id}">
      <div><div class="gt-name">${c.short}</div><div class="gt-sub">${bondTitle(bondLevel(id))}</div></div>
      <span class="gt-state">${unlocked ? 'OPEN' : 'SEALED'}</span>
    </button>`
  }).join('')
  dom.galleryRail.querySelectorAll('[data-gallery-img]').forEach(img => setImage(img, img.dataset.galleryImg, 'portrait'))
  dom.galleryRail.querySelectorAll('[data-gallery]').forEach(el => {
    el.addEventListener('click', () => {
      state.galleryChar = Number(el.dataset.gallery)
      audio.click()
      renderGallery()
    })
  })

  const id = CHARACTER_ORDER[state.galleryChar]
  const c = CHARACTERS[id]
  const lvl = bondLevel(id)
  const unlocked = lvl >= 2
  const memory = lvl >= 4
  dom.artFrame.classList.toggle('sealed', !unlocked)
  setImage(dom.galleryArt, id, unlocked ? 'gallery' : 'portrait')
  dom.artCaption.textContent = unlocked ? `${c.name} · ${c.epithet}` : 'The frame is sealed'
  dom.artLockText.textContent = `Reach Bond II with ${c.short} to reveal this illustration.`
  dom.galleryTitle.textContent = c.title
  dom.galleryName.textContent = c.name
  dom.galleryQuote.textContent = unlocked ? c.galleryQuote : '“Earn my trust first, darling.”'
  dom.galleryLore.textContent = unlocked ? c.lore : 'A full-body illustration waits behind this seal. Speak with her, choose honestly, and the frame will open.'
  dom.galleryBondLabel.textContent = unlocked ? `BOND ${roman(lvl)} · ${bondTitle(lvl)}` : 'BOND II REQUIRED'
  dom.galleryStatus.textContent = unlocked ? 'UNSEALED' : 'SEALED'
  dom.galleryMemory.textContent = memory ? c.memory : ''
  dom.galleryMemory.classList.toggle('show', memory)
  dom.galleryExpand.classList.toggle('hidden', !unlocked)
  dom.galleryExpand.onclick = () => {
    if (!unlocked) return
    const img = new Image()
    img.onload = () => {
      dom.artModalImg.src = img.src
      dom.artModalCap.textContent = `${c.name} · ${c.title}`
      dom.artModal.classList.add('active')
    }
    img.src = c.gallery
    // If the local file is missing, fall back to the already loaded portrait.
    img.onerror = () => {
      dom.artModalImg.src = dom.galleryArt.src
      dom.artModalCap.textContent = `${c.name} · ${c.title}`
      dom.artModal.classList.add('active')
    }
  }
}

// ---------------------------------------------------------------------------
// Shop
// ---------------------------------------------------------------------------

function shopDiscount() {
  const bond = bondLevel('mirelle')
  return bond >= 5 ? .2 : bond >= 3 ? .1 : 0
}

function openShop(context = 'hub') {
  state.shopContext = context
  if (context === 'run') {
    const run = state.run
    const available = BOONS.filter(b => !run.boons.includes(b.id))
    state.shopOffering = sample(available, Math.min(3, available.length)).map(b => ({
      boon: b, price: 16 + run.room * 5,
    }))
  }
  state.overlayReturn = state.overlay || state.baseScreen || null
  state.overlay = 'screen-shop'
  showOnly('screen-shop')
  hidePrompt()
  updateChrome()
  renderShop()
  audio.confirm()
}

function renderShop() {
  const runMode = state.shopContext === 'run'
  setImage(dom.shopPortrait, 'mirelle', 'portrait')
  dom.shopSpeech.textContent = pick(SHOP_QUOTES)
  dom.shopEyebrow.textContent = runMode ? 'THE VELVET EXCHANGE · FIELD LEDGER' : 'THE VELVET EXCHANGE'
  dom.shopTitle.innerHTML = runMode ? 'Embers for <em>Power</em>' : 'Cinders for <em>Keepsakes</em>'
  dom.shopSub.textContent = runMode
    ? 'A little something for the road, darling. Priced in Embers, and gone when this life ends.'
    : 'Permanent boons carved into your soul. They survive every death.'
  const discount = runMode ? 0 : shopDiscount()
  if (discount > 0 && !runMode) dom.shopSub.textContent += ` Mirelle’s fondness grants you ${Math.round(discount * 100)}% off.`

  if (runMode) {
    dom.shopCurrency.textContent = fmt(state.run?.embers || 0)
    dom.shopCurrencyLabel.textContent = 'EMBERS'
    dom.shopGrid.innerHTML = state.shopOffering.map(({ boon, price }, i) => `
      <div class="shop-item">
        <div class="shop-icon">${boon.icon}</div>
        <div class="shop-info"><b>${boon.name}</b><p>${boon.desc}</p>
          <div class="shop-pips">${Array.from({ length: 3 }, () => '<i></i>').join('')}</div>
        </div>
        <div class="shop-buy"><span class="cost">${price}</span><button data-buy-boon="${i}" ${state.run.embers < price ? 'disabled' : ''}>Buy</button></div>
      </div>`).join('') || '<p style="color:var(--muted);font-size:12px">The ledger is empty. Even I cannot sell what you already own.</p>'
    dom.shopFootNote.textContent = '“No refunds. The road is not a charity, and neither am I.”'
    dom.shopGrid.querySelectorAll('[data-buy-boon]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = state.shopOffering[Number(btn.dataset.buyBoon)]
        if (!item) return
        if (state.run.embers < item.price) { toast('NOT ENOUGH EMBERS', 'Kill something beautiful. Or at least wealthy.', 'danger'); audio.back(); return }
        state.run.embers -= item.price
        state.shopOffering = state.shopOffering.filter(x => x !== item)
        applyBoon(item.boon)
        audio.confirm()
        renderShop()
        updateHUD()
      })
    })
    return
  }

  const s = getSave()
  dom.shopCurrency.textContent = fmt(s.cinders)
  dom.shopCurrencyLabel.textContent = 'CINDERS'
  dom.shopGrid.innerHTML = PERKS.map(perk => {
    const lvl = perkLevel(perk.id)
    const maxed = lvl >= perk.max
    const base = perkCost(perk)
    const cost = Math.max(1, Math.round(base * (1 - discount)))
    return `<div class="shop-item ${maxed ? 'maxed' : lvl > 0 ? 'owned' : ''}">
      <div class="shop-icon">${perk.icon}</div>
      <div class="shop-info"><b>${perk.name}</b><p>${perk.desc}</p>
        <div class="shop-pips">${Array.from({ length: perk.max }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('')}</div>
      </div>
      <div class="shop-buy"><span class="cost">${maxed ? '—' : cost}</span>
        <button data-buy-perk="${perk.id}" ${maxed || s.cinders < cost ? 'disabled' : ''}>${maxed ? 'Maxed' : 'Buy'}</button>
      </div>
    </div>`
  }).join('')
  dom.shopFootNote.textContent = '“No refunds. I’m a demon, not a charity.”'
  dom.shopGrid.querySelectorAll('[data-buy-perk]').forEach(btn => {
    btn.addEventListener('click', () => {
      const perk = PERK_MAP[btn.dataset.buyPerk]
      if (!perk) return
      const lvl = perkLevel(perk.id)
      if (lvl >= perk.max) return
      const cost = Math.max(1, Math.round(perkCost(perk) * (1 - discount)))
      const save = getSave()
      if (save.cinders < cost) { toast('NOT ENOUGH CINDERS', 'Descend. Die. Repeat. That is the economy.', 'danger'); audio.back(); return }
      save.cinders -= cost
      save.perks[perk.id] = lvl + 1
      commit()
      audio.confirm()
      toast(perk.name.toUpperCase(), `Rank ${lvl + 1} of ${perk.max} carved into your soul.`, 'unlock')
      renderShop()
      renderHub()
      updateTitleUI()
    })
  })
}

// ---------------------------------------------------------------------------
// Boons
// ---------------------------------------------------------------------------

function openBoonSelect(after = 'gates') {
  const run = state.run
  if (!run || run.ended) return
  const available = BOONS.filter(b => !run.boons.includes(b.id))
  state.boonChoices = sample(available, Math.min(3, available.length))
  state.boonAfter = after
  dom.boonsEyebrow.textContent = `CHAMBER ${roman(run.room)} YIELDS`
  dom.boonsTitle.innerHTML = 'Claim a <em>Boon</em>'
  dom.boonsSub.textContent = 'One gift may follow you into the dark. The rest are only memories.'
  dom.boonCards.innerHTML = state.boonChoices.map((b, i) => `
    <button class="boon-card ${b.rarity}" data-boon="${i}">
      <span class="rarity">${b.rarity}</span>
      <span class="b-icon">${b.icon}</span>
      <h3>${b.name}</h3>
      <p>${b.desc}</p>
      <span class="choose-hint">Take this gift</span>
    </button>`).join('')
  dom.boonCards.querySelectorAll('[data-boon]').forEach(el => {
    el.addEventListener('click', () => {
      const boon = state.boonChoices[Number(el.dataset.boon)]
      if (boon) pickBoon(boon)
    })
  })
  dom.skipBoons.classList.remove('hidden')
  state.overlayReturn = state.overlay || state.baseScreen || null
  state.overlay = 'screen-boons'
  showOnly('screen-boons')
  hidePrompt()
  updateChrome()
  audio.confirm()
}

function pickBoon(boon) {
  applyBoon(boon)
  const after = state.boonAfter
  state.overlay = null
  state.overlayReturn = null
  showOnly(null)
  updateChrome()
  if (after === 'gates') offerGates()
}

function skipBoons() {
  const run = state.run
  if (!run || state.overlay !== 'screen-boons') return
  run.embers += 30
  const after = state.boonAfter
  state.overlay = null
  state.overlayReturn = null
  showOnly(null)
  updateHUD()
  updateChrome()
  audio.back()
  toast('THE GIFT REFUSED', '+30 Embers. Pride is expensive; fortunately, so are you.')
  if (after === 'gates') offerGates()
}

function applyBoon(boon) {
  const run = state.run
  const p = state.player
  if (!run || !p) return
  const oldStats = p.stats
  const oldHp = p.hp
  const oldMana = p.mana
  run.boons.push(boon.id)
  const stats = computeStats()
  p.stats = stats
  p.maxHp = stats.maxHp
  p.maxMana = stats.maxMana
  const hpGain = Math.max(0, stats.maxHp - oldStats.maxHp)
  p.hp = Math.min(p.maxHp, oldHp + hpGain + (boon.effects.heal || 0))
  p.mana = Math.min(p.maxMana, oldMana + Math.max(0, stats.maxMana - oldStats.maxMana))
  p.shield += boon.effects.shield || 0
  p.meleeMax = .42 / stats.attackSpeed
  p.rangedMax = .55 / stats.attackSpeed
  p.dashMax = 1.7 * stats.dashCdMul
  audio.levelUp()
  world.floatText(boon.name.toUpperCase(), { x: p.x, y: 2.6, z: p.z }, '#f6e4b0', 24)
  toast(boon.name.toUpperCase(), boon.desc, boon.rarity === 'epic' ? 'danger' : 'unlock')
  updateHUD()
}

// ---------------------------------------------------------------------------
// Pause / results
// ---------------------------------------------------------------------------

function openPause() {
  if (state.mode !== 'run' || state.overlay) return
  state.overlayReturn = null
  state.overlay = 'screen-pause'
  showOnly('screen-pause')
  hidePrompt()
  renderPause()
  updateChrome()
  audio.back()
}

function renderPause() {
  const run = state.run
  if (!run) return
  const p = state.player
  dom.pauseStats.innerHTML = `
    <div><b>${roman(run.room)} / V</b><small>CHAMBER</small></div>
    <div><b>${fmt(run.kills)}</b><small>KILLS</small></div>
    <div><b>${fmt(run.embers)}</b><small>EMBERS</small></div>
    <div><b>${p ? Math.ceil(p.hp) : 0}</b><small>VITALITY</small></div>
    <div><b>${run.boons.length}</b><small>BOONS</small></div>`
}

function settleRun(victory) {
  const run = state.run
  if (!run || run.settled) return run?.cindersGain || 0
  run.settled = true
  const stats = state.player?.stats || computeStats()
  const base = 5 + run.kills * 2 + Math.max(0, run.room - 1) * 16 + run.embers * .08 + (victory ? 85 : 0)
  const gain = Math.max(0, Math.round(base * (1 + (stats.cinderGain || 0))))
  run.cindersGain = gain
  if (gain > 0) addCinders(gain)
  recordRun({ victory, depth: run.room, kills: run.kills, embers: run.embers })
  return gain
}

function finishRun(victory, { silent = false } = {}) {
  const run = state.run
  if (!run || run.ended) return
  run.ended = true
  run.ending = true
  const gain = settleRun(victory)
  if (victory) {
    for (const id of CHARACTER_ORDER) bondGain(id, 1)
    toast('THE THREE REMEMBER', 'A victory like that is worth a little affection.', 'unlock')
  }
  if (silent) {
    enterTitle()
    if (gain) toast('RUNS END', `${fmt(gain)} Cinders carried back to the sanctum.`, 'unlock')
    return
  }
  state.mode = 'result'
  state.overlay = 'screen-result'
  state.baseScreen = null
  state.overlayReturn = null
  showOnly('screen-result')
  hidePrompt()
  updateChrome()
  renderResult(victory, gain)
  updateTitleUI()
  audio.setTheme('hub')
  audio.setTension(0)
  if (victory) audio.confirm(); else audio.death()
}

function renderResult(victory, gain) {
  const run = state.run
  if (!run) return
  dom.resultEyebrow.textContent = victory ? 'THE THRONE YIELDS' : run.room >= BOSS_ROOM ? 'THE WIDOW COLLECTS' : 'THE DEEP CLAIMS ANOTHER'
  dom.resultTitle.innerHTML = victory ? 'The Widow <em>Unmade</em>' : 'Ashen <em>Silence</em>'
  dom.resultText.textContent = victory
    ? 'The Gilded Widow falls, and for one impossible hour the Nave is quiet. Three women are waiting above. They will want to hear every detail.'
    : `You fell in Chamber ${roman(run.room)}. The dark is patient. The sanctum is not.`
  dom.resultStats.innerHTML = `
    <div><b>${roman(run.room)}</b><small>DEPTH REACHED</small></div>
    <div><b>${fmt(run.kills)}</b><small>SOULS UNMADE</small></div>
    <div><b>${fmt(run.embers)}</b><small>${victory ? 'EMBERS GATHERED' : 'EMBERS LOST'}</small></div>
    <div><b>+${fmt(gain)}</b><small>CINDERS KEPT</small></div>`
}

function playerDeath() {
  const run = state.run
  if (!run || run.ending || run.ended) return
  run.ending = true
  const p = state.player
  if (p) {
    p.dead = true
    p.hp = 0
    world.burst({ x: p.x, y: 1.5, z: p.z }, 0xff5078, 28, 4.2, .16, 1)
    if (state.playerVisual) {
      state.playerVisual.sprite.visible = false
      if (state.playerVisual.halo) state.playerVisual.halo.visible = false
      if (state.playerVisual.marker) state.playerVisual.marker.visible = false
    }
  }
  shake(.9)
  brushFlash()
  audio.death()
  hidePrompt()
  toast('YOU HAVE FALLEN', 'The deep will keep what it is owed.', 'danger')
  setTimeout(() => finishRun(false), 1200)
}

// ---------------------------------------------------------------------------
// Combat: player
// ---------------------------------------------------------------------------

function getMoveInput() {
  let mx = (state.keys.has('KeyD') || state.keys.has('ArrowRight') ? 1 : 0) - (state.keys.has('KeyA') || state.keys.has('ArrowLeft') ? 1 : 0)
  let mz = (state.keys.has('KeyW') || state.keys.has('ArrowUp') ? 1 : 0) - (state.keys.has('KeyS') || state.keys.has('ArrowDown') ? 1 : 0)
  mx += state.touch.x
  mz += -state.touch.y
  const len = Math.hypot(mx, mz)
  if (len > 1) { mx /= len; mz /= len }
  return { x: F.x * mz + R.x * mx, z: F.z * mz + R.z * mx, input: len }
}

function nearestEnemy() {
  const p = state.player
  if (!p) return null
  let best = null, bestD = Infinity
  for (const e of state.enemies) {
    if (e.hp <= 0) continue
    const d = dist(p.x, p.z, e.x, e.z)
    if (d < bestD) { bestD = d; best = e }
  }
  return best
}

function updateAim() {
  const p = state.player
  if (!p) return
  let target = null
  if (!isTouch && state.pointer.active) {
    const ground = world.screenToGround(state.pointer.x, state.pointer.y)
    if (ground && Number.isFinite(ground.x) && Number.isFinite(ground.z)) target = ground
  }
  if (!target) {
    const e = nearestEnemy()
    if (e) target = e
  }
  if (target) {
    const dx = target.x - p.x, dz = target.z - p.z
    const len = Math.hypot(dx, dz)
    if (len > .2) { p.facing.x = dx / len; p.facing.z = dz / len; return }
  }
  if (p.moving && (p.lastMove?.x || p.lastMove?.z)) {
    const len = Math.hypot(p.lastMove.x, p.lastMove.z)
    if (len > .001) { p.facing.x = p.lastMove.x / len; p.facing.z = p.lastMove.z / len }
  }
}

function movePlayer(dt) {
  const p = state.player
  if (!p || p.dead) return
  p.invuln = Math.max(0, p.invuln - dt)
  p.hurtFlash = Math.max(0, p.hurtFlash - dt)
  p.meleeTimer = Math.max(0, p.meleeTimer - dt)
  p.rangedTimer = Math.max(0, p.rangedTimer - dt)
  if (p.comboTimer > 0) p.comboTimer -= dt
  p.mana = Math.min(p.maxMana, p.mana + p.stats.manaRegen * dt)

  const move = getMoveInput()
  p.moving = move.input > .06
  p.lastMove = { x: move.x, z: move.z }
  if (p.dashTime > 0) {
    p.dashTime -= dt
    p.invuln = Math.max(p.invuln, .12)
    p.x += p.dashDir.x * 20 * dt
    p.z += p.dashDir.z * 20 * dt
    p.ghostClock -= dt
    if (p.ghostClock <= 0 && state.playerVisual) {
      p.ghostClock = .045
      world.ghost(state.playerVisual.sprite, p.x, p.z, .26)
    }
  } else if (p.moving) {
    p.x += move.x * p.stats.speed * dt
    p.z += move.z * p.stats.speed * dt
  }
  resolvePlayerCollision(p)
  updateAim()
  if (p.comboTimer <= 0) p.combo = 0
}

function resolvePlayerCollision(p) {
  const b = world.bounds
  p.x = clamp(p.x, b.minX, b.maxX)
  p.z = clamp(p.z, b.minZ, b.maxZ)
  const radius = .38
  for (const o of world.obstacles) {
    const dx = p.x - o.x, dz = p.z - o.z
    const d = Math.hypot(dx, dz)
    const min = o.r + radius
    if (d < min && d > .0001) {
      p.x = o.x + dx / d * min
      p.z = o.z + dz / d * min
    }
  }
  p.x = clamp(p.x, b.minX, b.maxX)
  p.z = clamp(p.z, b.minZ, b.maxZ)
}

function tryMelee() {
  const p = state.player
  const run = state.run
  if (!p || !run || state.overlay || run.ended || run.ending || p.dead || p.meleeTimer > 0) return
  const step = p.comboTimer > 0 ? (p.combo + 1) % 3 : 0
  p.combo = step
  p.comboTimer = 1.15
  const heavy = step === 2
  const stats = p.stats
  p.meleeTimer = (heavy ? .62 : .4) / stats.attackSpeed
  const angle = Math.atan2(p.facing.z, p.facing.x)
  const range = (heavy ? 3.55 : 2.85) * (1 + stats.meleeRange)
  const arc = (heavy ? Math.PI * 1.16 : Math.PI * .82) + stats.meleeArc * Math.PI / 180
  world.slash({ x: p.x, z: p.z }, angle, heavy ? 0xff8fb0 : 0xffe6b0, range, arc, heavy ? .3 : .22)
  audio.swing()
  shake(heavy ? .2 : .08)
  p.x += p.facing.x * (heavy ? .55 : .32)
  p.z += p.facing.z * (heavy ? .55 : .32)
  resolvePlayerCollision(p)

  let hits = 0
  for (const e of state.enemies) {
    if (e.hp <= 0) continue
    const d = dist(p.x, p.z, e.x, e.z)
    if (d > range + enemyRadius(e)) continue
    const a = Math.atan2(e.z - p.z, e.x - p.x)
    if (Math.abs(angleDiff(a, angle)) > arc / 2 + .15) continue
    const base = stats.meleeDmg * (heavy ? 1.72 : 1)
    damageEnemy(e, base, 'melee')
    hits++
  }
  if (hits > 0) {
    p.mana = Math.min(p.maxMana, p.mana + 1.5)
    shake(.08)
  }
}

function tryRanged() {
  const p = state.player
  const run = state.run
  if (!p || !run || state.overlay || run.ended || run.ending || p.dead || p.rangedTimer > 0) return
  if (p.mana < BOLT_COST) {
    if (state.elapsed - (p.lastManaWarn || -9) > 1.2) {
      p.lastManaWarn = state.elapsed
      toast('EMBER EXHAUSTED', 'Let it breathe. Or hit something with a sword.', 'danger')
      audio.back()
    }
    return
  }
  const stats = p.stats
  p.mana -= BOLT_COST
  p.rangedTimer = .55 / stats.attackSpeed
  const count = 1 + Math.round(stats.multishot)
  const baseAngle = Math.atan2(p.facing.z, p.facing.x)
  const spread = count > 1 ? .2 : 0
  for (let i = 0; i < count; i++) {
    const a = baseAngle + (i - (count - 1) / 2) * spread
    spawnProjectile(p.x + Math.cos(a) * .55, p.z + Math.sin(a) * .55, Math.cos(a), Math.sin(a), true, {
      dmg: stats.rangedDmg * stats.projectileMul * (count > 1 ? .8 : 1),
      speed: 15, color: 0xc9aaff, pierce: stats.pierce, life: 1.7,
    })
  }
  audio.shoot()
  shake(.04)
}

function tryDash() {
  const p = state.player
  const run = state.run
  if (!p || !run || state.overlay || run.ended || run.ending || p.dead || p.dashTimer > 0) return
  const move = getMoveInput()
  let dir = { x: p.facing.x, z: p.facing.z }
  if (move.input > .1) {
    const len = Math.hypot(move.x, move.z)
    dir = { x: move.x / len, z: move.z / len }
  }
  p.dashTimer = p.dashMax
  p.dashTime = .18
  p.dashDir = dir
  p.invuln = .34
  p.facing.x = dir.x; p.facing.z = dir.z
  p.ghostClock = 0
  audio.dash()
  shake(.1)
  if (p.stats.dashBurst > 0) {
    world.shockwave(p.x, p.z, 0xffb15c, 3.6, .5)
    for (const e of state.enemies) {
      if (e.hp > 0 && dist(p.x, p.z, e.x, e.z) < 3.6 + enemyRadius(e)) damageEnemy(e, p.stats.dashBurst, 'dash')
    }
  }
}

function damagePlayer(amount) {
  const p = state.player
  const run = state.run
  if (!p || !run || p.dead || run.ending || run.ended || p.invuln > 0) return
  let dmg = amount * (1 - p.stats.dmgReduction)
  if (p.shield > 0) {
    p.shield--
    p.invuln = .8
    p.hurtFlash = .25
    world.floatText('WARDED', { x: p.x, y: 2.4, z: p.z }, '#8fd8ff', 24)
    world.burst({ x: p.x, y: 1.5, z: p.z }, 0x8fd8ff, 14, 3, .12, .7)
    audio.crit()
    shake(.2)
    updateHUD()
    return
  }
  dmg = Math.max(1, dmg)
  p.hp -= dmg
  p.invuln = .8
  p.hurtFlash = .28
  p.mana = Math.max(0, p.mana - 4)
  brushFlash()
  shake(.3)
  audio.hurt()
  world.burst({ x: p.x, y: 1.3, z: p.z }, 0xff5078, 12, 2.4, .1, .6)
  world.floatText(`-${Math.round(dmg)}`, { x: p.x, y: 2.25, z: p.z }, '#ff7d98', 30)
  updateHUD()
  if (p.hp <= 0) playerDeath()
}

function healPlayer(amount) {
  const p = state.player
  if (!p || p.dead) return
  p.hp = Math.min(p.maxHp, p.hp + amount)
}

function damageEnemy(e, base, source = 'melee') {
  if (!e || e.hp <= 0) return
  const p = state.player
  if (!p) return
  const stats = p.stats
  const crit = Math.random() < stats.crit
  let dmg = base * (1 + stats.enemyVulnerable) * (crit ? 1.78 : 1)
  dmg = Math.max(1, Math.round(dmg))
  e.hp -= dmg
  e.flash = .18
  if (source === 'melee') {
    if (stats.burn > 0) e.burn = { dps: stats.burn / 3, time: 3 }
    if (stats.lifesteal > 0) healPlayer(Math.round(dmg * stats.lifesteal))
  }
  if (crit && stats.critHeal > 0) healPlayer(Math.round(dmg * stats.critHeal))
  world.floatText(`${dmg}`, { x: e.x, y: (e.type === 'boss' ? 3.6 : 1.9), z: e.z }, crit ? '#ffd36e' : '#f6e4b0', crit ? 38 : 30, crit)
  world.burst({ x: e.x, y: 1.3, z: e.z }, crit ? 0xffd36e : (ENEMY_LORE[e.type]?.color ? new THREE.Color(ENEMY_LORE[e.type].color).getHex() : 0xffcf8a), crit ? 16 : 8, 2.4, .1, .5)
  if (crit) audio.crit(); else audio.hit()
  shake(crit ? .2 : .06)

  if (e.type === 'boss') updateBossPhase(e)
  if (e.hp <= 0) killEnemy(e)
  updateHUD()
}

function killEnemy(e) {
  if (e.dead) return
  e.dead = true
  e.hp = 0
  const color = ENEMY_LORE[e.type]?.color ? new THREE.Color(ENEMY_LORE[e.type].color).getHex() : 0xffcf8a
  world.burst({ x: e.x, y: 1.2, z: e.z }, color, e.type === 'boss' ? 44 : 16, e.type === 'boss' ? 6 : 3, e.type === 'boss' ? .22 : .12, 1)
  world.shockwave(e.x, e.z, color, e.type === 'boss' ? 7 : 2.2, .4)
  shake(e.type === 'boss' ? .7 : .16)
  removeEnemyMesh(e)
  state.run.kills++

  if (e.type !== 'boss') {
    const drops = 2 + Math.floor(Math.random() * 2)
    for (let i = 0; i < drops; i++) spawnPickup('ember', e.x + (Math.random() - .5) * 1.3, e.z + (Math.random() - .5) * 1.3, 4 + Math.floor(Math.random() * 5))
    if (Math.random() < .18) spawnPickup('health', e.x, e.z, 18)
  } else {
    state.run.embers += 120
    audio.bossRoar()
  }
  updateHUD()
  if (!state.run.cleared && !state.enemies.some(x => x.hp > 0)) onRoomCleared()
}

function updateBossPhase(e) {
  const run = state.run
  if (!run || e.type !== 'boss') return
  const frac = e.hp / e.maxHp
  if (e.phase < 2 && frac <= .66) {
    e.phase = 2
    run.bossPhase = 2
    world.shockwave(e.x, e.z, 0xff5078, 5, .7)
    spawnBoltRing(e, 9)
    toast('THE WIDOW UNVEILS', 'Phase II · the crown splits.', 'danger')
    audio.bossPhase()
  } else if (e.phase < 3 && frac <= .33) {
    e.phase = 3
    run.bossPhase = 3
    world.shockwave(e.x, e.z, 0xff9ab0, 6, .8)
    spawnBoltRing(e, 13)
    for (let i = 0; i < 2; i++) {
      const pos = findSpawnPoint(run.roomInfo, state.player, 3)
      spawnEnemy('wraith', pos.x, pos.z, false)
    }
    toast('THE WIDOW SCREAMS', 'Phase III · she calls the choir home.', 'danger')
    audio.bossPhase()
  }
  updateHUD()
}

// ---------------------------------------------------------------------------
// Combat: enemies, projectiles, pickups
// ---------------------------------------------------------------------------

function updateEnemies(dt) {
  const p = state.player
  const run = state.run
  if (!p || !run || run.ending || run.ended || p.dead) return
  for (const e of state.enemies) {
    if (e.hp <= 0) continue
    e.flash = Math.max(0, e.flash - dt * 5)
    if (e.mesh) e.mesh.scale.setScalar(1 + e.flash * .18)
    if (e.burn && e.burn.time > 0) {
      e.burn.time -= dt
      e.hp -= e.burn.dps * dt
      if (Math.random() < dt * 3) world.burst({ x: e.x, y: 1.4, z: e.z }, 0xff8a3c, 2, .6, .06, .2)
      if (e.hp <= 0) { killEnemy(e); continue }
    }
    e.attackCd -= dt
    const dx = p.x - e.x, dz = p.z - e.z
    const d = Math.max(.001, Math.hypot(dx, dz))
    const ux = dx / d, uz = dz / d
    if (e.mesh) {
      if (e.type === 'hound') e.mesh.rotation.y = Math.atan2(-uz, ux)
      else if (e.type !== 'boss') e.mesh.rotation.y = Math.atan2(-uz, ux) * .4
    }

    if (e.type === 'boss') { updateBoss(e, dt, d, ux, uz); continue }

    if (e.type === 'cultist') {
      if (d > 6.2) moveEnemy(e, ux, uz, dt)
      else if (d < 3.2) moveEnemy(e, -ux, -uz, dt, .8)
      if (e.attackCd <= 0 && d < 10) {
        const a = Math.atan2(dz, dx) + (Math.random() - .5) * .12
        spawnProjectile(e.x + Math.cos(a) * .6, e.z + Math.sin(a) * .6, Math.cos(a), Math.sin(a), false, {
          dmg: e.dmg, speed: 6.4, color: 0xff7088, life: 3, radius: .22,
        })
        e.attackCd = e.attackInterval
        audio.shoot()
        world.slash({ x: e.x, z: e.z }, a, 0xff7088, 1.1, .7, .16)
      }
    } else {
      if (d > e.range * .85) moveEnemy(e, ux, uz, dt)
      if (d < e.range + .7 && e.attackCd <= 0) {
        damagePlayer(e.dmg)
        world.slash({ x: e.x, z: e.z }, Math.atan2(dz, dx), 0xff7088, 1.3, Math.PI * .55, .18)
        e.attackCd = e.attackInterval
      }
    }

    const r = enemyRadius(e)
    e.x = clamp(e.x, world.bounds.minX + r, world.bounds.maxX - r)
    e.z = clamp(e.z, world.bounds.minZ + r, world.bounds.maxZ - r)
    for (const o of world.obstacles) {
      const ox = e.x - o.x, oz = e.z - o.z
      const od = Math.hypot(ox, oz), min = o.r + r * .7
      if (od < min && od > .001) { e.x = o.x + ox / od * min; e.z = o.z + oz / od * min }
    }
    if (e.mesh) e.mesh.position.set(e.x, Math.sin(world.time * 4 + e.id) * .04, e.z)
  }

  // Soft separation so the chamber does not become a single pile of ghosts.
  for (let i = 0; i < state.enemies.length; i++) {
    const a = state.enemies[i]
    if (a.hp <= 0) continue
    for (let j = i + 1; j < state.enemies.length; j++) {
      const b = state.enemies[j]
      if (b.hp <= 0) continue
      const min = enemyRadius(a) + enemyRadius(b)
      const dx = b.x - a.x, dz = b.z - a.z
      const d = Math.hypot(dx, dz)
      if (d < min && d > .001) {
        const push = (min - d) * .5
        const ux = dx / d, uz = dz / d
        a.x -= ux * push; a.z -= uz * push
        b.x += ux * push; b.z += uz * push
      }
    }
  }
}

function moveEnemy(e, ux, uz, dt, mult = 1) {
  e.x += ux * e.speed * mult * dt
  e.z += uz * e.speed * mult * dt
}

function updateBoss(e, dt, d, ux, uz) {
  const run = state.run
  if (!run) return
  if (d > 4.2) moveEnemy(e, ux, uz, dt)
  else if (d < 2.3) moveEnemy(e, -ux, -uz, dt, .55)
  e.attackCd -= 0
  if (e.attackCd <= 0) {
    if (d < 3.4) {
      damagePlayer(e.dmg)
      world.slash({ x: e.x, z: e.z }, Math.atan2(uz, ux), 0xff9ab0, 3.2, Math.PI * .8, .28)
      e.attackCd = 1.5
    } else if (e.phase >= 2) {
      spawnBoltRing(e, e.phase >= 3 ? 9 : 6)
      e.attackCd = 2.2
    } else {
      const a = Math.atan2(uz, ux)
      for (let i = -1; i <= 1; i++) {
        const ang = a + i * .22
        spawnProjectile(e.x + Math.cos(ang) * 1.3, e.z + Math.sin(ang) * 1.3, Math.cos(ang), Math.sin(ang), false, {
          dmg: e.dmg * .75, speed: 7.2, color: 0xff5078, life: 3, radius: .26,
        })
      }
      e.attackCd = 2.4
    }
  }
  e.x = clamp(e.x, world.bounds.minX + e.radius, world.bounds.maxX - e.radius)
  e.z = clamp(e.z, world.bounds.minZ + e.radius, world.bounds.maxZ - e.radius)
  if (e.mesh) e.mesh.position.set(e.x, Math.sin(world.time * 2) * .08, e.z)
  if (run.bossPhase !== e.phase) run.bossPhase = e.phase
}

function spawnBoltRing(e, count) {
  const phase = Math.random() * TAU
  for (let i = 0; i < count; i++) {
    const a = phase + i / count * TAU
    spawnProjectile(e.x + Math.cos(a) * 1.5, e.z + Math.sin(a) * 1.5, Math.cos(a), Math.sin(a), false, {
      dmg: e.dmg * .7, speed: 6.2, color: 0xff5078, life: 3.4, radius: .24,
    })
  }
  audio.shoot()
}

function spawnProjectile(x, z, dx, dz, friendly, opts = {}) {
  const color = opts.color ?? (friendly ? 0xc9aaff : 0xff7088)
  const group = world.makeProjectile(color, opts.radius || .16, friendly)
  group.position.set(x, .92, z)
  const p = {
    group, x, z, vx: dx * (opts.speed || 10), vz: dz * (opts.speed || 10),
    life: opts.life || 2, friendly, dmg: opts.dmg || 10,
    pierce: opts.pierce || 0, hit: new Set(), radius: opts.radius || .2,
  }
  state.projectiles.push(p)
  return p
}

function updateProjectiles(dt) {
  const p = state.player
  const run = state.run
  if (!p || !run) return
  for (let i = state.projectiles.length - 1; i >= 0; i--) {
    const b = state.projectiles[i]
    b.x += b.vx * dt
    b.z += b.vz * dt
    b.life -= dt
    b.group.position.set(b.x, .92, b.z)
    b.group.rotation.y = Math.atan2(-b.vz, b.vx)
    let dead = b.life <= 0

    if (!dead && b.friendly) {
      for (const e of state.enemies) {
        if (e.hp <= 0 || b.hit.has(e.id)) continue
        if (dist(b.x, b.z, e.x, e.z) < b.radius + enemyRadius(e)) {
          b.hit.add(e.id)
          damageEnemy(e, b.dmg, 'ranged')
          if (p.stats.manaOnHit > 0) p.mana = Math.min(p.maxMana, p.mana + p.stats.manaOnHit)
          world.burst({ x: b.x, y: 1.2, z: b.z }, 0xc9aaff, 8, 2, .09, .4)
          if (b.pierce > 0) b.pierce--
          else { dead = true; break }
        }
      }
    } else if (!dead && !b.friendly) {
      if (dist(b.x, b.z, p.x, p.z) < .52 + b.radius) {
        damagePlayer(b.dmg)
        dead = true
      }
    }

    if (Math.abs(b.x) > Math.abs(world.bounds.maxX) + 4 || Math.abs(b.z) > Math.abs(world.bounds.maxZ) + 4) dead = true
    if (dead) {
      if (b.group.parent) b.group.parent.remove(b.group)
      state.projectiles.splice(i, 1)
    }
  }
}

function spawnPickup(type, x, z, amount) {
  const group = world.makePickup(type)
  group.position.set(x, .5, z)
  state.pickups.push({ group, x, z, type, amount, phase: Math.random() * TAU })
}

function updatePickups(dt) {
  const p = state.player
  const run = state.run
  if (!p || !run) return
  for (let i = state.pickups.length - 1; i >= 0; i--) {
    const it = state.pickups[i]
    it.group.position.set(it.x, .48 + Math.sin(world.time * 3 + it.phase) * .12, it.z)
    it.group.rotation.y += dt * 2
    if (dist(it.x, it.z, p.x, p.z) < 1.15) {
      if (it.type === 'health') {
        healPlayer(it.amount)
        audio.heal()
        world.floatText(`+${it.amount}`, { x: p.x, y: 2.2, z: p.z }, '#8effe6', 28)
      } else {
        const gain = Math.round(it.amount * p.stats.emberGain)
        run.embers += gain
        audio.pickup()
        world.floatText(`+${gain}`, { x: it.x, y: 1.5, z: it.z }, '#ffcf8a', 22)
      }
      if (it.group.parent) it.group.parent.remove(it.group)
      state.pickups.splice(i, 1)
      updateHUD()
    }
  }
}

// ---------------------------------------------------------------------------
// Interaction & HUD
// ---------------------------------------------------------------------------

function updateInteractables() {
  const p = state.player
  if (!p || state.overlay) { hidePrompt(); return }
  let best = null, bestD = Infinity
  for (const it of state.interactables) {
    if (it.used) continue
    const d = dist(p.x, p.z, it.x, it.z)
    if (d < it.r && d < bestD) { bestD = d; best = it }
  }
  state.near = best
  if (best) setPrompt(best.label)
  else hidePrompt()
}

function doInteract() {
  if (state.overlay) return
  if (state.mode === 'hub') {
    const it = state.near
    if (!it) return
    if (it.type === 'talk') openDialogue(it.charId)
    else if (it.type === 'hub-gate') startRun()
    return
  }
  if (state.mode === 'run') {
    const it = state.near
    if (!it) return
    if (it.type === 'gate') useGate(it)
  }
}

function updateHUD() {
  const p = state.player
  const run = state.run
  if (!p || !run) return
  const hpPct = clamp(p.hp / p.maxHp, 0, 1) * 100
  dom.hpFill.style.width = `${hpPct}%`
  dom.hpText.textContent = `${Math.max(0, Math.ceil(p.hp))} / ${p.maxHp}`
  dom.manaFill.style.width = `${clamp(p.mana / p.maxMana, 0, 1) * 100}%`
  dom.manaText.textContent = `${Math.floor(p.mana)}`
  dom.runEmbers.textContent = fmt(run.embers)
  dom.metaCinders.textContent = fmt(getSave().cinders)
  const bossRoom = run.room >= BOSS_ROOM
  dom.depthLabel.textContent = bossRoom ? 'THE HOLLOW CROWN' : DEPTH_NAMES[Math.min(DEPTH_NAMES.length - 1, run.room - 1)]
  const alive = state.enemies.filter(e => e.hp > 0).length
  if (run.boss && !run.cleared) {
    dom.roomObjective.textContent = `THE THRONE · PHASE ${roman(run.bossPhase)} · ${Math.ceil(Math.max(0, run.boss.hp))} VITALITY`
  } else if (!run.cleared) {
    dom.roomObjective.textContent = `CHAMBER ${roman(run.room)} · ${alive} FOE${alive === 1 ? '' : 'S'} REMAIN`
  } else {
    dom.roomObjective.textContent = 'THE CHAMBER YIELDS · CHOOSE A GATE'
  }
  const bossVisible = !!(run.boss && !run.cleared && run.boss.hp > 0)
  dom.bossWrap.classList.toggle('hidden', !bossVisible)
  if (bossVisible) {
    dom.bossName.textContent = 'THE GILDED WIDOW'
    dom.bossPhase.textContent = roman(run.bossPhase)
    dom.bossFill.style.width = `${clamp(run.boss.hp / run.boss.maxHp, 0, 1) * 100}%`
  }
  dom.cdMelee.style.transform = `scaleY(${clamp(p.meleeTimer / Math.max(.01, p.meleeMax), 0, 1)})`
  dom.cdRanged.style.transform = `scaleY(${clamp(p.rangedTimer / Math.max(.01, p.rangedMax), 0, 1)})`
  dom.cdDash.style.transform = `scaleY(${clamp(p.dashTimer / Math.max(.01, p.dashMax), 0, 1)})`
  dom.abRanged.classList.toggle('locked', p.mana < BOLT_COST)
  dom.boonRail.innerHTML = run.boons.map(id => {
    const b = BOON_MAP[id]
    if (!b) return ''
    return `<div class="boon-chip ${b.rarity}" title="${b.name} — ${b.desc}">${b.icon}<small>${b.name}</small></div>`
  }).join('')
  dom.bondRail.innerHTML = CHARACTER_ORDER.map(id => {
    const c = CHARACTERS[id]
    return `<div class="bond-chip"><i style="background:${c.color}"></i><b>${c.short[0]}</b>${bondLevel(id)}</div>`
  }).join('')
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

function update(dt) {
  state.elapsed += dt
  world.update(dt)

  if (state.mode === 'title') {
    world.cameraFollow({ x: 0, z: 0 }, dt)
    return
  }

  if (state.mode === 'hub') {
    if (!state.overlay && state.player) {
      movePlayer(dt)
      updateInteractables()
    } else hidePrompt()
    syncPlayerVisual(dt)
    const focus = state.player || { x: 0, z: 0 }
    world.cameraFollow(focus, dt)
    return
  }

  if (state.mode === 'run') {
    const run = state.run
    if (run && !state.overlay && !run.ending && !run.ended) {
      movePlayer(dt)
      updateEnemies(dt)
      updateProjectiles(dt)
      updatePickups(dt)
      updateInteractables()
      state.tensionClock -= dt
      if (state.tensionClock <= 0) {
        state.tensionClock = .8
        const alive = state.enemies.filter(e => e.hp > 0).length
        audio.setTension(run.boss ? .95 : clamp(.22 + alive * .07, 0, .8))
      }
    } else {
      hidePrompt()
      if (run && run.ending) {
        updateProjectiles(dt) // let the last sparks finish
      }
    }
    syncPlayerVisual(dt)
    const focus = state.player || { x: 0, z: 0 }
    world.cameraFollow(focus, dt)
    if (state.player) updateHUD()
    return
  }

  if (state.mode === 'result') {
    const focus = state.player || { x: 0, z: 0 }
    world.cameraFollow(focus, dt)
    return
  }
}

function loop(now) {
  const raw = (now - state.lastTime) / 1000
  state.lastTime = now
  const dt = clamp(raw || .016, .001, .05)
  update(dt)
  world.render()
  requestAnimationFrame(loop)
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

function actionFor(action) {
  switch (action) {
    case 'enter-hub': audio.unlock(); enterHub(); break
    case 'open-gallery': openGallery(); break
    case 'open-controls': openOverlay('screen-controls'); break
    case 'open-shop': openShop('hub'); break
    case 'to-title': {
      if (state.mode === 'run' && state.run && !state.run.ended) finishRun(false, { silent: true })
      else enterTitle()
      break
    }
    case 'close-gallery':
    case 'close-shop':
    case 'close-controls':
    case 'resume': closeOverlay(); break
    case 'abandon-run': finishRun(false); break
    case 'return-hub': enterHub(); break
    case 'retry-run': startRun(); break
    case 'skip-boons': skipBoons(); break
    default: break
  }
}

function bindEvents() {
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]')
    if (!el) return
    e.preventDefault()
    audio.click()
    actionFor(el.dataset.action)
  })

  // Ability buttons
  dom.abMelee?.addEventListener('click', tryMelee)
  dom.abRanged?.addEventListener('click', tryRanged)
  dom.abDash?.addEventListener('click', tryDash)
  dom.btnPause?.addEventListener('click', openPause)
  dom.dialogueClose?.addEventListener('click', closeDialogue)
  $('art-modal-close')?.addEventListener('click', () => dom.artModal.classList.remove('active'))
  dom.artModal?.addEventListener('click', e => { if (e.target === dom.artModal) dom.artModal.classList.remove('active') })
  $('gallery-expand')?.addEventListener('click', () => {})

  window.addEventListener('pointerdown', () => {
    audio.unlock()
    audio.setMuted(!!getSave().settings.muted)
  }, { once: true })

  window.addEventListener('pointermove', e => {
    state.pointer.x = e.clientX
    state.pointer.y = e.clientY
    state.pointer.active = true
  }, { passive: true })

  dom.canvas.addEventListener('contextmenu', e => e.preventDefault())
  dom.canvas.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return
    audio.unlock()
    if (e.button === 0) tryMelee()
    else if (e.button === 2) tryRanged()
  })

  window.addEventListener('keydown', e => {
    audio.unlock()
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault()
    if (e.code === 'KeyM') {
      const s = getSave()
      s.settings.muted = !s.settings.muted
      audio.setMuted(s.settings.muted)
      commit()
      toast(s.settings.muted ? 'SOUND MUTED' : 'SOUND RESTORED', 'Press M any time.', '')
      return
    }
    if (e.repeat) {
      if (!['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) return
    }
    state.keys.add(e.code)
    if (e.code === 'Escape') {
      if (dom.artModal?.classList.contains('active')) { dom.artModal.classList.remove('active'); audio.back(); return }
      if (state.overlay === 'screen-gallery' || state.overlay === 'screen-shop' || state.overlay === 'screen-controls' || state.overlay === 'screen-dialogue') { closeOverlay(); return }
      if (state.overlay === 'screen-pause') { closeOverlay(); return }
      if (!state.overlay && state.mode === 'run' && !state.run?.ending) { openPause(); return }
      return
    }
    if (state.overlay) return
    if (e.code === 'KeyE') { doInteract(); return }
    if (e.code === 'Space') { tryDash(); return }
  })

  window.addEventListener('keyup', e => { state.keys.delete(e.code) })
  window.addEventListener('blur', () => state.keys.clear())

  // Touch joystick
  if (dom.joystick) {
    const moveStick = ev => {
      const rect = dom.joystick.getBoundingClientRect()
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2
      let dx = ev.clientX - cx, dy = ev.clientY - cy
      const max = rect.width * .33
      const len = Math.hypot(dx, dy)
      if (len > max) { dx = dx / len * max; dy = dy / len * max }
      state.touch.x = dx / max
      state.touch.y = dy / max
      if (dom.stick) dom.stick.style.transform = `translate(${dx}px, ${dy}px)`
    }
    const endStick = () => {
      state.touch.x = 0; state.touch.y = 0
      if (dom.stick) dom.stick.style.transform = ''
    }
    dom.joystick.addEventListener('pointerdown', ev => {
      ev.preventDefault()
      state.touch.id = ev.pointerId
      dom.joystick.setPointerCapture?.(ev.pointerId)
      moveStick(ev)
    })
    dom.joystick.addEventListener('pointermove', ev => {
      if (state.touch.id !== ev.pointerId) return
      ev.preventDefault()
      moveStick(ev)
    })
    dom.joystick.addEventListener('pointerup', endStick)
    dom.joystick.addEventListener('pointercancel', endStick)
  }

  $$('[data-touch]').forEach(btn => {
    btn.addEventListener('pointerdown', ev => {
      ev.preventDefault(); ev.stopPropagation()
      audio.unlock()
      const t = btn.dataset.touch
      if (t === 'melee') tryMelee()
      else if (t === 'ranged') tryRanged()
      else if (t === 'dash') tryDash()
      else if (t === 'interact') doInteract()
    })
  })
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function boot() {
  loadSave()
  setImage(dom.hudPortrait, 'vesper', 'portrait')
  dom.hudName.textContent = 'VESPER · EMBER WARDEN'
  bindEvents()
  if (isTouch) document.body.classList.add('touch')
  enterTitle()
  requestAnimationFrame(loop)
  setTimeout(() => dom.loading?.classList.add('done'), 650)
  // Expose a tiny read-only surface for debugging in the console.
  window.__EMBERWAKE__ = {
    get state() { return state },
    get save() { return getSave() },
    startRun, enterHub, enterTitle, openDialogue, openGallery, openShop, openPause,
  }
}

boot()
