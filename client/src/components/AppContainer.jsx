import React from 'react'
import ExchangeRates from './ExchangeRates.jsx'
import {buildExchangeRateObject} from '../functions/dataFormatting.js'
import {calcPriceChange} from '../functions/dataFormatting.js'
import SettingsBox from './SettingsBox.jsx'

const BitcoinAppContainer = React.createClass({
  render: function () {
    return (
      <div>
      <SettingsBox toggleRefreshData={this.toggleRefreshData}/>
      <ExchangeRates priceChange={this.state.priceChange} btcPrices={buildExchangeRateObject(this.state.euroPrice, this.state.exchangeRates)}/>
      </div>
    )
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    const colourChanged = this.state.priceChange != nextState.priceChange
    const priceChanged = this.state.euroPrice != nextState.euroPrice
    return colourChanged || priceChanged
  },
  componentWillMount: function () {
    this.startRefreshLoop()
  },
  getInitialState: function () {
    return {
      euroPrice: null,
      priceChange: 'same',
      exchangeRates: [],
      refreshing: true
    }
  },
  startRefreshLoop: function (refreshing) {
    this.getData(refreshing)
    const refreshLoopIntervalReference = setInterval(this.getData, 10000)
    this.setState({refreshLoopIntervalReference})
  },
  stopRefreshLoop: function () {
    clearInterval(this.state.refreshLoopIntervalReference)
  },
  shouldHitApi: function (refreshing) {
    const browserOnline = window.navigator.onLine
    const userRequestingRefresh = refreshing
    return (browserOnline && userRequestingRefresh)
  },
  toggleRefreshData: function () {
    const refreshing = !this.state.refreshing
    this.setState({refreshing})
    if (this.shouldHitApi(refreshing)) {
      this.startRefreshLoop(refreshing)
    }
    else {
      this.stopRefreshLoop()
    }
  },
  getData: function (refreshing) {
    const refreshRecentlyRequested = this.shouldHitApi(refreshing)
    const refreshingInState = this.shouldHitApi(this.state.refreshing)
    if (refreshRecentlyRequested || refreshingInState) {
      this.fetchData()
    }
    else {
      this.getDataLocalStorage()
    }
  },
  incompleteData: function () {
    return this.state.euroPrice == null || this.state.exchangeRates.length === 0
  },
  getDataLocalStorage: function () {
    const btcInfo = JSON.parse(localStorage.getItem('btcData'))
    const exchangeRatesInfo = JSON.parse(localStorage.getItem('exchangeRateData'))
    const exchangeRates = exchangeRatesInfo.rates
    const euroPrice = btcInfo.bpi.EUR.rate_float
    const priceChange = calcPriceChange(this.state.euroPrice, euroPrice)
    this.setState({euroPrice, priceChange, exchangeRates})
  },
  fetchData: function () {
    const promises = []
    promises.push(new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('GET', 'http://api.coindesk.com/v1/bpi/currentprice.json')
      request.onload = () => {
        if (request.status >= 200 && request.status < 400){
          const btcInfo = JSON.parse(request.responseText)
          const euroPrice = btcInfo.bpi.EUR.rate_float
          resolve(euroPrice)
        }
        else {
          reject(request)
        }
      }
      request.send()
    }))

    promises.push(new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('GET', 'http://api.fixer.io/latest')
      request.onload = () => {
        if (request.status >= 200 && request.status < 400){
          const exchangeRateData = JSON.parse(request.responseText)
          resolve(exchangeRateData.rates)
        }
        else {
          reject(request)
        }
      }
      request.send()
    }))

    Promise.all(promises)
      .then(([euroPrice, exchangeRates]) => {
        const priceChange = calcPriceChange(this.state.euroPrice, euroPrice)
        this.setState({euroPrice, priceChange, exchangeRates})
      })
      .catch(function(error) {
        console.error(error)
      })
  }
})



export default BitcoinAppContainer
