import cn from 'classnames'
import React, { FC } from 'react'

// Flat, square-cornered flags drawn as vectors so they stay sharp at any
// pixel density. Each is 3:2 and gets a 1px rule in the text colour (Flag.css)
// so white stripes don't melt into the page.
export type FlagCode = 'NL' | 'SG' | 'SI'

const NAMES: Record<FlagCode, string> = {
  NL: 'Netherlands',
  SG: 'Singapore',
  SI: 'Slovenia'
}

const SG_STARS =
  'M10.00 3.00L10.13 3.37L10.52 3.38L10.21 3.62L10.32 3.99L10.00 3.77L9.68 3.99L9.79 3.62L9.48 3.38L9.87 3.37ZM11.47 4.07L11.60 4.44L12.00 4.45L11.68 4.69L11.80 5.07L11.47 4.84L11.15 5.07L11.26 4.69L10.95 4.45L11.34 4.44ZM10.91 5.80L11.04 6.18L11.43 6.18L11.12 6.42L11.23 6.80L10.91 6.57L10.59 6.80L10.70 6.42L10.39 6.18L10.78 6.18ZM9.09 5.80L9.22 6.18L9.61 6.18L9.30 6.42L9.41 6.80L9.09 6.57L8.77 6.80L8.88 6.42L8.57 6.18L8.96 6.18ZM8.53 4.07L8.66 4.44L9.05 4.45L8.74 4.69L8.85 5.07L8.53 4.84L8.20 5.07L8.32 4.69L8.00 4.45L8.40 4.44Z'

const SI_STARS =
  'M8.00 3.48L8.10 3.76L8.40 3.77L8.16 3.95L8.25 4.24L8.00 4.07L7.75 4.24L7.84 3.95L7.60 3.77L7.90 3.76ZM7.25 2.88L7.35 3.16L7.65 3.17L7.41 3.35L7.50 3.64L7.25 3.47L7.00 3.64L7.09 3.35L6.85 3.17L7.15 3.16ZM8.75 2.88L8.85 3.16L9.15 3.17L8.91 3.35L9.00 3.64L8.75 3.47L8.50 3.64L8.59 3.35L8.35 3.17L8.65 3.16Z'

const SHAPES: Record<FlagCode, React.ReactNode> = {
  NL: (
    <>
      <path fill="#ae1c28" d="M0 0h30v6.67H0z" />
      <path fill="#fff" d="M0 6.67h30v6.66H0z" />
      <path fill="#21468b" d="M0 13.33h30V20H0z" />
    </>
  ),
  SG: (
    <>
      <path fill="#ef3340" d="M0 0h30v10H0z" />
      <path fill="#fff" d="M0 10h30v10H0z" />
      <circle fill="#fff" cx="7" cy="5.1" r="3.4" />
      <circle fill="#ef3340" cx="8.4" cy="5.1" r="3.1" />
      <path fill="#fff" d={SG_STARS} />
    </>
  ),
  SI: (
    <>
      <path fill="#fff" d="M0 0h30v6.67H0z" />
      <path fill="#005da4" d="M0 6.67h30v6.66H0z" />
      <path fill="#ed1c24" d="M0 13.33h30V20H0z" />
      <path
        fill="#005da4"
        stroke="#ed1c24"
        strokeWidth="0.4"
        d="M5.8 2.6h4.4v3.8c0 1.2-1 1.9-2.2 2.4-1.2-.5-2.2-1.2-2.2-2.4z"
      />
      <path fill="#fff" d="M6.2 6.8l1-1.5.4.5.4-.9.4.9.4-.5 1 1.5z" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="0.25"
        d="M6.5 7.25q.375-.25.75 0t.75 0 .75 0 .75 0M6.9 7.75q.275-.2.55 0t.55 0 .55 0"
      />
      <path fill="#ffdd00" d={SI_STARS} />
    </>
  )
}

interface Props {
  code: FlagCode
  className?: string
}

export const Flag: FC<Props> = ({ code, className }) => (
  <svg
    className={cn('flag', className)}
    viewBox="0 0 30 20"
    role="img"
    aria-label={`${NAMES[code]} flag`}
  >
    {SHAPES[code]}
  </svg>
)
