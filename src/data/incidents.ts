export type IncidentStatus = 'Ouvert' | 'En cours' | 'Résolu'

export interface Incident {
  id: number
  client: string
  room: string
  date: string
  issue: string
  status: IncidentStatus
  details: string
}

export const incidents: Incident[] = [
  {
    id: 1,
    client: 'Hélène ADJOVI',
    room: '301',
    date: '2026-07-29',
    issue: 'Climatisation ne fonctionne pas',
    status: 'Ouvert',
    details: 'Le client signale que la climatisation reste éteinte et que la chambre est trop chaude.',
  },
  {
    id: 2,
    client: 'Jean KODJO',
    room: '204',
    date: '2026-07-28',
    issue: 'Douche bouchée',
    status: 'En cours',
    details: 'Le personnel de maintenance a été notifié et intervient sous 30 min.',
  },
  {
    id: 3,
    client: 'MANGO Nazifath',
    room: '412',
    date: '2026-07-27',
    issue: 'Télévision sans son',
    status: 'Résolu',
    details: 'La télécommande a été remplacée et le son est revenu.',
  },
]
