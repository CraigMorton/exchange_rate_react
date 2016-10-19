import React from 'react';

const currencyFormat = price => {
  if (price == null) return price;
  return price.toLocaleString('en-UK', {style: 'currency', currency: 'GBP'});
};

const calcPriceChange = function (oldPrice, newPrice) {
  if (oldPrice == null) oldPrice = newPrice;

  const same = () => (oldPrice === newPrice);
  const greater = () => (oldPrice < newPrice);
  const lower = () => (oldPrice > newPrice);

  const lookup = {
    same, greater, lower
  };
  const keys = Object.keys(lookup);
  for (let i = 0; i < keys.length; i++) {
    const foundTrue = (lookup[ keys[i] ]() )
    if (foundTrue) {
      console.log(keys[i]);
      return keys[i];
    }
  }
};

const BitcoinAppContainer = React.createClass({
  render: function () {
    return (
      <div>
      <h1 className={'price-' + this.state.priceChange}>{currencyFormat(this.state.price)}</h1>
      </div>
      )
  },
  componentWillMount: function () {
    this.getData();
    setInterval(this.getData, 10000);
  },
  getData: function () {
    const request = new XMLHttpRequest;
    request.open('GET', 'http://api.coindesk.com/v1/bpi/currentprice.json');
    request.onload = () => {
      if (request.status >= 200 && request.status < 400){
        const btcInfo = JSON.parse(request.responseText);
        const gbpPrice = btcInfo.bpi.GBP.rate_float;
        console.log("Price at", new Date(Date.now()), ":", gbpPrice);
        const priceChange = calcPriceChange(this.state.price, gbpPrice);
        this.setState({price: gbpPrice, priceChange: priceChange});
      }
    };
    request.send();
  },
  componentDidUpdate: function (prevProps, prevState) {
    console.log("updated!")
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    const colourChanged = this.state.priceChange != nextState.priceChange;
    const priceChanged = this.state.price != nextState.price;
    return colourChanged || priceChanged
  },
  getInitialState: function () {return {price: null, priceChange: "same"}}

});



export default BitcoinAppContainer;
