const buildExchangeRateObject = (euroBtcPrice, exchangeRates) => {
  const btcPrices = [{currency: 'EUR', price: euroBtcPrice}]
  for (let currency in exchangeRates) {
    let btcRate = {currency, price: exchangeRates[currency] * euroBtcPrice}
    btcPrices.push(btcRate)
  }
  return btcPrices
}

export {buildExchangeRateObject}

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
