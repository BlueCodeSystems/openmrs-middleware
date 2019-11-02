import React from 'react';
import {FileUpload} from 'primereact/fileupload';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


 const Login = props => (

    <FileUpload name="demo[]" url="./upload" multiple={true} className={props.className} />

 )
export default Login;