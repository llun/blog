import { CountryData } from './types'

import { SINGAPORE } from './singapore'
import { NETHERLANDS } from './netherlands'

export enum COUNTRY {
  NETHERLANDS = 'netherlands',
  SINGAPORE = 'singapore'
}

export const COUNTRIES_DATA: Record<COUNTRY, CountryData> = {
  [COUNTRY.NETHERLANDS]: NETHERLANDS,
  [COUNTRY.SINGAPORE]: SINGAPORE
}
