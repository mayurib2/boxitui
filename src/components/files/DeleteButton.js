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

class DeleteButton extends Component {
    onClick = async function () {

        try {
            let fileDetailId = this.props.index;
            console.log("Inside DeleteButton fileDetailId ",fileDetailId);
            this.props.deleteFileRow(fileDetailId);

            // let delete_file_details_params = {
            //     email: email,
            //     unique_file_name: unique_file_name
            // };
            console.log("Call delete  delete_file_details_params = ",);

            let deleteFileDetails = await axios.delete(`${appConfig.apiUri}/file_details/${fileDetailId}`,

                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.props.session.credentials.idToken}`
                    }
                }
            );
            console.log("deleteFileDetails ", deleteFileDetails)
        } catch (e) {
            console.log("Error in delete button deleting file ", e);
        }

    }

    render = function () {
        return (
            <button onClick={() => {
                this.onClick()
            }}>Delete</button>
        )
    }
}

export default connect(mapStateToProps)(DeleteButton)
