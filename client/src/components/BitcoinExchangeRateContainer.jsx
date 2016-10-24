import React from 'react'
import {formatCurrency} from '../functions/bitcoinAppContainer.js'

const BitcoinExchangeRateContainer = ({
	btcData,
	exchangeRateData,
	price,
	priceChange,
	toggleRefreshData,
	refreshing
}) => (
<div>
<h1 className={'price-' + priceChange}>{formatCurrency(price, 'GBP')}</h1>
<label htmlFor='refreshing'>Refreshing data: </label>
<input id='refreshing' type='checkbox' defaultChecked={refreshing} onChange={toggleRefreshData}/>
</div>
)

export default BitcoinExchangeRateContainer
