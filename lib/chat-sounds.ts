// Sistema de sons do chat usando Web Audio API (sem arquivos externos)
// Gera sons sintéticos leves e não invasivos

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioCtx
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15) {
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)

    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Silenciosamente falha em browsers sem suporte
  }
}

// Som curto de tecla (click mecânico leve)
export function playTypingSound() {
  playTone(800, 0.05, 'sine', 0.08)
}

// Som de envio de mensagem (usuário)
export function playSendSound() {
  const ctx = getAudioContext()
  const now = ctx.currentTime

  // Tom ascendente curto tipo "pop"
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(600, now)
  osc.frequency.exponentialRampToValueAtTime(900, now + 0.1)
  gain.gain.setValueAtTime(0.12, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.15)
}

// Som de recebimento de mensagem (IA)
export function playReceiveSound() {
  const ctx = getAudioContext()
  const now = ctx.currentTime

  // Dois tons suaves tipo notificação
  playTone(520, 0.12, 'sine', 0.1)
  setTimeout(() => playTone(720, 0.12, 'sine', 0.1), 80)
}

// Som de digitação contínua da IA (loop leve)
let typingInterval: ReturnType<typeof setInterval> | null = null

export function startTypingSoundLoop() {
  if (typingInterval) return
  typingInterval = setInterval(() => {
    playTypingSound()
  }, 120)
}

export function stopTypingSoundLoop() {
  if (typingInterval) {
    clearInterval(typingInterval)
    typingInterval = null
  }
}

