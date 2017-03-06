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
  if (oldPrice == null) return 'same'

  const equalityStatus = {
    same: oldPrice === newPrice,
    greater: oldPrice < newPrice,
    lower: oldPrice > newPrice
  }

  for (let status in equalityStatus) {
    if (equalityStatus[status]) return status
  }
  return null
}

export {calcPriceChange}
