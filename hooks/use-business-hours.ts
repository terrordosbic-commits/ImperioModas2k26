// Hook para monitorar horário de atendimento em tempo real

import { useState, useEffect, useCallback } from 'react'
import { getBusinessStatus, formatCountdown, type BusinessStatus } from '@/lib/business-hours'

interface UseBusinessHoursReturn {
  status: BusinessStatus
  countdown: string
  refresh: () => void
}

export function useBusinessHours(): UseBusinessHoursReturn {
  const [status, setStatus] = useState<BusinessStatus>(() => getBusinessStatus())
  const [countdown, setCountdown] = useState('')

  const update = useCallback(() => {
    const now = new Date()
    const newStatus = getBusinessStatus(now)
    setStatus(newStatus)

    const target = newStatus.isOpen ? newStatus.nextCloseDate : newStatus.nextOpenDate
    const diff = target.getTime() - now.getTime()
    setCountdown(formatCountdown(diff))
  }, [])

  useEffect(() => {
    update()
    const interval = setInterval(update, 30000) // Atualiza a cada 30 segundos
    return () => clearInterval(interval)
  }, [update])

  return {
    status,
    countdown,
    refresh: update,
  }
}

