import {
  JetBrains_Mono,
  Noto_Sans,
  Noto_Sans_Thai_Looped
} from 'next/font/google'

// Latin text uses Noto Sans and Thai falls through to the looped Noto face,
// so mixed Thai and English lines keep one voice. Weights stay at 400/500.
const latin = Noto_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-latin',
  display: 'swap'
})

const thai = Noto_Sans_Thai_Looped({
  subsets: ['thai'],
  weight: ['400', '500'],
  variable: '--font-thai',
  display: 'swap'
})

// Dates, tags, labels and code
const code = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-code',
  display: 'swap'
})

export const fontVariables = [
  latin.variable,
  thai.variable,
  code.variable
].join(' ')
