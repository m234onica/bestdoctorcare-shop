export const encodeCollectionKey = s => encodeURIComponent(s)
export const decodeCollectionKey = s => decodeURIComponent(s)

export const submitForm = ({ method = 'POST', action, values }) => {
  const form = document.createElement('form')

  values.forEach(({ name, value }) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  })

  form.method = method
  form.action = action

  document.body.appendChild(form)
  form.submit()
}

export const BANK_DATA = {
  TAISHIN: {
    name: '台新銀行',
    code: '812'
  },
  ESUN: {
    name: '玉山銀行',
    code: '808'
  },
  BOT: {
    name: '台灣銀行',
    code: '004'
  },
  FUBON: {
    name: '台北富邦',
    code: '012'
  },
  CHINATRUST: {
    name: '中國信託',
    code: '822'
  },
  FIRST: {
    name: '第一銀行',
    code: '007'
  },
  LAND: {
    name: '土地銀行',
    code: '005'
  },
  CATHAY: {
    name: '國泰世華',
    code: '013'
  },
  TACHONG: {
    name: '大眾銀行',
    code: '814'
  }
}

export const getBankData = (paymentType = '') => BANK_DATA[paymentType.split('ATM_')[1]]

export const getMetafield = (obj, key) => {
  return obj.metafields.edges.find(e => {
    const field = e.node
    return field.key === key
  })?.node?.value
}

export const getPaymentType = order => getMetafield(order, 'ecpay_payment_type')
export const getPaymentVirtualAccount = order => getMetafield(order, 'ecpay_virtual_account')
