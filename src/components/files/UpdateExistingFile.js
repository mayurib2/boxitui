import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import appConfig from "../../config/app-config";
import {connect} from "react-redux";
import UploadSuccessMessage from "./UploadSuccessMessage";
import './UpdateExistingFile.css'
import cognitoUtils from "../../lib/cognitoUtils";

const mapStateToProps = state => {
    return {session: state.session}
}

class UpdateExistingFile extends Component {

    constructor(props, context) {
        super(props, context);
        console.log("UpdateExistingFile props ", props.location);
        console.log("UpdateExistingFile this.state ", this.state);
        this.state = {
            selectedFile: null,
            typedText: '',
            isUploadSuccess: 'false'

        }
    }
    onSignOut = (e) => {
        e.preventDefault()
        cognitoUtils.signOutCognitoSession()
    }

    onChangeHandler = event => {
        console.log(" UpdateExistingFile onChangeHandler this.props.session.credentials.idToken", this.props.session.credentials.idToken);
        console.log(event.target.files[0]);
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0
        });
    };

    onBlurHandler = event => {
        console.log(event.target.value);
        this.setState({typedText: event.target.value});
    };

    onClickHandler = async () => {
        let chosenFile = this.state.selectedFile;
        console.log("UpdateExistingFile selectedFile = ", chosenFile);
        console.log(" UpdateExistingFile onClickHandler this.props.session.credentials.idToken", this.props.session.credentials.idToken);
        let params = {
            user_file_name: chosenFile.name,
            file_type: chosenFile.type,
            is_existing_file: 'true'
        };

        console.log("UpdateExistingFile: Call to get preSignedUrl");
        // const {data: presignedPostData} = await apigClient.rkfilesPost(params, body, additionalParams);
        const {data: presignedPostData} = await axios.post(`${appConfig.apiUri}/signed_url`,
            params,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.session.credentials.idToken}`
                }
            });
        console.log("UpdateExistingFile presignedPostData ,", presignedPostData);
        console.log("UpdateExistingFile presignedPostData.body ,", presignedPostData.body);
        const formData = new FormData();
        Object.keys(presignedPostData.body.fields).forEach(key => {
            console.log("UpdateExistingFile key ", key);
            console.log("UpdateExistingFile presignedPostData.body.fields[key] ", presignedPostData.body.fields[key]);
            formData.append(key, presignedPostData.body.fields[key]);
        });
        formData.append('file', chosenFile);
        console.log("UpdateExistingFile MAKING UPLOAD CALL TO ", presignedPostData.body.url);
        let uploadResult = await axios.post(presignedPostData.body.url, formData);
        console.log(" UpdateExistingFile Before storing filedeatils presignedPostData.body ", presignedPostData.body);
        console.log(" UpdateExistingFile Before storing filedeatils presignedPostData.body.fields ", presignedPostData.body.fields);
        console.log(" UpdateExistingFile Before storing filedeatils presignedPostData.body.fields.key ", presignedPostData.body.fields.key);
        let update_file_details_params = {
            user_file_name: chosenFile.name,
            file_description: this.state.typedText,
            unique_file_name: presignedPostData.body.fields.key
        };
        console.log("create_file_details_params = ", JSON.stringify(update_file_details_params));

        let storedFileDetails = await axios.put(`${appConfig.apiUri}/file_details`,
            update_file_details_params,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.session.credentials.idToken}`
                }
            }
        );
        console.log("UpdateExistingFile uploadResult ", uploadResult);
        console.log("UpdateExistingFile storedFileDetails ", storedFileDetails);
        this.setState({isUploadSuccess: 'true'});

    };

    renderUploadResult() {
        if (this.state.isUploadSuccess === 'true') {
            return <UploadSuccessMessage/>
        }
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
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <form method="post" action="#" id="#">
                                    <div className="form-group files">
                                        <label>Upload Your File </label>
                                        <input className="new-file-update" type="file" name="file" onChange={this.onChangeHandler}/>
                                        <input type="text" onBlur={this.onBlurHandler}/>
                                        <button type="button" className="btn btn-success btn-block"
                                                onClick={this.onClickHandler}>Upload
                                        </button>

                                    </div>
                                </form>
                            </div>
                        </div>
                        {this.renderUploadResult()}
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

export default connect(mapStateToProps)(UpdateExistingFile)
