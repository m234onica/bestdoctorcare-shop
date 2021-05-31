import { useQuery } from 'react-query'

export const useAvailableDiscounts = (user) => {
  const { data, isSuccess } = useQuery('availableDiscounts', () => window.fetch('/api/availableDiscounts').then(r => r.json()), {
    enabled: !!user,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  })

  // use oldest discount first
  const usedDiscount = data && data.discounts.sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf())[0]

  return { usedDiscount, isSuccess }
}
