import React from 'react';
import ReactDOM from 'react-dom';

import Login from './login';
 const App = props => (
   <div className={props.className}>
     <Login className={props.className} />
   </div>
 )
 ReactDOM.render(<App/>, document.getElementById('root'));