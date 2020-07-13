import shopify from '../../utils/shopify'

// TotalSuccessTimes: '',
// PaymentNo: '',
// red_dan: '',
// red_yet: '',
// gwsr: '',
// red_ok_amt: '',
// PeriodType: '',
// SimulatePaid: '1',
// AlipayTradeNo: '',
// MerchantID: '3118899',
// TenpayTradeNo: '',
// WebATMAccNo: '',
// TradeDate: '2020/07/09 07:24:01',
// PaymentTypeChargeFee: '0',
// RtnMsg: '付款成功',
// CustomField4: '',
// PayFrom: '',
// ATMAccBank: '',
// PaymentType: 'ATM_FUBON',
// TotalSuccessAmount: '',
// MerchantTradeNo: '3507f5c18a764272ba40',
// StoreID: '',
// stage: '',
// WebATMAccBank: '',
// CustomField1: '640496894103',
// PeriodAmount: '',
// TradeNo: '2007090724012143',
// card4no: '',
// card6no: '',
// auth_code: '',
// stast: '',
// PaymentDate: '2020/07/09 07:35:30',
// CheckMacValue: '82DC1F24A9D38B2F70F03510763FDE72E0F75E502BFAEB030E75BFF2FF1C1781',
// RtnCode: '1',
// eci: '',
// TradeAmt: '100',
// Frequency: '',
// red_de_amt: '',
// process_date: '',
// amount: '',
// CustomField2: 'U4b1e176a9359872cd9ec6a2e4b01dc64',
// ATMAccNo: '',
// ExecTimes: '',
// CustomField3: '',
// staed: '',
// WebATMBankName: '',
// AlipayID: ''

/**
 * @param {import('next/types').NextApiRequest} req
 * @param {import('next/types').NextApiResponse} res
 */
export default async (req, res) => {
  const paymentData = req.body

  if (!paymentData) {
    return res.json({
      status: 'error'
    })
  }

  // TODO: verify request
  // TODO: verify request order amount

  const { draftOrderComplete: { userErrors } } = await shopify.graphql(`
    mutation draftOrderComplete($id: ID!) {
      draftOrderComplete(id: $id) {
        draftOrder {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    id: paymentData.CustomField1
  })

  if (userErrors.length > 0) {
    console.error({
      type: 'draftOrderCompleteError',
      userErrors
    })
    return res.end()
  }

  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('1|OK')
  return res.end()
}
