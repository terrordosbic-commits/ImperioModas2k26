// Lógica de horário de atendimento da Império Modas
// Seg-Sex: 09h-18h | Sáb: 10h-17h | Dom: fechado

export interface HoursConfig {
  open: number   // hora de abertura (0-23)
  close: number  // hora de fechamento (0-23)
}

export const BUSINESS_HOURS: Record<number, HoursConfig | null> = {
  0: null,           // Domingo - fechado
  1: { open: 9, close: 18 },   // Segunda
  2: { open: 9, close: 18 },   // Terça
  3: { open: 9, close: 18 },   // Quarta
  4: { open: 9, close: 18 },   // Quinta
  5: { open: 9, close: 18 },   // Sexta
  6: { open: 10, close: 17 },  // Sábado
}

export interface BusinessStatus {
  isOpen: boolean
  nextOpenDate: Date
  nextCloseDate: Date
  todayHours: HoursConfig | null
  dayOfWeek: number
}

export function getBusinessStatus(now: Date = new Date()): BusinessStatus {
  const dayOfWeek = now.getDay()
  const todayHours = BUSINESS_HOURS[dayOfWeek]

  if (!todayHours) {
    // Domingo - sempre fechado, próxima abertura é segunda
    const nextOpen = new Date(now)
    nextOpen.setDate(nextOpen.getDate() + 1)
    nextOpen.setHours(BUSINESS_HOURS[1]!.open, 0, 0, 0)
    return {
      isOpen: false,
      nextOpenDate: nextOpen,
      nextCloseDate: nextOpen,
      todayHours: null,
      dayOfWeek,
    }
  }

  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute
  const openTime = todayHours.open * 60
  const closeTime = todayHours.close * 60

  const isOpen = currentTime >= openTime && currentTime < closeTime

  let nextOpenDate: Date
  let nextCloseDate: Date

  if (isOpen) {
    // Está aberto - próximo fechamento é hoje
    nextCloseDate = new Date(now)
    nextCloseDate.setHours(todayHours.close, 0, 0, 0)

    // Próxima abertura: amanhã (ou segunda se for sábado)
    nextOpenDate = new Date(now)
    nextOpenDate.setDate(nextOpenDate.getDate() + 1)
    const nextDay = nextOpenDate.getDay()
    const nextDayHours = BUSINESS_HOURS[nextDay]
    if (nextDayHours) {
      nextOpenDate.setHours(nextDayHours.open, 0, 0, 0)
    } else {
      // Domingo -> segunda
      nextOpenDate.setDate(nextOpenDate.getDate() + 1)
      nextOpenDate.setHours(BUSINESS_HOURS[1]!.open, 0, 0, 0)
    }
  } else if (currentTime < openTime) {
    // Ainda não abriu hoje
    nextOpenDate = new Date(now)
    nextOpenDate.setHours(todayHours.open, 0, 0, 0)
    nextCloseDate = new Date(now)
    nextCloseDate.setHours(todayHours.close, 0, 0, 0)
  } else {
    // Já fechou hoje - próxima abertura é amanhã
    nextOpenDate = new Date(now)
    nextOpenDate.setDate(nextOpenDate.getDate() + 1)
    const nextDay = nextOpenDate.getDay()
    const nextDayHours = BUSINESS_HOURS[nextDay]
    if (nextDayHours) {
      nextOpenDate.setHours(nextDayHours.open, 0, 0, 0)
    } else {
      // Domingo -> segunda
      nextOpenDate.setDate(nextOpenDate.getDate() + 1)
      nextOpenDate.setHours(BUSINESS_HOURS[1]!.open, 0, 0, 0)
    }
    nextCloseDate = nextOpenDate
  }

  return {
    isOpen,
    nextOpenDate,
    nextCloseDate,
    todayHours,
    dayOfWeek,
  }
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return 'agora'
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}min`
  }
  return `${minutes}min`
}

export function getDayLabel(day: number): string {
  const labels = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  return labels[day]
}

