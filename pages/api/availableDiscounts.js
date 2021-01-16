import { withSession } from '../../utils/session'
import { getAvailableDiscountsFromCustomer } from '../../services/discount'

/**
 * @param {import('next/types').NextApiRequest} req
 * @param {import('next/types').NextApiResponse} res
 */
const handler = async (req, res) => {
  const { user } = req.session

  if (!user) {
    return res.json({
      error: 'Login required'
    })
  }

  const discounts = await getAvailableDiscountsFromCustomer(user)
  return res.json({
    discounts
  })
}

export default withSession(handler)
