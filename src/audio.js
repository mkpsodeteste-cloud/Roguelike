// Procedural gothic soundtrack and combat SFX. No external audio files.
export class AudioEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.musicBus = null
    this.sfxBus = null
    this.muted = false
    this.theme = 'hub'
    this.tension = 0
    this._timer = null
    this._pulse = null
    this._started = false
    this._noise = null
  }

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return }
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    this.ctx = new AC()
    const c = this.ctx
    this.master = c.createGain(); this.master.gain.value = .55
    const comp = c.createDynamicsCompressor()
    comp.threshold.value = -18; comp.knee.value = 22; comp.ratio.value = 5; comp.attack.value = .004; comp.release.value = .25
    this.master.connect(comp); comp.connect(c.destination)
    this.musicBus = c.createGain(); this.musicBus.gain.value = .38; this.musicBus.connect(this.master)
    this.sfxBus = c.createGain(); this.sfxBus.gain.value = .7; this.sfxBus.connect(this.master)
    this.reverb = c.createConvolver(); this.reverb.buffer = this._impulse(2.6, 2.4)
    this.reverbGain = c.createGain(); this.reverbGain.gain.value = .3
    this.reverb.connect(this.reverbGain); this.reverbGain.connect(this.musicBus)
    this._noise = this._noiseBuffer(2)
    this._drone()
    this._schedule()
    this._started = true
    if (this.ctx.state === 'suspended') this.ctx.resume()
  }

  _impulse(duration, decay) {
    const c = this.ctx, rate = c.sampleRate, len = Math.floor(rate * duration)
    const buf = c.createBuffer(2, len, rate)
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
    }
    return buf
  }

  _noiseBuffer(seconds) {
    const c = this.ctx, len = Math.floor(c.sampleRate * seconds)
    const buf = c.createBuffer(1, len, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    return buf
  }

  _drone() {
    const c = this.ctx
    const filt = c.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 220; filt.Q.value = 3
    const g = c.createGain(); g.gain.value = .045
    filt.connect(g); g.connect(this.musicBus); g.connect(this.reverb)
    for (const f of [55, 82.41, 110]) {
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = Math.random() * 16 - 8
      const og = c.createGain(); og.gain.value = .33
      o.connect(og); og.connect(filt); o.start()
    }
    const lfo = c.createOscillator(); lfo.frequency.value = .06
    const lg = c.createGain(); lg.gain.value = 70
    lfo.connect(lg); lg.connect(filt.frequency); lfo.start()
    this.droneFilter = filt
  }

  setTheme(theme) {
    this.theme = theme
    if (!this.ctx) return
    const target = theme === 'run' ? 260 : 190
    this.droneFilter.frequency.setTargetAtTime(target, this.ctx.currentTime, 1.5)
  }

  setTension(v) {
    this.tension = Math.max(0, Math.min(1, v))
    if (!this.ctx) return
    this.droneFilter.frequency.setTargetAtTime(220 + this.tension * 480, this.ctx.currentTime, .8)
  }

  _schedule() {
    clearInterval(this._timer)
    clearInterval(this._pulse)
    const roots = { hub: [146.83, 174.61, 220, 261.63, 293.66], run: [110, 130.81, 164.81, 196, 220, 246.94], boss: [98, 116.54, 146.83, 174.61, 207.65] }
    const scale = () => roots[this.theme] || roots.run
    this._timer = setInterval(() => {
      if (!this.ctx || this.muted) return
      const notes = scale()
      const n = notes[Math.floor(Math.random() * notes.length)]
      this._pluck(n, .12 + Math.random() * .05)
      if (Math.random() < .45) this._pluck(n * 1.5, .07)
      if (this.tension > .55 && Math.random() < .5) this._pluck(n * 2, .05)
    }, this.theme === 'boss' ? 1350 : 2200)
    this._pulse = setInterval(() => {
      if (!this.ctx || this.muted || this.tension < .35) return
      this._thump(.06 + this.tension * .08)
    }, 520)
  }

  _pluck(freq, vol) {
    const c = this.ctx, t = c.currentTime
    const o = c.createOscillator(); o.type = Math.random() < .5 ? 'sine' : 'triangle'; o.frequency.value = freq
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + 2.4)
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1100
    o.connect(f); f.connect(g); g.connect(this.musicBus); g.connect(this.reverb)
    o.start(t); o.stop(t + 2.5)
  }

  _thump(vol) {
    const c = this.ctx, t = c.currentTime
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(38, t + .18)
    const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + .22)
    o.connect(g); g.connect(this.musicBus); o.start(t); o.stop(t + .24)
  }

  _tone(freq, dur, type = 'sine', vol = .15, slide = 0, when = 0) {
    if (!this.ctx) return
    const c = this.ctx, t = c.currentTime + when
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t)
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur)
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + dur)
    o.connect(g); g.connect(this.sfxBus); o.start(t); o.stop(t + dur + .02)
  }

  _noiseHit(dur = .18, vol = .12, filterFreq = 1200, type = 'bandpass') {
    if (!this.ctx || !this._noise) return
    const c = this.ctx, t = c.currentTime
    const src = c.createBufferSource(); src.buffer = this._noise
    const f = c.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(filterFreq, t); f.frequency.exponentialRampToValueAtTime(Math.max(80, filterFreq * .25), t + dur); f.Q.value = 1.2
    const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur)
    src.connect(f); f.connect(g); g.connect(this.sfxBus)
    src.start(t); src.stop(t + dur + .02)
  }

  unlock() { this.init() }
  setMuted(v) { this.muted = v; if (this.master) this.master.gain.value = v ? 0 : .55 }

  click() { this._tone(720, .05, 'triangle', .05, -120) }
  confirm() { this._tone(440, .18, 'sine', .08, 220); this._tone(660, .25, 'sine', .05, 110, .06) }
  back() { this._tone(330, .12, 'sine', .05, -80) }
  swing() { this._noiseHit(.14, .17, 2600); this._tone(240, .09, 'triangle', .04, -90) }
  hit() { this._tone(120, .1, 'square', .11, -60); this._noiseHit(.1, .12, 1800) }
  crit() { this._tone(880, .12, 'square', .07, 420); this._noiseHit(.16, .16, 3200) }
  shoot() { this._tone(880, .16, 'triangle', .07, -520); this._tone(1320, .1, 'sine', .03, -700) }
  dash() { this._noiseHit(.24, .12, 900, 'highpass'); this._tone(180, .18, 'sine', .05, 220) }
  hurt() { this._tone(160, .2, 'sawtooth', .1, -90); this._noiseHit(.18, .14, 700) }
  pickup() { this._tone(880, .1, 'sine', .05, 220); this._tone(1320, .18, 'sine', .04, 180, .05) }
  heal() { [440, 554, 659].forEach((f, i) => this._tone(f, .5, 'sine', .05, 20, i * .08)) }
  death() { this._tone(220, 1.4, 'sawtooth', .1, -170); this._noiseHit(1.1, .08, 500) }
  bossRoar() { this._tone(70, 1.2, 'sawtooth', .16, -20); this._noiseHit(.9, .16, 300, 'lowpass') }
  dialogue() { [523, 659, 784].forEach((f, i) => this._tone(f, .8, 'sine', .035, 10, i * .09)) }
  portal() { this._tone(196, 1.2, 'sine', .06, 390); this._tone(294, 1.4, 'triangle', .03, 240, .08) }
  levelUp() { [440, 554, 659, 880].forEach((f, i) => this._tone(f, .6, 'triangle', .05, 10, i * .07)) }
  bossPhase() { this._tone(90, .8, 'sawtooth', .12, 40); this._noiseHit(.5, .1, 900) }
}
