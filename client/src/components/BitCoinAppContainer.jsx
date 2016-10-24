import React from 'react'
import ExchangeRates from './ExchangeRates.jsx'
import {buildExchangeRateObject} from '../functions/dataFormatting.js'

const calcPriceChange = function (oldPrice, newPrice) {
  if (oldPrice == null) oldPrice = newPrice

  const same = () => (oldPrice === newPrice)
  const greater = () => (oldPrice < newPrice)
  const lower = () => (oldPrice > newPrice)

  const lookup = {
    same, greater, lower
  }
  const keys = Object.keys(lookup)
  for (let i = 0; i < keys.length; i++) {
    const foundTrue = (lookup[ keys[i] ]() )
    if (foundTrue) {
      // console.log(keys[i])
      return keys[i]
    }
  }
}

const BitcoinAppContainer = React.createClass({
  render: function () {
    return (
      <div>
      <ExchangeRates priceChange={this.state.priceChange} btcPrices={buildExchangeRateObject(this.state.euroPrice, this.state.exchangeRates)}/>
      </div>
      )
  },
  componentWillMount: function () {
    this.getData()
    // this.getExchangeRateData()
    setInterval(this.getData, 10000)
    // setInterval(this.getExchangeRateData, 10000)
  },
  getData: function () {
    const promises = []

    promises.push(new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('GET', 'http://api.coindesk.com/v1/bpi/currentprice.json')
      request.onload = () => {
        if (request.status >= 200 && request.status < 400){
          const btcInfo = JSON.parse(request.responseText)
          const euroPrice = btcInfo.bpi.EUR.rate_float
          resolve(euroPrice)
          // console.log("Price at", new Date(Date.now()), ":", euroPrice)
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
      }
      request.send()
    }))

    Promise.all(promises)  
      .then(([euroPrice, exchangeRates]) => {
        console.log("PROMISES ALL BACK")
        const priceChange = calcPriceChange(this.state.euroPrice, euroPrice)
        this.setState({euroPrice, priceChange, exchangeRates})
      })
      .catch(function(err) {
        console.log("Promise CATCH:", err);
      });
  },
  componentDidUpdate: function (prevProps, prevState) {
    // console.log("updated!")
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    return true
    const colourChanged = this.state.priceChange != nextState.priceChange
    const priceChanged = this.state.price != nextState.price
    console.log(colourChanged + "" + priceChanged)
    return colourChanged || priceChanged
  },
  getInitialState: function () {return {euroPrice: null, priceChange: "same", exchangeRates: []}}

})



export default BitcoinAppContainer
