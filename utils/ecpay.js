import EcpayPayment from '@yukaii/ecpay_payment_nodejs'

export default new EcpayPayment()

export function parseTradeInfo (res) {
  const params = new URLSearchParams(res)
  return Array.from(
    params.entries()
  ).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value
    }),
    {}
  )
}
