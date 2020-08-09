import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default () => {
  const router = useRouter()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (router.query.id) {
      fetch(`/api/orders?orderId=${router.query.id}`)
        .then(r => r.json())
        .then(data => {
          console.log(data.order)
          if (data.order) {
            setOrder(data.order)
          }
        })
    }
  }, [router.query.id])

  return (
    <div className='page-container'>
      <code>
        {JSON.stringify(order)}
      </code>
    </div>
  )
}
