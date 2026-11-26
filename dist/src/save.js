const KEY = 'emberwake_save_v1'

export const defaultSave = () => ({
  version: 1,
  cinders: 0,
  bonds: { seraphine: 1, mirelle: 1, ysolde: 1 },
  seen: { seraphine: [], mirelle: [], ysolde: [] },
  perks: {},
  bestDepth: 0,
  runs: 0,
  wins: 0,
  bossKills: 0,
  totalKills: 0,
  lastRun: null,
  settings: { muted: false, shake: true },
})

let save = null
let saveTimer = 0

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      save = { ...defaultSave(), ...parsed, bonds: { ...defaultSave().bonds, ...(parsed.bonds || {}) }, seen: { ...defaultSave().seen, ...(parsed.seen || {}) }, perks: { ...(parsed.perks || {}) }, settings: { ...defaultSave().settings, ...(parsed.settings || {}) } }
    }
  } catch {}
  if (!save) save = defaultSave()
  return save
}

export function getSave() { return save || loadSave() }

export function writeSave() {
  try { localStorage.setItem(KEY, JSON.stringify(save)) } catch {}
}

export function commit() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(writeSave, 160)
}

export function resetSave() {
  save = defaultSave()
  writeSave()
  return save
}

export function bondLevel(id) { return getSave().bonds[id] || 0 }
export function bondGain(id, amount) {
  const s = getSave()
  const before = s.bonds[id] || 0
  s.bonds[id] = Math.max(0, Math.min(6, before + amount))
  commit()
  return s.bonds[id] - before
}
export function bondTitle(level) {
  return ['Stranger', 'Curious', 'Intrigued', 'Entwined', 'Devoted', 'Bound', 'Eternal'][Math.max(0, Math.min(6, level))]
}
export function bondHeartCount(level) { return level }

export function perkLevel(id) { return getSave().perks[id] || 0 }
export function perkCost(perk) {
  const lvl = perkLevel(perk.id)
  return Math.round(perk.baseCost + perk.growth * lvl)
}
export function buyPerk(perk) {
  const s = getSave()
  const lvl = perkLevel(perk.id)
  if (lvl >= perk.max) return { ok: false, reason: 'Mastered' }
  const cost = perkCost(perk)
  if (s.cinders < cost) return { ok: false, reason: 'Not enough Cinders' }
  s.cinders -= cost
  s.perks[perk.id] = lvl + 1
  commit()
  return { ok: true, cost, level: lvl + 1 }
}

export function addCinders(n) {
  const s = getSave()
  s.cinders = Math.max(0, s.cinders + Math.round(n))
  commit()
  return s.cinders
}
export function spendCinders(n) {
  const s = getSave()
  if (s.cinders < n) return false
  s.cinders -= n
  commit()
  return true
}

export function recordRun(result) {
  const s = getSave()
  s.runs += 1
  if (result.victory) { s.wins += 1; s.bossKills += 1 }
  s.bestDepth = Math.max(s.bestDepth, result.depth || 0)
  s.totalKills += result.kills || 0
  s.lastRun = { ...result, at: Date.now() }
  commit()
}

export function markSeen(charId, index) {
  const s = getSave()
  if (!s.seen[charId]) s.seen[charId] = []
  if (!s.seen[charId].includes(index)) s.seen[charId].push(index)
  commit()
}

export function hasSeen(charId, index) {
  return (getSave().seen[charId] || []).includes(index)
}
