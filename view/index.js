import React from 'react';
import ReactDOM from 'react-dom';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "primeflex/primeflex.css"
import "./main.css"

import Login from './login';
 const App = props => (
   <div className="container">
        <Login className="login"  />
   </div>
 )
 ReactDOM.render(<App/>, document.getElementById('root'));