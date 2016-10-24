import React from 'react'
import BitcoinExchangeRateContainer from './BitcoinExchangeRateContainer.jsx'
import {calcPriceChange} from '../functions/bitcoinAppContainer.js'

const AppContainer = React.createClass({
  render: function () {
    return (<div>
      <BitcoinExchangeRateContainer
        btcData={this.state.btcData}
        exchangeRateData={this.state.exchangeRateData}
        price={this.state.btcData.bpi.GBP.rate_float}
        priceChange={this.state.priceChange}
        toggleRefreshData={this.toggleRefreshData}
        refreshing={this.state.refreshing}
      />
    </div>)
  },
  toggleRefreshData: function (e) {
    setTimeout(() => {
      if (this.state.refreshing) this.fetchData()
    }, 0)
    this.setState({refreshing: !this.state.refreshing})
  },
  componentWillMount: function () {
    this.fetchData()
    setInterval(this.fetchData, 55000)
  },
  fetchData: function () {
    if (!this.state.refreshing) return
    this.getDataLocalStorage();
    setTimeout(() => {
      if (this.state.btcData == null) {
        this.getBtcData()
      }
      if (this.state.exchangeRateData == null) {
        this.getExchangeRateData()
      }
    }, 0)
  },
  getBtcData: function () {
    if (!this.state.refreshing) return
    // if (localStorageDataNotOutOfDate) return
    const request = new XMLHttpRequest
    request.open('GET', 'http://api.coindesk.com/v1/bpi/currentprice.json')
    request.onload = () => {
      if (request.status >= 200 && request.status < 400){
        const btcData = JSON.parse(request.responseText)
        localStorage.setItem('btcData', JSON.stringify(btcData));
        const gbpPrice = btcData.bpi.GBP.rate_float
        console.log('price', gbpPrice, 'at', new Date(Date.now()))
        const priceChange = calcPriceChange(this.state.price, gbpPrice)
        this.setState({price: gbpPrice, priceChange: priceChange})
      }
    }
    request.send()
  },
  getExchangeRateData: function () {
    if (!this.state.refreshing) return
    // if (localStorageDataNotOutOfDate) return
    const request = new XMLHttpRequest
    request.open('GET', 'http://api.fixer.io/latest')
    request.onload = () => {
      if (request.status >= 200 && request.status < 400){
        const exchangeRateData = JSON.parse(request.responseText)
        localStorage.setItem('exchangeRateData', JSON.stringify(exchangeRateData));
      }
    }
    request.send()
  },
  getDataLocalStorage: function () {
    console.log((new Date("2016-10-20T22:46:00+00:00")).getTime())
    console.log(Date.now())
    const btcData = JSON.parse(localStorage.getItem('btcData'))
    const exchangeRateData = JSON.parse(localStorage.getItem('exchangeRateData'))
    this.toggleRefreshData()
    this.setState({btcData, exchangeRateData, price: btcData.bpi.GBP.rate_float})
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    const colourChanged = this.state.priceChange != nextState.priceChange
    const priceChanged = this.state.price != nextState.price
    return colourChanged || priceChanged
  },
  getInitialState: function () {
    return {
      refreshing: true,
      btcData: null,
      exchangeRateData: null,
      price: null,
      priceChange: 'same'
    }
  }
})

export default AppContainer
