import Link from 'next/link'
import { getFeeds, getPageId } from '../../utils/rss'

const News = ({ feed }) => {
  return (
    <div className='page-container container'>
      <Link href='/news'>上一頁</Link>
      <h1>{feed.title}</h1>

      <div className='markdown-body' dangerouslySetInnerHTML={{ __html: feed['content:encoded'] }} />
    </div>
  )
}

export async function getServerSideProps (context) {
  const feeds = await getFeeds()
  const feed = feeds.items.find(item => getPageId(item.link) === context.query.id)

  // feeds.items.link
  // content:encoded
  // pubDate
  // link: ?p=5

  return {
    props: {
      feed
    }
  }
}

export default News
