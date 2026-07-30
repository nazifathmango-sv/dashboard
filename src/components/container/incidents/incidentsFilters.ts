import type { Incident } from '@/data/incidents'

export type IncidentPeriodFilter = 'all' | 'past' | 'current' | 'future'

export function filterIncidentsByPeriod(
  incidents: Incident[],
  period: IncidentPeriodFilter,
  referenceDate: Date = new Date(),
): Incident[] {
  const normalizedReference = new Date(referenceDate)
  normalizedReference.setHours(0, 0, 0, 0)

  return incidents.filter((incident) => {
    const incidentDate = new Date(incident.date)
    incidentDate.setHours(0, 0, 0, 0)

    if (period === 'past') return incidentDate < normalizedReference
    if (period === 'current') return incidentDate.getTime() === normalizedReference.getTime()
    if (period === 'future') return incidentDate > normalizedReference
    return true
  })
}
