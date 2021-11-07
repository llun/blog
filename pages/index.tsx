import Header from '../components/Header'
import Meta from '../components/Meta'

function Index() {
  const title = '@แนท'
  const description = 'My notebook'
  const url = 'https://www.llun.me'
  return (
    <>
      <Meta title={title} description={description} url={url} />
      <Header title={title} url={url} />
    </>
  )
}

export default Index
