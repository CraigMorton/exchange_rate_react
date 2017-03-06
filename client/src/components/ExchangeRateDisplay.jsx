import React from 'react'
import {formatCurrency} from '../functions/displayFormatting.js'

const ExchangeRateDisplay = ({
  value,
  currency,
  change
}) => (
  <h3 className={'price-' + change}>{currency + ': ' + formatCurrency(value, currency)}</h3>
)

export default ExchangeRateDisplay
