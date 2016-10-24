import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './components/AppContainer.jsx';

window.onload = function(){
  ReactDOM.render(
    <AppContainer />,
    document.getElementById('app')
  );
};
