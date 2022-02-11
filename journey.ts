import path from 'path'
import memoize from 'lodash/memoize'
import yaml from 'yaml'
import fs from 'fs'

import { getMarkdown, readAllLeafDirectories } from './blog'

interface JourneyProperty {
  title: string
  description: string
}

export interface Journey {
  name: string
  title: string
  description: string
  content?: string
}

export const parseJourney = (
  file: string,
  includeContent: boolean = false
): Journey => {
  try {
    fs.statSync(file)
    const name = path.basename(file)
    const raw = fs.readFileSync(path.join(file, 'index.md')).toString('utf-8')
    const begin = raw.indexOf('---')
    const end = raw.indexOf('---', begin + 3)
    const properties: JourneyProperty = yaml.parse(raw.substring(begin, end))

    if (!includeContent) {
      return { ...properties, name }
    }

    const md = getMarkdown({})
    return {
      ...properties,
      name,
      content: md.render(raw.substring(end + 3).trim())
    }
  } catch (error) {
    return null
  }
}

export const getAllJourneys = memoize((): Journey[] => {
  const paths = readAllLeafDirectories(path.join(process.cwd(), 'journeys'))
  const journeys = [
    ...paths.map((item) => parseJourney(item)),
    {
      name: 'airtag-sg-th',
      title: 'AirTag 🇸🇬 👉 🇹🇭',
      description:
        'tracking my stuffs send through relocation service from Singapore to Thailand'
    },
    {
      name: 'wordle',
      title: 'Wordle',
      description: 'my wordle journey each day'
    }
  ].sort((a, b) => a.name.localeCompare(b.name))
  return journeys
})
