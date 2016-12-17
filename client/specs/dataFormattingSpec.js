import {assert} from 'chai'
import {calcPriceChange} from '../src/functions/dataFormatting.js'

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
