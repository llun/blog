import React, { SVGProps } from 'react'

// Lucide's Image and Monitor redrawn with sharp corners, so they stay square
// in browsers that ignore the CSS rx override. They take the `lucide` class
// so the square stroke rules in base.css apply to them as well.
type Props = SVGProps<SVGSVGElement>

const LineIcon = ({ className, children, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={['lucide', className].filter(Boolean).join(' ')}
    {...props}
  >
    {children}
  </svg>
)

export const GalleryIcon = (props: Props) => (
  <LineIcon {...props}>
    <path d="M3 3h18v18H3z" />
    <circle cx="9" cy="9" r="2" />
    <path d="M21 15l-5-5L5 21" />
  </LineIcon>
)

export const SystemIcon = (props: Props) => (
  <LineIcon {...props}>
    <path d="M2 3h20v14H2z" />
    <path d="M8 21h8M12 17v4" />
  </LineIcon>
)
