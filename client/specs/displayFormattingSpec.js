import {assert} from 'chai'
import {formatCurrency} from '../src/functions/displayFormatting.js'

describe('formatCurrency', () => {
  it('should format for GBP', () => {
    const gbpPrice = formatCurrency(1.23456, 'GBP')
    assert.equal(gbpPrice, '£1.23')
  })

})
