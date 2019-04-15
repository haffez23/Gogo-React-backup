import React from 'react';
import ReactDOM from 'react-dom';
import 'Assets/css/vendor/bootstrap.min.css'
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'Assets/css/sass/themes/gogo.light.red.scss';
const rootEl = document.getElementById("root");


let render = () => {
    const MainApp = require('./App').default;
    ReactDOM.render(
      <MainApp />,
      rootEl
    );
};

if (module.hot) {
  module.hot.accept('./App', () => {
      const NextApp = require('./App').default;
      render(
        <NextApp />,
        rootEl
      );
  });
}

render() 