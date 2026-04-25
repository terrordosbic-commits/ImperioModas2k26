// Hook para haptic feedback (vibração)
// Fallback seguro para desktop

export function useHaptic() {
  const vibrate = (pattern: number | number[] = 50) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern)
      } catch {
        // Silenciosamente ignora em dispositivos sem suporte
      }
    }
  }

  const vibrateShort = () => vibrate(30)
  const vibrateMedium = () => vibrate(50)
  const vibratePattern = () => vibrate([30, 50, 30])

  return { vibrate, vibrateShort, vibrateMedium, vibratePattern }
}

