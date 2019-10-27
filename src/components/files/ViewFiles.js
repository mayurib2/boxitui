import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact';
import {connect} from "react-redux";
import appConfig from "../../config/app-config";
import request from "request";
import './ViewFiles.css'
import cognitoUtils from "../../lib/cognitoUtils";
import DeleteButton from "./DeleteButton";

const uuid = require('uuidv4').default;
const mapStateToProps = state => {
    return {session: state.session}
}

class ViewFiles extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {apiStatus: 'Not called',apiResponse:[]}
        console.log("ViewFiles props ", props.location);
        console.log("ViewFiles this.state ", this.state);
        this.getHeader = this.getHeader.bind(this);
        this.getRowsData = this.getRowsData.bind(this);
        this.getColumnKeys = this.getColumnKeys.bind(this);
        this.getDataKeys = this.getDataKeys.bind(this);
        // this.state = {
        //     selectedFile: null,
        //     typedText:'',
        //     isUploadSuccess:'false'
        //
        // }
    }

    // deleteFileRow = (index) => {
    //     let contacts = [...this.state.apiResponse];
    //     console.log("contacts ",contacts);
    //     contacts.splice(index, 1);
    //     this.setState({contacts});
    // }

    onSignOut = (e) => {
        e.preventDefault()
        cognitoUtils.signOutCognitoSession()
    }

    componentDidMount() {

        if (this.props.session.isLoggedIn) {
            // Call the API server GET /users endpoint with our JWT access token
            console.log("ViewFiles componentDidMount this.props.session.credentials.idToken ", this.props.session.credentials.idToken);
            const options = {
                url: `${appConfig.apiUri}/file_details`,
                headers: {
                    Authorization: `Bearer ${this.props.session.credentials.idToken}`
                }
            }
            console.log("Calling api with url ",options.url);

            this.setState({apiStatus: 'Loading...'});
            request.get(options, (err, resp, body) => {
                let apiStatus, apiResponse
                if (err) {
                    // is API server started and reachable?
                    apiStatus = 'Unable to reach API'
                    console.error(apiStatus + ': ' + err)
                } else if (resp.statusCode !== 200) {
                    // API returned an error
                    apiStatus = 'Error response received'
                    apiResponse = body
                    console.error(apiStatus + ': ' + JSON.stringify(resp))
                } else {
                    apiStatus = 'SUCCESS'
                    apiResponse = body
                    console.log("ViewFIles GET FILES API RESPONSE ", body);
                    // this.setState({apiStatus:"SUCCESS",apiResponse:body});
                    console.log("ViewFIles componentDidMount state ", this.state);
                }
                this.setState({apiStatus: apiStatus, apiResponse: body})
                // this.setState({ apiStatus, apiResponse })
            })
        }
    }

    getColumnKeys = function () {
        let columNames = ["First Name", "Last Name", "Upload Time", "Updated Time", "Description", "File Name","Delete"];
        return columNames;
    }

    getDataKeys = function () {
        let dataKeys = ["first_name", "last_name", "file_uploaded_at", "file_updated_at", "file_description", "user_file_name","delete_button"];
        return dataKeys;
    }

    getHeader = function () {
        var keys = this.getColumnKeys();
        return keys.map((key, index) => {
            return <th key={key}>{key.toUpperCase()}</th>
        })
    }

    // getRowsData = function(){
    //     var items = this.props.data;
    //     var keys = this.getColumnKeys();
    //     return items.map((row, index)=>{
    //         return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
    //     })
    // }
    getRowsData = function () {
        console.log("CALLING getRowsData");
        let isAPICallDone = this.state.apiStatus;

        // console.log("getRowsData myItems ",myItems);
        console.log("isAPICallDone  ", isAPICallDone);
        if (isAPICallDone === "SUCCESS") {
            let myItems = JSON.parse(this.state.apiResponse);
            let keys = this.getDataKeys();
            console.log("INSIDE IF isAPICallDone getRowsData myItems length ", myItems.length);
            console.log("INSIDE IF isAPICallDone getRowsData myItems  ", myItems);
            return myItems.map((row, index) => {
                console.log("row is ", row);
                return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
            })
            // myItems.map((myItem) => {
            //     console.log("********* Iterating getRowsData myItem ",myItem);
            // });


        } else {
            console.log(" *********** EMPTY EMPTY ROW CREATED");
            return <tr></tr>;
        }

    }

    render() {
        return (
            <div className="view-body">
                {this.props.session.isLoggedIn ? (
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <Link to="/">Home</Link>
                            </div>
                            <div className="col-md-3">
                                <Link to="/files/upload">Upload File</Link>
                            </div>
                            <div className="col-md-3">
                                <Link to="/files/update">Update Existing File</Link>
                            </div>
                        </div>
                        <MDBTable striped className="table table-bordered">
                            <MDBTableHead>
                                <tr>
                                    {this.getHeader()}
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                {this.getRowsData()}
                            </MDBTableBody>
                        </MDBTable>
                        <a className="Home-link" href="#" onClick={this.onSignOut}>Sign out</a>
                    </div>
                ) : (
                    <div>
                        <p>You are not logged in.</p>
                        <a className="Home-link" href={cognitoUtils.getCognitoSignInUri()}>Sign in</a>
                    </div>
                )}
            </div>
        )
    }
}

const RenderRow = (props) => {
    console.log("RenderRow props ", props);
    console.log("RenderRow props.keys ", props.keys);
    return props.keys.map((key, index) => {
        console.log("key ", key);
        console.log("props.data[key] ", props.data[key]);

        if (key === 'user_file_name') {
            let downloadUrl = appConfig.cloudfrontUri + props.data['unique_file_name'];
            console.log("downloadUrl = ",downloadUrl);
            return <td key={uuid()}><a href={downloadUrl}> {props.data[key]}</a></td>
        }
        else if(key === 'delete_button') {
            let linkUrl = '/file/deletemessage/'+ props.data['id'];
            return <td key={uuid()}><Link to={linkUrl}>Delete File</Link></td>

        }
        // else if(key && key === 'file_updated_at') {
        //     console.log("Inside if file_updated_at props.data[key]", props.data[key])
        //     let file_updated_at_date = new Date(props.data[key]);
        //     console.log("file_updated_at_date ",file_updated_at_date);
        //     return  <td key={uuid()}>{file_updated_at_date}</td>
        // }
        else
            return <td key={uuid()}>{props.data[key]}</td>
    })
}


export default connect(mapStateToProps)(ViewFiles)
