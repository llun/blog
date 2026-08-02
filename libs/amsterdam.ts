import fs from 'fs/promises'
import yaml from 'yaml'
import path from 'path'
import { getMarkdown } from './markdown'
import { isSafeSegment } from './utils'

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
  id: string
  content?: string
}

export const parseCalendar = async (
  file: string,
  loadContent = false
): Promise<Calendar | null> => {
  try {
    await fs.stat(file)
  } catch {
    return null
  }

  try {
    const raw = await fs.readFile(file, 'utf-8')
    const begin = raw.indexOf('---')
    const end = raw.indexOf('---', begin + 3)
    const properties: CalendarProperty = yaml.parse(raw.substring(begin, end))
    if (!loadContent) {
      return {
        ...properties,
        id: path.basename(file, '.md')
      }
    }

    const md = getMarkdown({})
    return {
      ...properties,
      id: path.basename(file, '.md'),
      content: md.render(raw.substring(end + 3).trim())
    }
  } catch (error) {
    console.warn(`Failed to parse calendar ${file}`, error)
    return null
  }
}

export const getAllCalendars = async () => {
  const base = path.join(process.cwd(), 'contents', 'amsterdam', 'calendar')
  const calendars = await fs.readdir(base)
  return (
    await Promise.all(
      calendars.map((month) => parseCalendar(path.join(base, month)))
    )
  ).filter((p): p is Calendar => p !== null)
}

export const getCalendar = async (id: string): Promise<Calendar | null> => {
  if (!isSafeSegment(id)) {
    return null
  }

  return parseCalendar(
    path.join(process.cwd(), 'contents', 'amsterdam', 'calendar', `${id}.md`),
    true
  )
}
