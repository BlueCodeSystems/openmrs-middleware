import React, {useState} from 'react';
import {FileUpload} from 'primereact/fileupload';


function Upload(props){

    return (<FileUpload name={props.name} url="http://34.240.241.171:8087/smartcerv/upload" multiple={true} accept="image/*" />)
}

export default Upload;