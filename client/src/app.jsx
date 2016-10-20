import React from 'react';
import ReactDOM from 'react-dom';
import BitcoinAppContainer from './components/BitcoinAppContainer.jsx';

window.onload = function(){
  ReactDOM.render(
    <BitcoinAppContainer />,
    document.getElementById('app')
  );
};
