import Link from 'next/link'
import { getFeeds, getPageId } from '../utils/rss'

const NewsPage = ({ feeds }) => {
  return (
    <div className='page-container container'>
      <table className='table table-striped'>
        <thead className='thead'>
          <tr>
            <th>發表日期</th>
            <th>分類</th>
            <th>標題</th>
          </tr>
        </thead>
        <tbody>
          {
            feeds.items.map(item => (
              <tr key={item.link}>
                <td>{item.pubDate}</td>
                <td>{item.categories.join(', ')}</td>
                <td><Link href={`/news/${getPageId(item.link)}`}>{item.title}</Link></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export async function getServerSideProps (context) {
  const feeds = await getFeeds()

  // feeds.items.link
  // content:encoded
  // pubDate
  // link: ?p=5

  return {
    props: {
      feeds
    }
  }
}

export default NewsPage
