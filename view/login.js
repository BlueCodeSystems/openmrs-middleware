import React, {useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import './login.css';
import axios from "axios";
import Upload from "./upload";



 function Login(){
   
  const [state, setState] = useState({username:"", password:"", authorzed: false, name:"", incorrectCredentials:false, token:""});

  const emitUsername = username => setState({ ...state,username })

  const emitPassword = password => setState({ ...state,password })

    const submit = async() => {
      
      let token;
      try{
         let result = await axios.get("/middleware/rest/session", {auth:{ username:state.username, password:state.password}});
         token = result.data.token;
         let facilityId = result.data.user.location[0]["location_id"];

         if(token != undefined && facilityId != undefined)
            setState({...state, authorzed:true, name:facilityId.toString(),token})
      }catch(e){
         console.log('error');
         setState({...state, authorzed:false, incorrectCredentials:true})
      }

    }

    return (!state.authorzed)?(

    <div className="card">
          <h3>Enter your Smartcerv credentials</h3>
          <InputText placeholder="Username" className="inputs"  onChange={(e) => emitUsername(e.target.value)}/>
          <Password  className="inputs"  onChange={(e) => emitPassword(e.target.value)} />      
          <Button  className="inputs" label="Login" onClick={submit}/>
          {(state.incorrectCredentials)?<p className="login-error-messege">Username or password is incorrect</p>:<span></span>}
    </div>
  )
  :
  (<Upload name={state.name} token={state.token} />)
}
export default Login;