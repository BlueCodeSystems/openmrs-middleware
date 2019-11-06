import React, {useState} from 'react';
import {FileUpload} from 'primereact/fileupload';
import './upload.css';




function Upload(props){

    const view = {upload:1,success:2,failure:4}

    const [state, setState] = useState({currentView:view.upload});

    const addToken = e =>{ e.xhr.setRequestHeader("x-access-token", props.token)}

    const onSuccess = () => setState({currentView:view.success})

    const onFailure = () => setState({currentView:view.failure})


    switch (state.currentView) {

        case view.upload:
            return (
            <div className="container-upload">
                <div>
                    <h3>Select or drag and drop images</h3>
                </div>
                <FileUpload name={props.name} url="/smartcerv/upload" multiple={true} accept="image/*" onBeforeSend={addToken} onUpload={onSuccess} onError={onFailure}  />
            </div>)
            break;
    
        case view.success:
            return (
            <div className="container-upload">
                <h3 className="success">Success</h3>
            </div>)
            break;

        case view.failure:
            return (
            <div className="container-upload">
                <h3 className="failure">Failed</h3>
            </div>)
            break;
    }
}

export default Upload;