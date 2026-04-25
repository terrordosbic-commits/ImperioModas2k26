'use client'

import { Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useBusinessHours } from '@/hooks/use-business-hours'
import { getDayLabel, BUSINESS_HOURS } from '@/lib/business-hours'
import { Card, CardContent } from '@/components/ui/card'

export function BusinessHours() {
  const { status, countdown } = useBusinessHours()

  return (
    <Card className="fade-in-up overflow-hidden border-l-4 transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Status header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Horário de Atendimento</span>
            </div>
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                status.isOpen
                  ? 'bg-green-100 text-green-700 animate-pulse-soft dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {status.isOpen ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  ABERTO
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  FECHADO
                </>
              )}
            </div>
          </div>

          {/* Countdown */}
          <div className="text-sm">
            {status.isOpen ? (
              <span className="text-muted-foreground">
                Fecha em: <strong className="text-green-600 dark:text-green-400">{countdown}</strong>
              </span>
            ) : (
              <span className="text-muted-foreground">
                Abre em: <strong className="text-red-600 dark:text-red-400">{countdown}</strong>
              </span>
            )}
          </div>

          {/* Weekly schedule */}
          <div className="border-t pt-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Nossos horários:</p>
            <div className="space-y-1">
              {[1, 2, 3, 4, 5].map((day) => {
                const hours = BUSINESS_HOURS[day]
                const isToday = status.dayOfWeek === day
                return (
                  <div
                    key={day}
                    className={`flex justify-between text-xs ${
                      isToday ? 'font-semibold text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <span>{getDayLabel(day)}</span>
                    <span>{hours ? `${String(hours.open).padStart(2, '0')}h - ${String(hours.close).padStart(2, '0')}h` : 'Fechado'}</span>
                  </div>
                )
              })}
              <div
                className={`flex justify-between text-xs ${
                  status.dayOfWeek === 6 ? 'font-semibold text-primary' : 'text-muted-foreground'
                }`}
              >
                <span>Sábado</span>
                <span>10h - 17h</span>
              </div>
              <div
                className={`flex justify-between text-xs ${
                  status.dayOfWeek === 0 ? 'font-semibold text-primary' : 'text-muted-foreground'
                }`}
              >
                <span>Domingo</span>
                <span className="text-red-500">Fechado</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

