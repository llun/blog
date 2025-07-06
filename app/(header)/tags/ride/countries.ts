import { CountryData } from './types'

import { SINGAPORE } from './singapore'
import { NETHERLANDS } from './netherlands'
import { SLOVENIA } from './slovenia'

export enum COUNTRY {
  NETHERLANDS = 'netherlands',
  SINGAPORE = 'singapore',
  SLOVENIA = 'slovenia'
}

export const COUNTRIES_DATA: Record<COUNTRY, CountryData> = {
  [COUNTRY.NETHERLANDS]: NETHERLANDS,
  [COUNTRY.SINGAPORE]: SINGAPORE,
  [COUNTRY.SLOVENIA]: SLOVENIA
}
