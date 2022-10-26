import React from 'react'
import ReactModal from 'react-modal'
import '../public/css/index.css'

ReactModal.setAppElement('#__next')

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
