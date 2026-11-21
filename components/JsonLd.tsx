import React from 'react'

interface Props {
  data: object
}

// "<" is escaped so text inside the JSON can never close the script element
const JsonLd = ({ data }: Props) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c')
    }}
  />
)

export default JsonLd
