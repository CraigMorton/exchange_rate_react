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
  toggleRefreshData: function (e) {
    console.log('checkbox value:', e.target.value)
    setTimeout(() => {
      if (this.state.refreshing) this.getData()
    }, 0)
    this.setState({refreshing: !this.state.refreshing})
  },
  componentWillMount: function () {
    this.getData()
    setInterval(this.getData, 10000)
  },

  getData: function () {
    if (!this.state.refreshing) return
    this.getDataLocalStorage()
    setTimeout(() => {
      if (this.state.euroPrice == null || this.state.exchangeRates.length === 0) {
        this.fetchData()
      }
    }, 0)
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
  },
  componentDidUpdate: function (prevProps, prevState) {
    console.log('component updated! prevState:', prevState)
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    // return true
    const colourChanged = this.state.priceChange != nextState.priceChange
    const priceChanged = this.state.price != nextState.price
    return colourChanged || priceChanged
  },
  getInitialState: function () {
    return {
      euroPrice: null,
      priceChange: 'same',
      exchangeRates: [],
      refreshing: true
    }
  }
})



export default BitcoinAppContainer
