import React, {useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import {Card} from 'primereact/card';
import './login.css';
import axios from "axios";
import Upload from "./upload";



 function Login(){
   
  const [state, setState] = useState({username:"", password:"", authorzed: false, name:""});

  const emitUsername = username => {

    const password = state.password;
    const authorzed = state.authorzed;
    setState({ username, password,authorzed });
  }

  const emitPassword = password => {

    const username = state.username;
    const authorzed = state.authorzed;
    setState({ username, password,authorzed });
  }

    const submit = async() => {
      console.log("submitted",state);

      const username = state.username;
      const password = state.password;
      const name = state.name;
      
      let token;
      try{
         let result = await axios.get("http://34.240.241.171:8087/middleware/rest/session", {auth:{ username:state.username, password:state.password}});
         token = result.data.token;
         let facilityId = result.data.user.location[0]["location_id"];

         if(token != undefined && facilityId != undefined)
            setState({username, password, authorzed:true, name:facilityId.toString()})
      }catch(e){
         console.log('error');
         setState({username, password, authorzed:false, name})
      }

    }

    return (!state.authorzed)?(

    <Card className="card">
          <h3>Enter your credentials</h3>
          <InputText placeholder="Username" className="inputs"  onChange={(e) => emitUsername(e.target.value)}/>
          <Password  className="inputs"  onChange={(e) => emitPassword(e.target.value)} />      
          <Button  className="inputs" label="Login" onClick={submit}/>
    
    </Card>
  )
  :
  (<Upload name={state.name} />)
}
export default Login;