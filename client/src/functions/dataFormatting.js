const buildExchangeRateObject = (euroBtcPrice, exchangeRates) => {
  const btcPrices = [{currency: 'EUR', price: euroBtcPrice}]
  for (let currency in exchangeRates) {
    let btcRate = {currency, price: exchangeRates[currency] * euroBtcPrice}
    btcPrices.push(btcRate)
  }
  // console.log(exchangeRates)
  // console.log(btcPrices)
  return btcPrices
}

export {buildExchangeRateObject}
