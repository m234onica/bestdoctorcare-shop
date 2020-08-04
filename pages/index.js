import { useContext } from 'react'
import { applySession } from 'next-session'
import Link from 'next/link'
import { useRouter } from 'next/router'

import withApollo from '../hooks/withApollo'

import AppContext from '../components/AppContext'
import Header from '../components/Header'
import Cart from '../components/Cart'
import { withUserContext } from '../components/UserContext'
import { encodeCollectionKey, decodeCollectionKey } from '../utils/browser'

function Home ({ user }) {
  const { collections, collectionsLoading } = useContext(AppContext)
  const { query: { collection: collectionName } } = useRouter()

  if (collectionsLoading || !collections) {
    return <h1>loading...</h1>
  }

  const mappedCollections = collections.edges.map(collection => collection.node)
  const targetedCollection = mappedCollections.find(c => decodeCollectionKey(c.title) === collectionName)

  const renderCollectionCards = () => mappedCollections.map(collection =>
    <Link href={`/?collection=${encodeCollectionKey(collection.title)}&page=1`} key={collection.id}>
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
            max-height: 23vh;
          }
        `}
        </style>
      </div>
    </Link>
  )

  const renderProductList = () => {
    const products = targetedCollection.products.edges.map(e => e.node)
    // TODO: pagination

    return (
      <div className='shop'>
        <div className='grid-layout grid-2-columns'>
          {
            products.map(product => {
              const images = product.images.edges.map(e => e.node)
              const firstImage = images[0]?.transformedSrc
              const variants = product.variants.edges.map(e => e.node)
              const firstVariantPrice = variants?.[0]?.priceV2.amount
              const productLink = `/product/${product.id}`

              return (
                <div className='grid-item' key={product.id}>
                  <div className='product'>
                    <div className='product-image' style={{ width: 380, height: 507 }}>
                      <Link href='/product/[id]' as={productLink}>
                        <img alt='Shop product image!' src={firstImage} style={{ objectFit: 'cover' }} />
                      </Link>
                    </div>
                    <div className='product-description'>
                      <div className='product-category'>{targetedCollection.title}</div>
                      <div className='product-title'>
                        <h3>
                          <Link href='/product/[id]' as={productLink}>
                            {product.title}
                          </Link>
                        </h3>
                      </div>
                      <div className='product-price'><ins>${firstVariantPrice}</ins>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header user={user} />
      <Cart />
      <div className='page-container container'>
        <main>
          {
            targetedCollection ? renderProductList() : renderCollectionCards()
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
