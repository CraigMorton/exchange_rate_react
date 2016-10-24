import React from 'react'
import ExchangeRateDisplay from './ExchangeRateDisplay.jsx'

const ExchangeRates = ({
  btcPrices,
  priceChange
}) => (
  <div>
    {btcPrices.map((btcPrice, index) => <ExchangeRateDisplay value={btcPrice.price} currency={btcPrice.currency} change={priceChange} key={index}/>)}
  </div>
)

export default ExchangeRates
