import React from 'react'
import {formatCurrency, calcPriceChange} from '../functions/BitcoinAppContainer.js'

const BitcoinAppContainer = React.createClass({
  render: function () {
    return (
      <div>
      <h1 className={'price-' + this.state.priceChange}>{formatCurrency(this.state.price, 'GBP')}</h1>
      <label htmlFor='refreshing'>Refreshing data: </label>
      <input id='refreshing' type='checkbox' defaultChecked={true} onChange={this.toggleRefreshData}/>
      </div>
      )
  },
  toggleRefreshData: function (e) {
    setTimeout(() => {
      if (this.state.refreshing) this.getData()
    }, 0)
    this.setState({refreshing: !this.state.refreshing})
  },
  componentWillMount: function () {
    this.getData()
    setInterval(this.getData, 8000)
  },
  getData: function () {
    if (!this.state.refreshing) return;
    const request = new XMLHttpRequest
    request.open('GET', 'http://api.coindesk.com/v1/bpi/currentprice.json')
    request.onload = () => {
      if (request.status >= 200 && request.status < 400){
        const btcInfo = JSON.parse(request.responseText)
        const gbpPrice = btcInfo.bpi.GBP.rate_float
        console.log('price', gbpPrice, 'at', new Date(Date.now()))
        const priceChange = calcPriceChange(this.state.price, gbpPrice)
        this.setState({price: gbpPrice, priceChange: priceChange})
      }
    }
    request.send()
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    const colourChanged = this.state.priceChange != nextState.priceChange
    const priceChanged = this.state.price != nextState.price
    return colourChanged || priceChanged
  },
  getInitialState: function () {return {price: null, priceChange: 'same', refreshing: true}}

})



export default BitcoinAppContainer
