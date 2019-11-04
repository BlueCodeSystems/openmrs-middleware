import React, {useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import {Card} from 'primereact/card';
import './login.css';
import axios from "axios";



 function Login(){
   
  const [state, setState] = useState({username:"", password:""});

  const emitUsername = username => {

    const password = state.password;
    setState({ username, password });
  }

  const emitPassword = password => {

    const username = state.username;
    setState({ username, password });
  }

    const submit = async() => {
      console.log("submitted",state);
      let result = await axios.get("https://openmrs.bluecodeltd.com/middleware/rest/session", {auth:{ username:state.username, password:state.password}});

      console.log('result', result);

    }

    return(

    <Card className="card">
          <h3>Enter your credentials</h3>
          <InputText placeholder="Username" className="inputs"  onChange={(e) => emitUsername(e.target.value)}/>
          <Password  className="inputs"  onChange={(e) => emitPassword(e.target.value)} />      
          <Button  className="inputs" label="Login" onClick={submit}/>
    
    </Card>
  )
}
export default Login;