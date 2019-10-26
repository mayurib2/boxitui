import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact';
import {connect} from "react-redux";
import appConfig from "../../config/app-config";
import request from "request";
import './ViewFiles.css'
import cognitoUtils from "../../lib/cognitoUtils";
import axios from "axios";

const uuid = require('uuidv4').default;

const mapStateToProps = state => {
    return {session: state.session}
}

class DeleteSuccessMessage extends Component {
    constructor(props, context) {
        super(props)
        this.state = { apiStatus: 'Not called' }
    }

    componentDidMount() {
        const { file_detail_id } = this.props.match.params;

        console.log("Inside DeleteSuccessMessage file_detail_id ", file_detail_id);
        // console.log("Inside DeleteSuccessMessage this.props.session.credentials.idToken ", this.props.session.credentials.idToken);


        // let delete_file_details_params = {
        //     email: email,
        //     unique_file_name: unique_file_name
        // };
        console.log("Call delete  delete_file_details_params = ",);

        axios.delete(`${appConfig.apiUri}/file_details/${file_detail_id}`,

            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.session.credentials.idToken}`
                }
            }
        ).then((data) => {
            console.log("File delete successful");
        }).catch((err) => {
            console.log("Error while deleting file ",err);
        });



    }

    render() {
        return (
            <div className="update-file-body">
                {this.props.session.isLoggedIn ? (
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <Link to="/">Home</Link>
                            </div>
                            <div className="col-md-3">
                                <Link to="/files/view">View Uploaded Files</Link>
                            </div>
                            <div className="col-md-3">
                                <Link to="/files/upload">Upload File</Link>
                            </div>
                            <div className="col-md-3">
                                <Link to="/files/update">Update Existing File</Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                             Successfully deleted file !!
                            </div>
                        </div>

                        <a className="Home-link" href="#" onClick={this.onSignOut}>Sign out</a>
                    </div>
                ) : (
                    <div>
                        <p>You are not logged in.</p>
                        <a className="Home-link" href={cognitoUtils.getCognitoSignInUri()}>Sign in</a>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps)(DeleteSuccessMessage)
