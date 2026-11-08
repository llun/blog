import { albumPage } from '../../../../components/AlbumPage'

const { generateStaticParams, generateMetadata, Page } = albumPage('birds')

export { generateStaticParams, generateMetadata }
export default Page
