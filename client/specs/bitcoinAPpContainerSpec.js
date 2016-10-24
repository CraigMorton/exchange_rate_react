import {assert} from 'chai'
import {formatCurrency, calcPriceChange} from '../src/functions/bitcoinAppContainer.js'

describe('formatCurrency', () => {
  it('should format for GBP', () => {
    const gbpPrice = formatCurrency(1.23456, 'GBP')
    assert.equal(gbpPrice, '£1.23')
  })

})

describe('calcPriceChange', () => {
  it('should identify matching prices', () => {
    const priceChange = calcPriceChange(1, 1)
    assert.equal(priceChange, 'same')
  })

  it('should identify lower price', () => {
    const priceChange = calcPriceChange(2, 1)
    assert.equal(priceChange, 'lower')
  })

  it('should identify greater price', () => {
    const priceChange = calcPriceChange(1, 2)
    assert.equal(priceChange, 'greater')
  })

})
