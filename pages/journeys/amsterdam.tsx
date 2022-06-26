import Link from 'next/link'
import { GetStaticProps } from 'next'

import { getConfig, Config } from '../../libs/blog'
import Meta from '../../components/Meta'
import { getAllCalendars } from '../../libs/amsterdam'

interface Props {
  config: Config
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const config = getConfig()
  const calendars = await getAllCalendars()
  return {
    props: {
      config
    }
  }
}

const AmsterdamPage = ({ config }: Props) => {
  const { title, url } = config
  return (
    <>
      <Meta
        title={`${title}, Amsterdam`}
        description="New life chapter, Singapore 👉 Amsterdam"
        url={`${url}/journeys/amsterdam`}
      />
      <main>
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
        <h1>Amsterdam</h1>
        <p>
          ตอนย้ายมาอยู่สิงคโปร์ไม่ได้จดเก็บไว้ รอบนี้กำลังจะไปอยู่ Amsterdam
          เลยได้โอกาสจดเป็น Journey ยาวเก็บไว้ตั้งแต่ต้น title
          อาจจะเปลี่ยนถ้าอยู่มากกว่า Amsterdam แต่เริ่มต้นไว้แบบนี้ก่อน
        </p>
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
      </main>
    </>
  )
}
export default AmsterdamPage
