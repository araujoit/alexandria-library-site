import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  //// removido, pois estava causando dupla invocação de hooks do react-query
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
  ,
  document.getElementById('root')
)
