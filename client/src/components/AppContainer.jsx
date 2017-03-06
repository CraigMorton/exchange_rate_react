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
  componentDidUpdate: function (prevProps, prevState) {
    console.log('componentDidUpdate called')
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
  startRefreshLoop: function () {
    this.getData()
    const refreshLoopIntervalReference = setInterval(this.getData, 10000)
    this.setState({refreshLoopIntervalReference})
  },
  stopRefreshLoop: function () {
    clearInterval(this.state.refreshLoopIntervalReference)
  },
  shouldHitApi: function (refreshing) {
    const browserOnline = (window.navigator.onLine)
    // const browserOnline = (true) // TESTING ON A TRAIN
    const userRequestingRefresh = (refreshing)
    return (browserOnline && userRequestingRefresh)
  },
  toggleRefreshData: function (e) {
    console.log('refresh box checked?:', e.target.checked)
    const newRefreshState = !this.state.refreshing
    console.log('setting state to:', newRefreshState)
    this.setState({refreshing: newRefreshState})
    // setTimeout(() => {
      // need to wrap in setTimeout-0 to allow getData method to use this.state.refreshing, not only shouldHitApi mathod
      console.log('should hit API?', this.shouldHitApi(newRefreshState))
      if (this.shouldHitApi(newRefreshState)) {
        this.startRefreshLoop()
      }
      else {
        this.stopRefreshLoop()
      }
    // }, 0)
  },

    // is this.setState async? Why do I have to wrap in setTimeout(cb, 0) to keep state and checkbox in sync??
    // should be fine if I set refreshing state value from e.target...

    // Seems pointless / wasteful to touch the DOM to get e.target.checked
    // As I could simply use !this.state.refreshing - This is a toggle event listener.
  getData: function () {
    console.log(this.state.refreshing)
    if (this.shouldHitApi(this.state.refreshing)) {
      this.fetchData()
    }
    else {
      this.getDataLocalStorage()
    }
  },
  incompleteData: function () {
    return (this.state.euroPrice == null || this.state.exchangeRates.length === 0)
  },
  getDataLocalStorage: function () {
    console.log('hitting localStorage')
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
          // console.log('Price at', new Date(Date.now()), ':', euroPrice)
          // const priceChange = calcPriceChange(this.state.euroPrice, euroPrice)
          // this.setState({euroPrice, priceChange: priceChange})
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
          const rates = exchangeRateData.rates
          console.log('exchange rates from EURO: ', rates)
          resolve(rates)
        }
        else {
          reject(request)
        }
      }
      request.send()
    }))

    Promise.all(promises)
      .then(([euroPrice, exchangeRates]) => {
        console.log('PROMISES ALL BACK')
        const priceChange = calcPriceChange(this.state.euroPrice, euroPrice)
        this.setState({euroPrice, priceChange, exchangeRates})
      })
      .catch(function(err) {
        console.log('Promise CATCH:', err)
      })
  }
})



export default BitcoinAppContainer
