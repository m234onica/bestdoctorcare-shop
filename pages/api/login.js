import shopify from '../../utils/shopify'

export default async (req, res) => {
  const products = await shopify.product.list()
  return res.send({ products })
}
