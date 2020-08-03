import { useContext } from 'react'
import { applySession } from 'next-session'
import Link from 'next/link'
import { useSearchParam } from 'react-use'

import withApollo from '../hooks/withApollo'

import AppContext from '../components/AppContext'
import Header from '../components/Header'
import Cart from '../components/Cart'
import { withUserContext } from '../components/UserContext'
import { encodeCollectionKey, decodeCollectionKey } from '../utils/browser'

function Home ({ user }) {
  const { collections, collectionsLoading } = useContext(AppContext)

  if (collectionsLoading || !collections) {
    return <h1>loading...</h1>
  }

  const mappedCollections = collections.edges.map(collection => collection.node)

  const collectionName = useSearchParam('collection')
  const targetedCollection = mappedCollections.find(c => decodeCollectionKey(c.title) === collectionName)

  const renderCollectionCards = () => mappedCollections.map(collection =>
    <Link href={`/?collection=${encodeCollectionKey(collection.title)}`} key={collection.id}>
      <div className='collection-card card text-white bg-dark' style={{ cursor: 'pointer', overflow: 'hidden' }}>
        <img className='card-img' src={collection.image.transformedSrc} alt='' />
        <div className='card-img-overlay text-center d-flex align-items-center justify-content-center'>
          <h2 className='card-title'>
            {collection.title}
          </h2>
        </div>
        <style jsx>{`
          .collection-card {
            height: 300px;
          }
        `}
        </style>
      </div>
    </Link>
  )

  return (
    <div>
      <Header user={user} />
      <Cart />
      <div className='page-container container'>
        <main>
          {
            targetedCollection ? <p>Render products....</p> : renderCollectionCards()
          }
        </main>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ req, res }) => {
  await applySession(req, res)

  return {
    props: {
      user: req.session.user || null
    }
  }
}

export default withApollo(withUserContext(Home))
