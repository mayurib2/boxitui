import React from 'react';

import {BrowserRouter, Router, Route, Link} from "react-router-dom";
import ViewFiles from "./components/files/ViewFiles";
import UploadFile from "./components/files/UploadFile";
import Header from "./components/Header";
import Callback from './routes/Callback'
import DeleteSuccessMessage from "./components/files/DeleteSuccessMessage";
import Home from './routes/Home'

import {createBrowserHistory} from 'history'
import UpdateExistingFile from "./components/files/UpdateExistingFile";

const history = createBrowserHistory()

const App = () => (
    <Router history={history}>
        <Route exact path="/" component={Home}/>
        <Route exact path="/files/view" component={ViewFiles}/>
        <Route exact path="/callback" component={Callback}/>
        <Route exact path="/files/upload" component={UploadFile}/>
        <Route exact path="/files/update" component={UpdateExistingFile}/>
        <Route path='/file/deletemessage/:file_detail_id' component={DeleteSuccessMessage}/>
    </Router>
)

export default App;
