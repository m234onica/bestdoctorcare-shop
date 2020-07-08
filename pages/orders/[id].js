import { useRouter } from 'next/router'

export default () => {
  const { query } = useRouter()

  return <div>
    {query.id}
  </div>
}

