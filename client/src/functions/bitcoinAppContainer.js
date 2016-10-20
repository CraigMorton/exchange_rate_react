const formatCurrency = (amount, currency) => {
  if (amount == null) return amount
  const localeStringArgs = {
    GBP: ['en-UK', {style: 'currency', currency: 'GBP'}]
  }

  return amount.toLocaleString(...localeStringArgs[currency])
}

export {formatCurrency}

const calcPriceChange = function (oldPrice, newPrice) {
  if (oldPrice == null) oldPrice = newPrice

  const same = () => (oldPrice === newPrice)
  const greater = () => (oldPrice < newPrice)
  const lower = () => (oldPrice > newPrice)

  const equalityFunctions = {
    same, greater, lower
  }
  for (let key in equalityFunctions) {
    const equalityCaseFound = (equalityFunctions[key]())
    if (equalityCaseFound) {
      return key
    }
  }
  return null
}

export {calcPriceChange}
