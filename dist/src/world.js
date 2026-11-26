import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { CHARACTERS } from './data.js'
import { imageSrc, makePlaceholder } from './art.js'

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)
const pick = a => a[Math.floor(Math.random() * a.length)]
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const x = c.getContext('2d'); draw(x, w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

let _tex = null
function textures() {
  if (_tex) return _tex
  _tex = {}
  const stoneBase = ['#1b1524', '#211a2b', '#17111f']
  _tex.stone = canvasTexture(512, 512, (x, w, h) => {
    x.fillStyle = '#171220'; x.fillRect(0, 0, w, h)
    for (let row = 0; row < 8; row++) {
      const bh = h / 8
      for (let col = -1; col < 5; col++) {
        const bw = w / 4
        const ox = (row % 2) * bw / 2
        const px = col * bw + ox, py = row * bh
        x.fillStyle = pick(stoneBase)
        x.fillRect(px + 2, py + 2, bw - 4, bh - 4)
        x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 1; x.strokeRect(px + 2, py + 2, bw - 4, bh - 4)
        x.fillStyle = 'rgba(255,255,255,.025)'; x.fillRect(px + 5, py + 4, bw - 10, 2)
      }
    }
    for (let i = 0; i < 180; i++) { x.fillStyle = `rgba(${Math.random() > .5 ? '255,255,255' : '0,0,0'},${rand(.01, .06)})`; x.fillRect(rand(0, w), rand(0, h), rand(1, 5), rand(1, 3)) }
    x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 1.2
    for (let i = 0; i < 8; i++) { x.beginPath(); let px = rand(0, w), py = rand(0, h); x.moveTo(px, py); for (let j = 0; j < 4; j++) { px += rand(-26, 26); py += rand(8, 30); x.lineTo(px, py) } x.stroke() }
  })
  _tex.stone.wrapS = _tex.stone.wrapT = THREE.RepeatWrapping
  _tex.stone.repeat.set(3, 3)
  _tex.floor = canvasTexture(512, 512, (x, w, h) => {
    x.fillStyle = '#120d18'; x.fillRect(0, 0, w, h)
    const n = 4, s = w / n
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      x.fillStyle = (i + j) % 2 ? '#17111f' : '#1b1424'
      x.fillRect(i * s + 2, j * s + 2, s - 4, s - 4)
      x.strokeStyle = 'rgba(217,185,120,.06)'; x.strokeRect(i * s + 5, j * s + 5, s - 10, s - 10)
    }
    x.strokeStyle = 'rgba(217,185,120,.12)'; x.lineWidth = 1.5
    x.beginPath(); x.moveTo(0, h / 2); x.lineTo(w, h / 2); x.moveTo(w / 2, 0); x.lineTo(w / 2, h); x.stroke()
    for (let i = 0; i < 200; i++) { x.fillStyle = `rgba(255,255,255,${rand(.005, .03)})`; x.fillRect(rand(0, w), rand(0, h), rand(1, 3), rand(1, 2)) }
    x.strokeStyle = 'rgba(217,185,120,.07)'; x.lineWidth = 1
    for (let i = 0; i < 10; i++) { x.beginPath(); let px = rand(0, w), py = rand(0, h); x.moveTo(px, py); for (let j = 0; j < 5; j++) { px += rand(-30, 30); py += rand(-18, 18); x.lineTo(px, py) } x.stroke() }
  })
  _tex.floor.wrapS = _tex.floor.wrapT = THREE.RepeatWrapping
  _tex.floor.repeat.set(5, 4)
  _tex.carpet = canvasTexture(512, 768, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#4a1029'); g.addColorStop(.5, '#711a36'); g.addColorStop(1, '#3b0c22')
    x.fillStyle = g; x.fillRect(0, 0, w, h)
    x.strokeStyle = '#c9a45f'; x.lineWidth = 12; x.strokeRect(18, 18, w - 36, h - 36)
    x.strokeStyle = 'rgba(233,204,141,.7)'; x.lineWidth = 3; x.strokeRect(38, 38, w - 76, h - 76)
    x.strokeStyle = 'rgba(233,204,141,.35)'; x.lineWidth = 2
    for (let i = 0; i < 8; i++) { x.beginPath(); x.arc(w / 2, h / 2, 60 + i * 26, 0, TAU); x.stroke() }
    x.strokeStyle = 'rgba(233,204,141,.25)'; x.lineWidth = 1.5
    for (let i = 0; i < 20; i++) { x.beginPath(); x.moveTo(rand(50, w - 50), rand(50, h - 50)); x.lineTo(rand(50, w - 50), rand(50, h - 50)); x.stroke() }
  })
  _tex.stained = canvasTexture(512, 1024, (x, w, h) => {
    x.clearRect(0, 0, w, h)
    const cx = w / 2
    x.save(); x.beginPath(); x.moveTo(20, h - 20); x.lineTo(20, h * .3); x.quadraticCurveTo(20, 20, cx, 20); x.quadraticCurveTo(w - 20, 20, w - 20, h * .3); x.lineTo(w - 20, h - 20); x.closePath(); x.clip()
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#2a0a3a'); g.addColorStop(.5, '#120626'); g.addColorStop(1, '#06030c')
    x.fillStyle = g; x.fillRect(0, 0, w, h)
    const cols = ['#b47cff', '#e0365c', '#f0c06a', '#2a7d8f', '#6f35b8', '#ff8a5c']
    for (let i = 0; i < 26; i++) {
      x.fillStyle = pick(cols); x.globalAlpha = rand(.12, .38)
      x.beginPath(); x.ellipse(rand(0, w), rand(0, h), rand(20, 90), rand(20, 90), rand(0, TAU), 0, TAU); x.fill()
    }
    x.globalAlpha = 1
    x.strokeStyle = 'rgba(5,3,8,.85)'; x.lineWidth = 7
    x.beginPath(); x.moveTo(cx, 20); x.lineTo(cx, h - 20); x.stroke()
    for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(20, h * .32 + i * h * .13); x.lineTo(w - 20, h * .32 + i * h * .13); x.stroke() }
    x.lineWidth = 4
    x.beginPath(); x.arc(cx, h * .24, 105, 0, TAU); x.stroke()
    x.beginPath(); x.arc(cx, h * .24, 58, 0, TAU); x.stroke()
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; x.beginPath(); x.moveTo(cx + Math.cos(a) * 58, h * .24 + Math.sin(a) * 58); x.lineTo(cx + Math.cos(a) * 105, h * .24 + Math.sin(a) * 105); x.stroke() }
    for (let i = 0; i < 16; i++) { x.beginPath(); x.arc(cx + Math.cos(i / 16 * TAU) * 78, h * .24 + Math.sin(i / 16 * TAU) * 78, 8, 0, TAU); x.fillStyle = pick(cols); x.globalAlpha = .5; x.fill() }
    x.globalAlpha = 1
    x.strokeStyle = 'rgba(240,230,216,.2)'; x.lineWidth = 2
    for (let i = 0; i < 12; i++) { x.beginPath(); x.moveTo(rand(20, w - 20), rand(h * .4, h - 20)); x.lineTo(rand(20, w - 20), rand(h * .4, h - 20)); x.stroke() }
    x.restore()
    x.globalCompositeOperation = 'destination-in'
    x.beginPath(); x.moveTo(20, h - 20); x.lineTo(20, h * .3); x.quadraticCurveTo(20, 20, cx, 20); x.quadraticCurveTo(w - 20, 20, w - 20, h * .3); x.lineTo(w - 20, h - 20); x.closePath(); x.fill()
  })
  _tex.carpet.wrapS = _tex.carpet.wrapT = THREE.ClampToEdgeWrapping
  _tex.rune = canvasTexture(256, 256, (x, w, h) => {
    x.clearRect(0, 0, w, h); x.strokeStyle = 'rgba(240,220,180,.75)'; x.lineWidth = 3
    x.beginPath(); x.arc(128, 128, 104, 0, TAU); x.stroke()
    x.beginPath(); x.arc(128, 128, 82, 0, TAU); x.stroke()
    x.beginPath(); x.arc(128, 128, 44, 0, TAU); x.stroke()
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; x.beginPath(); x.moveTo(128 + Math.cos(a) * 46, 128 + Math.sin(a) * 46); x.lineTo(128 + Math.cos(a) * 102, 128 + Math.sin(a) * 102); x.stroke(); x.beginPath(); x.arc(128 + Math.cos(a) * 94, 128 + Math.sin(a) * 94, 5, 0, TAU); x.stroke() }
    x.beginPath(); x.moveTo(128, 40); x.lineTo(160, 112); x.lineTo(128, 216); x.lineTo(96, 112); x.closePath(); x.stroke()
  })
  _tex.glow = canvasTexture(128, 128, (x, w, h) => {
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,220,170,.75)'); g.addColorStop(1, 'rgba(255,140,80,0)')
    x.fillStyle = g; x.fillRect(0, 0, w, h)
  })
  _tex.banner = canvasTexture(256, 512, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#570f2b'); g.addColorStop(.5, '#2e0718'); g.addColorStop(1, '#14040c')
    x.fillStyle = g; x.fillRect(0, 0, w, h)
    x.fillStyle = 'rgba(217,185,120,.75)'; x.fillRect(14, 0, 4, h); x.fillRect(w - 18, 0, 4, h)
    x.strokeStyle = 'rgba(233,204,141,.7)'; x.lineWidth = 4
    x.beginPath(); x.arc(w / 2, h * .3, 52, 0, TAU); x.stroke(); x.beginPath(); x.moveTo(w / 2, h * .2); x.lineTo(w / 2, h * .42); x.moveTo(w / 2 - 30, h * .31); x.lineTo(w / 2 + 30, h * .31); x.stroke()
    x.beginPath(); x.moveTo(w / 2 - 40, h * .62); x.quadraticCurveTo(w / 2, h * .48, w / 2 + 40, h * .62); x.quadraticCurveTo(w / 2, h * .56, w / 2 - 40, h * .62); x.fillStyle = 'rgba(233,204,141,.5)'; x.fill()
    x.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 20; i++) x.fillRect(rand(20, w - 20), rand(0, h), 2, rand(12, 60))
  })
  return _tex
}

const loader = new THREE.TextureLoader()
const texCache = new Map()
export function chibiTexture(charId) {
  if (texCache.has(charId)) return texCache.get(charId)
  const url = imageSrc(charId, 'chibi')
  const tex = loader.load(url, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4 },
    undefined,
    () => {
      const c = document.createElement('canvas'); c.width = 256; c.height = 320
      const x = c.getContext('2d'); const col = CHARACTERS[charId]?.color || '#b47cff'
      const g = x.createRadialGradient(128, 120, 10, 128, 140, 150); g.addColorStop(0, col); g.addColorStop(1, 'rgba(10,6,16,0)')
      x.fillStyle = g; x.fillRect(0, 0, 256, 320); x.fillStyle = '#0b0710'; x.beginPath(); x.arc(128, 92, 54, 0, TAU); x.fill()
      x.fillStyle = 'rgba(240,230,216,.8)'; x.font = '28px Georgia'; x.textAlign = 'center'; x.fillText((CHARACTERS[charId]?.name || '?')[0], 128, 102)
      tex.image = c; tex.needsUpdate = true
    })
  tex.colorSpace = THREE.SRGBColorSpace
  texCache.set(charId, tex)
  return tex
}

export class World {
  constructor(canvas) {
    this.canvas = canvas
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x06040a)
    this.scene.fog = new THREE.FogExp2(0x06040a, .027)
    this.camera = new THREE.PerspectiveCamera(44, 1, .1, 160)
    this.camera.position.set(18, 22, 18)
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.18
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.composer = new EffectComposer(this.renderer)
    this.renderPass = new RenderPass(this.scene, this.camera)
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), .82, .55, .62)
    this.composer.addPass(this.renderPass)
    this.composer.addPass(this.bloom)
    this.composer.addPass(new OutputPass())
    this.clock = new THREE.Clock()
    this.time = 0
    this.mode = 'title'
    this.roomGroup = new THREE.Group(); this.scene.add(this.roomGroup)
    this.fxGroup = new THREE.Group(); this.scene.add(this.fxGroup)
    this.entityGroup = new THREE.Group(); this.scene.add(this.entityGroup)
    this.braziers = []
    this.portals = []
    this.slashes = []
    this.bursts = []
    this.floaters = []
    this.ghosts = []
    this.obstacles = []
    this.bounds = { minX: -14, maxX: 14, minZ: -12, maxZ: 12 }
    this.cameraTarget = new THREE.Vector3(0, 1, 0)
    this.cameraDesired = new THREE.Vector3(18, 22, 18)
    this.shakeAmount = 0
    this.cameraPunch = new THREE.Vector3()
    this.playerLight = new THREE.PointLight(0xffb078, 20, 11, 2); this.playerLight.position.set(0, 3, 0); this.scene.add(this.playerLight)
    this.orbitAngle = 0
    this.resize()
    window.addEventListener('resize', () => this.resize())
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
    this.composer.setSize(w, h)
    this.bloom.resolution.set(w, h)
  }

  setMode(mode) { this.mode = mode; this.orbitAngle = 0 }

  clearRoom() {
    const dispose = obj => {
      obj.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          for (const m of mats) { if (m.map && !Object.values(textures()).includes(m.map) && ![...texCache.values()].includes(m.map)) m.map.dispose(); m.dispose() }
        }
      })
    }
    dispose(this.roomGroup)
    this.roomGroup.clear()
    dispose(this.entityGroup)
    this.entityGroup.clear()
    for (const b of this.braziers) if (b.light) this.scene.remove(b.light)
    this.braziers = []
    this.portals = []
    this.obstacles = []
    for (const s of this.slashes) this.fxGroup.remove(s.mesh)
    this.slashes = []
    for (const b of this.bursts) this.fxGroup.remove(b.points)
    this.bursts = []
    for (const f of this.floaters) this.fxGroup.remove(f.sprite)
    this.floaters = []
    for (const g of this.ghosts) this.fxGroup.remove(g.sprite)
    this.ghosts = []
    // remove every room light except the player's lantern
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const o = this.scene.children[i]
      if (o.isLight && o !== this.playerLight) this.scene.remove(o)
    }
    this.bossRing = null
  }

  setPlayerLight(x, y, z) { this.playerLight.position.set(x, y + 2.2, z) }

  buildRoom({ hub = false, depth = 1, seed = Math.random(), roomName = '' } = {}) {
    this.clearRoom()
    this.obstacles = []
    const T = textures()
    const rng = mulberry32(Math.floor(seed * 1e9))
    const w = hub ? 30 : 26 + Math.floor(rng() * 5)
    const d = hub ? 26 : 22 + Math.floor(rng() * 5)
    this.bounds = { minX: -w / 2 + 1.3, maxX: w / 2 - 1.3, minZ: -d / 2 + 1.3, maxZ: d / 2 - 1.3, w, d }
    const g = this.roomGroup
    const stoneMat = new THREE.MeshStandardMaterial({ map: T.stone, color: 0x9d8bb0, roughness: .88, metalness: .12 })
    const stoneDark = new THREE.MeshStandardMaterial({ map: T.stone, color: 0x6d5d80, roughness: .92 })
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd9b978, roughness: .3, metalness: .8, emissive: 0x3a2608, emissiveIntensity: .4 })
    const floorMat = new THREE.MeshStandardMaterial({ map: T.floor, color: 0xa898b8, roughness: .72, metalness: .16 })
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w + 2, d + 2), floorMat)
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; floor.position.y = 0
    g.add(floor)
    // gold inlay border
    const border = new THREE.Mesh(new THREE.RingGeometry(0, 1, 4), new THREE.MeshBasicMaterial({ color: 0xd9b978, transparent: true, opacity: .18, side: THREE.DoubleSide }))
    border.rotation.x = -Math.PI / 2; border.scale.set(w * .44, d * .38, 1); border.position.y = .012
    g.add(border)
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(hub ? 7 : 5.5, hub ? 17 : 12), new THREE.MeshStandardMaterial({ map: T.carpet, roughness: .95, color: 0xc9b3c9 }))
    rug.rotation.x = -Math.PI / 2; rug.position.set(0, .018, hub ? 1 : 0.5); rug.receiveShadow = true
    g.add(rug)
    // walls
    const wallH = 4.8
    const wall = (x, z, sw, sd, rot = 0, h = wallH, mat = stoneMat) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(sw, h, sd), mat)
      m.position.set(x, h / 2, z); m.rotation.y = rot; m.castShadow = true; m.receiveShadow = true; g.add(m); return m
    }
    wall(0, -d / 2 - .3, w + 1.2, .7)
    wall(-w / 2 - .3, 0, .7, d + 1.2)
    wall(0, d / 2 + .3, w + 1.2, .5, 0, .9, stoneDark)
    wall(w / 2 + .3, 0, .5, d + 1.2, 0, .9, stoneDark)
    // wall trim
    for (const s of [-1, 1]) {
      const trim = new THREE.Mesh(new THREE.BoxGeometry(w + 1, .16, .12), goldMat)
      trim.position.set(0, 2.6, -d / 2 + .06); g.add(trim)
    }
    // columns
    const colPositions = hub
      ? [[-w / 2 + 2.4, -d / 2 + 2.4], [w / 2 - 2.4, -d / 2 + 2.4], [-w / 2 + 2.4, d / 2 - 2.4], [w / 2 - 2.4, d / 2 - 2.4], [-9, -2], [9, -2]]
      : [[-w / 2 + 2.8, -d / 2 + 2.8], [w / 2 - 2.8, -d / 2 + 2.8], [-w / 2 + 2.8, d / 2 - 2.8], [w / 2 - 2.8, d / 2 - 2.8], [rng() > .5 ? -7 : 7, rng() > .5 ? -2 : 3]]
    for (const [px, pz] of colPositions) this.addColumn(px, pz, stoneMat, goldMat, stoneDark)
    // stained glass windows on back wall
    const winCount = hub ? 3 : 2 + Math.floor(rng() * 2)
    for (let i = 0; i < winCount; i++) {
      const x = (i - (winCount - 1) / 2) * (w / (winCount + .6))
      this.addWindow(x, -d / 2 - .02, 3.3, 6.4, i)
    }
    // arches on side wall
    for (let i = 0; i < 2; i++) {
      const z = (i - .5) * d * .38
      const arch = new THREE.Mesh(new THREE.BoxGeometry(.35, 3.6, 2.4), stoneDark)
      arch.position.set(-w / 2 + .35, 1.8, z); g.add(arch)
    }
    // banners
    for (const [bx, bz, rot] of [[-w / 2 + .5, -2.6, Math.PI / 2], [w / 2 - .5, 2.6, -Math.PI / 2]]) {
      const b = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 4.2), new THREE.MeshStandardMaterial({ map: T.banner, transparent: true, side: THREE.DoubleSide, roughness: .9, color: 0xd9c4d4 }))
      b.position.set(bx, 3.1, bz); b.rotation.y = rot; g.add(b)
    }
    // braziers
    const brazierSpots = hub ? [[-w / 2 + 2, 1], [w / 2 - 2, -3], [-5, d / 2 - 2.2], [6, d / 2 - 2.2]] : [[-w / 2 + 3, -d / 2 + 4], [w / 2 - 3, -d / 2 + 4], [-w / 2 + 3, d / 2 - 3], [w / 2 - 3, d / 2 - 3]]
    brazierSpots.forEach(([x, z], i) => this.addBrazier(x, z, i))
    // candles
    for (let i = 0; i < (hub ? 14 : 8); i++) {
      const cx = rand(this.bounds.minX + 1, this.bounds.maxX - 1), cz = rand(this.bounds.minZ + 1, this.bounds.maxZ - 1)
      if (Math.abs(cx) < 3 && Math.abs(cz) < 3) continue
      this.addCandle(cx, cz)
    }
    // props
    const obstacleSpots = []
    if (!hub) {
      const propCount = 3 + Math.floor(rng() * 3)
      for (let i = 0; i < propCount; i++) {
        const type = rng() < .35 ? 'pew' : rng() < .5 ? 'statue' : 'rubble'
        const px = rand(this.bounds.minX + 3, this.bounds.maxX - 3), pz = rand(this.bounds.minZ + 3, this.bounds.maxZ - 3)
        if (Math.hypot(px, pz) < 5) continue
        if (type === 'pew') { this.addPew(px, pz, rand(0, TAU), stoneDark); obstacleSpots.push({ x: px, z: pz, r: 1.1 }) }
        else if (type === 'statue') { this.addStatue(px, pz, stoneMat, stoneDark); obstacleSpots.push({ x: px, z: pz, r: .8 }) }
        else this.addRubble(px, pz)
      }
    } else {
      // hub furnishings
      this.addPew(-9, 7, .1, stoneDark); this.addPew(9, 8, -.1, stoneDark)
      this.addStatue(-12, -6, stoneMat, stoneDark); this.addStatue(12, -6, stoneMat, stoneDark)
      this.addRubble(rand(-8, 8), rand(6, 9))
      // gallery frame
      const frame = new THREE.Group()
      const fr = new THREE.Mesh(new THREE.BoxGeometry(4.2, 5.4, .3), goldMat); frame.add(fr)
      const canvasArt = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 4.8), new THREE.MeshBasicMaterial({ map: T.stained, transparent: true, opacity: .8 }))
      canvasArt.position.z = .18; frame.add(canvasArt)
      frame.position.set(-w / 2 + .8, 3.2, 3.4); frame.rotation.y = Math.PI / 2; g.add(frame)
    }
    // dust particles
    this.addDust(w, d)
    // lights
    this.addRoomLights(hub, w, d)
    return { width: w, depth: d, bounds: this.bounds, obstacles: this.obstacles, gates: [], seats: colPositions }
  }

  addColumn(x, z, mat, gold, dark) {
    const g = new THREE.Group()
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.85, 1, .5, 8), mat); base.position.y = .25; base.castShadow = true; base.receiveShadow = true; g.add(base)
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.55, .65, 3.8, 10), mat); shaft.position.y = 2.4; shaft.castShadow = true; g.add(shaft)
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(.9, .6, .35, 8), mat); cap.position.y = 4.45; cap.castShadow = true; g.add(cap)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.7, .05, 6, 18), gold); ring.rotation.x = Math.PI / 2; ring.position.y = 4.1; g.add(ring)
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(.75, .035, 5, 18), gold); ring2.rotation.x = Math.PI / 2; ring2.position.y = .6; g.add(ring2)
    for (let i = 0; i < 4; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(.08, 3.6, .12), gold); s.position.set(Math.cos(i / 4 * TAU) * .56, 2.4, Math.sin(i / 4 * TAU) * .56); g.add(s) }
    g.position.set(x, 0, z); this.roomGroup.add(g)
    this.obstacles.push({ x, z, r: .9 })
  }

  addWindow(x, z, w, h, i) {
    const T = textures()
    const mat = new THREE.MeshBasicMaterial({ map: T.stained.clone(), transparent: true, opacity: .9, color: new THREE.Color().setHSL(.73 + i * .06, .5, .62), blending: THREE.AdditiveBlending, depthWrite: false })
    mat.map.repeat.set(1, 1)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat)
    mesh.position.set(x, 2.9, z + .03); this.roomGroup.add(mesh)
    const glow = new THREE.PointLight(i % 2 ? 0x9a6bff : 0xff7c9a, 7, 10, 2); glow.position.set(x, 2.5, z + 1.5); this.scene.add(glow)
    const frame = new THREE.Mesh(new THREE.BoxGeometry(w + .4, h + .4, .12), new THREE.MeshStandardMaterial({ color: 0x201326, roughness: .8 }))
    frame.position.set(x, 2.9, z - .02); this.roomGroup.add(frame)
    const beam = new THREE.Mesh(new THREE.ConeGeometry(w * .62, 10, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0x9a6bff, transparent: true, opacity: .035, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }))
    beam.position.set(x, 4.2, z + 4); beam.rotation.x = -.32; this.roomGroup.add(beam)
  }

  addBrazier(x, z, i) {
    const g = new THREE.Group()
    const metal = new THREE.MeshStandardMaterial({ color: 0x3b2b2f, metalness: .8, roughness: .35 })
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(.16, .3, 1.1, 6), metal); stand.position.y = .55; stand.castShadow = true; g.add(stand)
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.58, .32, .36, 12), metal); bowl.position.y = 1.17; bowl.castShadow = true; g.add(bowl)
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xff8a3c, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false })
    const fire = new THREE.Mesh(new THREE.IcosahedronGeometry(.36, 1), fireMat); fire.position.y = 1.42; g.add(fire)
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.18, 1), new THREE.MeshBasicMaterial({ color: 0xfff0c4 })); core.position.y = 1.5; g.add(core)
    const light = new THREE.PointLight(0xff8a3c, 11, 12, 2); light.position.set(0, 2.1, 0); light.castShadow = i < 2; g.add(light)
    g.position.set(x, 0, z); this.roomGroup.add(g)
    this.braziers.push({ group: g, fire, core, light, base: 11, phase: Math.random() * 10 })
    this.obstacles.push({ x, z, r: .55 })
  }

  addCandle(x, z) {
    const g = new THREE.Group()
    const wax = new THREE.Mesh(new THREE.CylinderGeometry(.045, .06, .38, 6), new THREE.MeshStandardMaterial({ color: 0xcbb99c, roughness: .8, emissive: 0x3a2410, emissiveIntensity: .3 }))
    wax.position.y = .19; g.add(wax)
    const flame = new THREE.Mesh(new THREE.SphereGeometry(.055, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffcc7a })); flame.position.y = .44; flame.scale.y = 1.8; g.add(flame)
    const light = new THREE.PointLight(0xffb15c, 2.2, 4, 2); light.position.y = .5; g.add(light)
    g.position.set(x, 0, z); this.roomGroup.add(g)
    this.braziers.push({ group: g, fire: flame, core: flame, light, base: 2, phase: Math.random() * 10, candle: true })
  }

  addPew(x, z, rot, mat) {
    const g = new THREE.Group()
    const wood = new THREE.MeshStandardMaterial({ color: 0x2a1820, roughness: .82 })
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.6, .16, .7), wood); seat.position.y = .55; seat.castShadow = true; g.add(seat)
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.6, .9, .12), wood); back.position.set(0, .95, -.32); back.castShadow = true; g.add(back)
    for (const sx of [-1, 1]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(.15, .55, .6), wood); leg.position.set(sx * 1.1, .27, 0); g.add(leg) }
    const trim = new THREE.Mesh(new THREE.BoxGeometry(2.65, .05, .05), new THREE.MeshStandardMaterial({ color: 0x8a6a3a, metalness: .5, roughness: .5 })); trim.position.set(0, 1.4, -.32); g.add(trim)
    g.position.set(x, 0, z); g.rotation.y = rot; this.roomGroup.add(g)
  }

  addStatue(x, z, mat, dark) {
    const g = new THREE.Group()
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.2, .7, 1.2), dark); plinth.position.y = .35; plinth.castShadow = true; g.add(plinth)
    const body = new THREE.Mesh(new THREE.ConeGeometry(.55, 1.8, 7), mat); body.position.y = 1.6; body.castShadow = true; g.add(body)
    const head = new THREE.Mesh(new THREE.SphereGeometry(.28, 8, 8), mat); head.position.y = 2.65; head.castShadow = true; g.add(head)
    const sword = new THREE.Mesh(new THREE.BoxGeometry(.06, 1.5, .06), new THREE.MeshStandardMaterial({ color: 0x7a758b, metalness: .7, roughness: .4 })); sword.position.set(.42, 1.75, .1); sword.rotation.z = -.15; g.add(sword)
    g.position.set(x, 0, z); g.rotation.y = rand(0, TAU); this.roomGroup.add(g)
  }

  addRubble(x, z) {
    for (let i = 0; i < 6; i++) {
      const s = rand(.15, .45)
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), new THREE.MeshStandardMaterial({ color: 0x2a2233, roughness: .95 }))
      m.position.set(x + rand(-.8, .8), s * .4, z + rand(-.8, .8)); m.rotation.set(rand(0, 3), rand(0, 3), rand(0, 3)); m.castShadow = true; this.roomGroup.add(m)
    }
  }

  addDust(w, d) {
    const count = 130, pos = new Float32Array(count * 3), vel = new Float32Array(count)
    for (let i = 0; i < count; i++) { pos[i * 3] = rand(-w / 2, w / 2); pos[i * 3 + 1] = rand(.4, 5.5); pos[i * 3 + 2] = rand(-d / 2, d / 2); vel[i] = rand(.05, .22) }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({ color: 0xf0d6b0, size: .035, transparent: true, opacity: .34, blending: THREE.AdditiveBlending, depthWrite: false })
    const pts = new THREE.Points(geo, mat); pts.userData = { vel }; this.roomGroup.add(pts); this.dust = pts
  }

  addRoomLights(hub, w, d) {
    this.scene.add(new THREE.AmbientLight(hub ? 0x4b3358 : 0x3b2b52, hub ? .8 : 1.5))
    const hemi = new THREE.HemisphereLight(hub ? 0xb99ad9 : 0x8a76c8, 0x0a0610, hub ? .8 : .72); this.scene.add(hemi)
    const moon = new THREE.DirectionalLight(hub ? 0xffd2a1 : 0x9a8cff, hub ? 1.3 : 2.2)
    moon.position.set(-8, 16, -10); moon.castShadow = true
    moon.shadow.mapSize.set(1024, 1024); moon.shadow.camera.left = -18; moon.shadow.camera.right = 18; moon.shadow.camera.top = 18; moon.shadow.camera.bottom = -18; moon.shadow.camera.near = 1; moon.shadow.camera.far = 50
    moon.shadow.bias = -.001
    this.scene.add(moon)
    const fill = new THREE.PointLight(hub ? 0xff9a5a : 0xc04a7a, hub ? 9 : 14, 34, 1.5); fill.position.set(0, 7, 3); this.scene.add(fill)
  }

  addChibi(charId, x, z, opts = {}) {
    const tex = chibiTexture(charId)
    const h = opts.height || 2.7
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, alphaTest: .02, depthWrite: true, color: opts.color || 0xffffff })
    const sprite = new THREE.Sprite(mat)
    sprite.scale.set(h * .8, h, 1)
    sprite.position.set(x, h / 2 + .16, z)
    sprite.center.set(.5, .5)
    this.entityGroup.add(sprite)
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(.55, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .4, depthWrite: false }))
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(x, .015, z); this.entityGroup.add(shadow)
    const ring = opts.ring === false ? null : new THREE.Mesh(new THREE.RingGeometry(.52, .6, 24), new THREE.MeshBasicMaterial({ color: opts.ringColor || 0xd9b978, transparent: true, opacity: .22, side: THREE.DoubleSide, depthWrite: false }))
    if (ring) { ring.rotation.x = -Math.PI / 2; ring.position.set(x, .02, z); this.entityGroup.add(ring) }
    return { sprite, shadow, ring, height: h, baseY: h / 2 + .16, flash: 0 }
  }

  addLabelSprite(text, x, y, z, color = '#f6e4b0', scale = 1) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 128
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, 512, 128)
    ctx.font = '600 40px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.shadowColor = '#000'; ctx.shadowBlur = 12
    ctx.fillStyle = color; ctx.fillText(text, 256, 64)
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false })
    const s = new THREE.Sprite(mat); s.scale.set(4.2 * scale, 1.05 * scale, 1); s.position.set(x, y, z)
    this.entityGroup.add(s)
    return s
  }

  addGate(type, label, x, z, color = 0xd9b978) {
    const g = new THREE.Group()
    const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .85, blending: THREE.AdditiveBlending })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, .08, 8, 32), ringMat); g.add(ring)
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.38, .035, 6, 32), ringMat.clone()); ring2.material.opacity = .45; g.add(ring2)
    const swirlTex = textures().rune.clone(); swirlTex.needsUpdate = true
    const swirlMat = new THREE.MeshBasicMaterial({ map: swirlTex, transparent: true, opacity: .45, color, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
    const swirl = new THREE.Mesh(new THREE.CircleGeometry(1.1, 32), swirlMat); g.add(swirl)
    const light = new THREE.PointLight(color, 9, 9, 2); g.add(light)
    g.position.set(x, 1.5, z)
    if (Math.abs(z) > Math.abs(x)) g.rotation.y = z > 0 ? 0 : Math.PI
    else g.rotation.y = x > 0 ? -Math.PI / 2 : Math.PI / 2
    this.roomGroup.add(g)
    const labelSprite = this.addLabelSprite(label, x, 3.55, z, '#' + new THREE.Color(color).getHexString(), 1.05)
    const portal = { group: g, ring, ring2, swirl, light, type, x, z, color, label: labelSprite }
    this.portals.push(portal)
    return portal
  }

  addBossAura(color = 0xff5078) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(4, 4.3, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .3, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
    ring.rotation.x = -Math.PI / 2; ring.position.y = .03; this.roomGroup.add(ring); this.bossRing = ring
  }

  makeEnemyMesh(type) {
    const g = new THREE.Group()
    const glow = (color, size = .12) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), new THREE.MeshBasicMaterial({ color })); return m
    }
    if (type === 'hound') {
      const body = new THREE.Mesh(new THREE.IcosahedronGeometry(.55, 1), new THREE.MeshStandardMaterial({ color: 0x201424, roughness: .6, metalness: .2, emissive: 0x4a0d1c, emissiveIntensity: .8 }))
      body.scale.set(1.5, .8, .85); body.position.y = .7; g.add(body)
      const head = new THREE.Mesh(new THREE.ConeGeometry(.32, .8, 6), new THREE.MeshStandardMaterial({ color: 0x2e1622, roughness: .5, emissive: 0x6a1326, emissiveIntensity: 1 }))
      head.rotation.z = -Math.PI / 2; head.position.set(.78, .78, 0); g.add(head)
      for (const s of [-1, 1]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(.06, .04, .55, 5), new THREE.MeshStandardMaterial({ color: 0x170d1a })); leg.position.set(-.3, .3, s * .3); g.add(leg); const leg2 = leg.clone(); leg2.position.x = .35; g.add(leg2) }
      const eyeL = glow(0xff8a3c, .055), eyeR = glow(0xff8a3c, .055); eyeL.position.set(1.05, .85, .16); eyeR.position.set(1.05, .85, -.16); g.add(eyeL, eyeR)
      g.userData.body = body
    } else if (type === 'cultist') {
      const robe = new THREE.Mesh(new THREE.ConeGeometry(.62, 1.9, 8), new THREE.MeshStandardMaterial({ color: 0x2b0f24, roughness: .75, emissive: 0x3a0a1a, emissiveIntensity: .45 })); robe.position.y = 1.1; g.add(robe)
      const hood = new THREE.Mesh(new THREE.ConeGeometry(.4, .75, 8), new THREE.MeshStandardMaterial({ color: 0x1b0a18, roughness: .8 })); hood.position.y = 2.1; g.add(hood)
      const orb = glow(0xe05071, .16); orb.position.set(1.15, 1.5, 0); g.add(orb); g.userData.orb = orb
      const face = glow(0xff7088, .06); face.position.set(0, 2.02, .24); g.add(face)
      g.userData.body = robe
    } else if (type === 'knight') {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(.55, .7, 1.5, 7), new THREE.MeshStandardMaterial({ color: 0x2c3b44, metalness: .75, roughness: .35, emissive: 0x0b3a40, emissiveIntensity: .4 })); body.position.y = 1.2; g.add(body)
      const helm = new THREE.Mesh(new THREE.ConeGeometry(.42, .9, 7), new THREE.MeshStandardMaterial({ color: 0x3d4f59, metalness: .8, roughness: .3 })); helm.position.y = 2.35; g.add(helm)
      const visor = glow(0x6fd8e0, .1); visor.position.set(0, 2.22, .34); g.add(visor)
      const sword = new THREE.Mesh(new THREE.BoxGeometry(.1, 2.1, .16), new THREE.MeshStandardMaterial({ color: 0x9aa9b4, metalness: .9, roughness: .2 })); sword.position.set(.96, 1.35, .1); sword.rotation.z = -.22; g.add(sword)
      const shield = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, .12, 8), new THREE.MeshStandardMaterial({ color: 0x59452a, metalness: .6, roughness: .5 })); shield.rotation.x = Math.PI / 2; shield.position.set(-.8, 1.35, .1); g.add(shield)
      g.userData.body = body
    } else if (type === 'boss') {
      const dress = new THREE.Mesh(new THREE.ConeGeometry(2.2, 3.6, 12), new THREE.MeshStandardMaterial({ color: 0x25091a, roughness: .7, metalness: .1, emissive: 0x4a0a2a, emissiveIntensity: .55 })); dress.position.y = 1.9; g.add(dress)
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(.75, 1.5, 1.6, 10), new THREE.MeshStandardMaterial({ color: 0xd9b978, metalness: .7, roughness: .35, emissive: 0x4a2a08, emissiveIntensity: .5 })); torso.position.y = 3.7; g.add(torso)
      const head = new THREE.Mesh(new THREE.SphereGeometry(.55, 12, 12), new THREE.MeshStandardMaterial({ color: 0x1a0a18, roughness: .6 })); head.position.y = 4.9; g.add(head)
      const crown = new THREE.Mesh(new THREE.TorusGeometry(.7, .06, 6, 20), new THREE.MeshBasicMaterial({ color: 0xff5078 })); crown.position.y = 5.35; crown.rotation.x = Math.PI / 2; g.add(crown)
      for (let i = 0; i < 4; i++) { const spike = new THREE.Mesh(new THREE.ConeGeometry(.08, .55, 5), new THREE.MeshBasicMaterial({ color: 0xff8aa0 })); spike.position.set(Math.cos(i / 4 * TAU) * .66, 5.65, Math.sin(i / 4 * TAU) * .66); g.add(spike) }
      const eyeL = glow(0xff9ab0, .09), eyeR = glow(0xff9ab0, .09); eyeL.position.set(-.18, 4.95, .48); eyeR.position.set(.18, 4.95, .48); g.add(eyeL, eyeR)
      for (const s of [-1, 1]) { const arm = new THREE.Mesh(new THREE.CylinderGeometry(.12, .18, 2.6, 6), new THREE.MeshStandardMaterial({ color: 0x1a0a18, roughness: .7 })); arm.position.set(s * 1.5, 3.6, 0); arm.rotation.z = s * .45; g.add(arm) }
      g.userData.body = dress
    } else {
      // wraith
      const robe = new THREE.Mesh(new THREE.ConeGeometry(.52, 1.8, 7), new THREE.MeshStandardMaterial({ color: 0x1c1028, roughness: .8, emissive: 0x341a4a, emissiveIntensity: .5, transparent: true, opacity: .92 }))
      robe.position.y = 1.08; g.add(robe)
      const hood = new THREE.Mesh(new THREE.ConeGeometry(.3, .65, 7), new THREE.MeshStandardMaterial({ color: 0x120a1a, roughness: .85 })); hood.position.y = 2.0; g.add(hood)
      const eyeL = glow(0xb47cff, .06), eyeR = glow(0xb47cff, .06); eyeL.position.set(-.12, 1.98, .22); eyeR.position.set(.12, 1.98, .22); g.add(eyeL, eyeR)
      const arms = new THREE.Mesh(new THREE.TorusGeometry(.62, .04, 5, 16, Math.PI), new THREE.MeshBasicMaterial({ color: 0x6b3d9e, transparent: true, opacity: .6 })); arms.position.y = 1.4; arms.rotation.z = Math.PI; g.add(arms)
      g.userData.body = robe
    }
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(type === 'boss' ? 2 : .6, 18), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .38, depthWrite: false }))
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = .012; g.add(shadow)
    g.userData.type = type
    this.entityGroup.add(g)
    return g
  }

  makeProjectile(color, size = .16, friendly = true) {
    const g = new THREE.Group()
    const core = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), new THREE.MeshBasicMaterial({ color }))
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: textures().glow, color, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false }))
    glow.scale.set(size * 8, size * 8, 1)
    g.add(core, glow)
    if (friendly) { const tail = new THREE.Mesh(new THREE.ConeGeometry(size * .9, size * 5, 6), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .35, blending: THREE.AdditiveBlending, depthWrite: false })); tail.rotation.x = -Math.PI / 2; tail.position.z = size * 2.4; g.add(tail) }
    this.entityGroup.add(g)
    return g
  }

  makePickup(type = 'ember') {
    const g = new THREE.Group()
    const color = type === 'health' ? 0xff7088 : type === 'cinder' ? 0xb79cff : 0xffb15c
    const core = new THREE.Mesh(type === 'health' ? new THREE.OctahedronGeometry(.18, 0) : new THREE.TetrahedronGeometry(.17, 0), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .95 }))
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: textures().glow, color, transparent: true, opacity: .6, blending: THREE.AdditiveBlending, depthWrite: false })); spr.scale.set(1.2, 1.2, 1)
    g.add(core, spr); g.position.y = .5
    this.entityGroup.add(g)
    return g
  }

  slash(pos, angle, color = 0xffe6b0, radius = 2.4, arc = Math.PI * .7, life = .22) {
    const geo = new THREE.RingGeometry(radius * .35, radius, 24, 1, -arc / 2, arc)
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .85, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.rotation.x = -Math.PI / 2; mesh.rotation.z = -angle + Math.PI / 2
    mesh.position.set(pos.x, .55, pos.z)
    this.fxGroup.add(mesh)
    this.slashes.push({ mesh, life, max: life, radius })
  }

  shockwave(x, z, color = 0xffb15c, radius = 3.5, life = .5) {
    const geo = new THREE.RingGeometry(.2, .36, 40)
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .7, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
    const mesh = new THREE.Mesh(geo, mat); mesh.rotation.x = -Math.PI / 2; mesh.position.set(x, .1, z)
    this.fxGroup.add(mesh); this.slashes.push({ mesh, life, max: life, expand: radius })
  }

  burst(pos, color = 0xffcf8a, count = 10, speed = 3, size = .12, up = .4) {
    const positions = new Float32Array(count * 3)
    const velocities = []
    for (let i = 0; i < count; i++) {
      positions[i * 3] = pos.x; positions[i * 3 + 1] = (pos.y || .8); positions[i * 3 + 2] = pos.z
      const a = Math.random() * TAU, s = speed * rand(.3, 1)
      velocities.push({ x: Math.cos(a) * s, y: rand(up * .5, up * 2.2), z: Math.sin(a) * s })
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity: .95, blending: THREE.AdditiveBlending, depthWrite: false })
    const pts = new THREE.Points(geo, mat); this.fxGroup.add(pts)
    this.bursts.push({ points: pts, velocities, life: .7, max: .7 })
  }

  floatText(text, pos, color = '#f6e4b0', size = 32, crit = false) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 128
    const x = c.getContext('2d'); x.font = `${crit ? '700' : '600'} ${size}px Georgia, serif`; x.textAlign = 'center'; x.textBaseline = 'middle'
    x.shadowColor = 'rgba(0,0,0,.9)'; x.shadowBlur = 10; x.fillStyle = color; x.fillText(text, 128, 64)
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false })
    const s = new THREE.Sprite(mat); s.scale.set(2.2, 1.1, 1); s.position.set(pos.x, pos.y || 1.8, pos.z)
    this.fxGroup.add(s)
    this.floaters.push({ sprite: s, life: .9, max: .9, vy: 1.4 })
  }

  ghost(sprite, x, z, duration = .32) {
    const mat = sprite.material.clone(); mat.opacity = .35
    const s = new THREE.Sprite(mat); s.scale.copy(sprite.scale); s.position.set(x, sprite.position.y, z)
    this.fxGroup.add(s); this.ghosts.push({ sprite: s, life: duration, max: duration })
  }

  shake(amount = .3) { this.shakeAmount = Math.min(1.2, this.shakeAmount + amount) }

  cameraFollow(target, dt, instant = false) {
    if (this.mode === 'title') {
      this.orbitAngle += dt * .07
      const r = 21 + Math.sin(this.time * .13) * 1.2
      const desired = new THREE.Vector3(Math.sin(this.orbitAngle) * r, 10.5 + Math.sin(this.time * .2) * .6, Math.cos(this.orbitAngle) * r)
      this.camera.position.lerp(desired, instant ? 1 : 1 - Math.exp(-2 * dt))
      const look = new THREE.Vector3(0, 2.2, 0)
      this.camera.lookAt(look)
      return
    }
    const desired = new THREE.Vector3(target.x + 16, 20, target.z + 16)
    this.camera.position.lerp(desired, instant ? 1 : 1 - Math.exp(-5 * dt))
    this.cameraTarget.lerp(new THREE.Vector3(target.x, 1.2, target.z), instant ? 1 : 1 - Math.exp(-6 * dt))
    if (this.shakeAmount > 0.001) {
      const s = this.shakeAmount
      this.camera.position.x += rand(-s, s) * .35
      this.camera.position.y += rand(-s, s) * .25
      this.camera.position.z += rand(-s, s) * .35
      this.shakeAmount *= Math.exp(-8 * dt)
    }
    this.camera.lookAt(this.cameraTarget)
  }

  update(dt) {
    this.time += dt
    // braziers
    for (const b of this.braziers) {
      const f = .82 + Math.sin(this.time * 9 + b.phase) * .1 + Math.sin(this.time * 23 + b.phase * 2) * .06
      if (b.fire) { b.fire.scale.set(f, f * (b.candle ? 1.6 : 1.1), f); b.fire.rotation.y += dt * 2 }
      if (b.core && b.core !== b.fire) b.core.scale.setScalar(.9 + Math.sin(this.time * 17 + b.phase) * .12)
      if (b.light) b.light.intensity = b.base * (.82 + Math.sin(this.time * 11 + b.phase) * .16 + Math.sin(this.time * 27 + b.phase) * .07)
    }
    // dust
    if (this.dust) {
      const arr = this.dust.geometry.attributes.position.array, vel = this.dust.userData.vel
      for (let i = 0; i < vel.length; i++) { arr[i * 3 + 1] += vel[i] * dt; if (arr[i * 3 + 1] > 5.8) arr[i * 3 + 1] = .2 }
      this.dust.geometry.attributes.position.needsUpdate = true
      this.dust.rotation.y += dt * .01
    }
    // portals
    for (const p of this.portals) {
      p.swirl.rotation.z += dt * .7; p.ring.rotation.z += dt * .2; p.ring2.rotation.z -= dt * .3
      p.group.position.y = 1.5 + Math.sin(this.time * 1.6) * .06
      p.light.intensity = 8 + Math.sin(this.time * 3 + p.x) * 2
    }
    if (this.bossRing) { this.bossRing.rotation.z += dt * .3; this.bossRing.material.opacity = .2 + Math.sin(this.time * 2) * .08 }
    // slashes
    for (let i = this.slashes.length - 1; i >= 0; i--) {
      const s = this.slashes[i]; s.life -= dt
      const k = Math.max(0, s.life / s.max)
      s.mesh.material.opacity = .85 * k
      if (s.expand) s.mesh.scale.setScalar(1 + (1 - k) * s.expand)
      else s.mesh.scale.setScalar(1 + (1 - k) * .15)
      if (s.life <= 0) { this.fxGroup.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose(); this.slashes.splice(i, 1) }
    }
    // bursts
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i]; b.life -= dt
      const arr = b.points.geometry.attributes.position.array
      for (let j = 0; j < b.velocities.length; j++) {
        const v = b.velocities[j]
        arr[j * 3] += v.x * dt; arr[j * 3 + 1] += v.y * dt; arr[j * 3 + 2] += v.z * dt
        v.y -= 5 * dt; v.x *= .98; v.z *= .98
      }
      b.points.geometry.attributes.position.needsUpdate = true
      b.points.material.opacity = Math.max(0, b.life / b.max)
      if (b.life <= 0) { this.fxGroup.remove(b.points); b.points.geometry.dispose(); b.points.material.dispose(); this.bursts.splice(i, 1) }
    }
    // floaters
    for (let i = this.floaters.length - 1; i >= 0; i--) {
      const f = this.floaters[i]; f.life -= dt
      f.sprite.position.y += f.vy * dt; f.sprite.material.opacity = Math.max(0, f.life / f.max)
      if (f.life <= 0) { this.fxGroup.remove(f.sprite); f.sprite.material.map.dispose(); f.sprite.material.dispose(); this.floaters.splice(i, 1) }
    }
    // ghosts
    for (let i = this.ghosts.length - 1; i >= 0; i--) {
      const g = this.ghosts[i]; g.life -= dt; g.sprite.material.opacity = .3 * (g.life / g.max)
      if (g.life <= 0) { this.fxGroup.remove(g.sprite); g.sprite.material.dispose(); this.ghosts.splice(i, 1) }
    }
    this.playerLight.intensity = 18 + Math.sin(this.time * 2.1) * 2.5
  }

  render() { this.composer.render() }

  screenToGround(mx, my) {
    const ndc = new THREE.Vector2((mx / window.innerWidth) * 2 - 1, -(my / window.innerHeight) * 2 + 1)
    const raycaster = new THREE.Raycaster(); raycaster.setFromCamera(ndc, this.camera)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const point = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, point)
    return point
  }

  screenToWorldPlane(mx, my, y = 1.2) {
    const ndc = new THREE.Vector2((mx / window.innerWidth) * 2 - 1, -(my / window.innerHeight) * 2 + 1)
    const raycaster = new THREE.Raycaster(); raycaster.setFromCamera(ndc, this.camera)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -y)
    const point = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, point)
    return point
  }
}

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0
    let t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

export { clamp, rand, pick, TAU }
