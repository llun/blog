import fs from 'fs/promises'
import yaml from 'yaml'
import path from 'path'

export interface CalendarProperty {
  month:
    | 'january'
    | 'february'
    | 'march'
    | 'april'
    | 'may'
    | 'june'
    | 'july'
    | 'august'
    | 'september'
    | 'october'
    | 'november'
    | 'december'
  year: number
}

export interface Calendar extends CalendarProperty {
  content: string
}

export const parseCalendar = async (file: string): Promise<Calendar | null> => {
  try {
    await fs.stat(file)
    const raw = await fs.readFile(file, 'utf-8')
    const begin = raw.indexOf('---')
    const end = raw.indexOf('---', begin + 3)
    const properties: CalendarProperty = yaml.parse(raw.substring(begin, end))

    return {
      ...properties,
      content: ''
    }
  } catch {
    return null
  }
}

export const getAllCalendars = async () => {
  const base = path.join(process.cwd(), 'contents', 'amsterdam', 'calendar')
  const calendars = await fs.readdir(base)
  for (const journey of calendars) {
    const calendar = parseCalendar(path.join(base, journey))
  }
  console.log(calendars)
}
