
import React, { useState, useEffect } from 'react';
import { Card, Nav, Navbar, Button, Form } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from 'react-redux';
import imgurl from '../assets/images/imgUrl';
import API from "../util";

import Sibebar from '../component/Sidebar';
import swal from "sweetalert";

import { setLoader, setUserTemplate } from '../redux/actions/userAction'

const Odk = () => {
    const history = useHistory();
    const storeState = useSelector((state) => state)
    const userTemplate = useSelector((state) => state.programDetails.userTemplate)
    const dispatch = useDispatch();
    const userStoreState = useSelector((state) => state.user)
    const logoutClickHandler = () => {
        sessionStorage.clear()
        history.push('/')
    }
    const [fileName, setFileName] = useState('Select File')
    const [selectedFile, setSelectedFile] = useState(null);
    const changeHandler = (e) => {
        console.log(e)
        setFileName(e.target.files[0].name)
        var file = e.target.files[0];

        setSelectedFile(file);

        return;
        function updateProgress(evt) {
            if (evt.lengthComputable) {
                var loaded = (evt.loaded / evt.total);
                if (loaded < 1) {
                }
            }
        }

        function loaded(evt) {
            // Obtain the read file data    
            var fileString = evt.target.result;
            // Handle UTF-16 file dump
            setSelectedFile(fileString)
            // console.log(fileString)
            // $('#output_field').text(fileString);
        }
        var res = readFile(file);

        var reader = new FileReader();

        reader.readAsText(file, "UTF-8");

        reader.onprogress = updateProgress;
        reader.onload = loaded;
        // console.log(readFile(file))
    }
    function readFile(file) {
        var reader = new FileReader(),
            result = 'empty';
        reader.onload = function (e) {
            result = e.target.result;
        };

        reader.readAsText(file);
        return result
    }
    // console.log(storeState.user.userDetails.organisationUnits[0].id)
    const uploadODK = () => {
        dispatch(setLoader(true))
        API.post('odk/dhis/driver/save/' + storeState.user.userDetails.organisationUnits[0].id, selectedFile).then(res => {
            dispatch(setLoader(false))
            console.log(res)
            if (res.status == 200) {
                let elem = document.createElement("div");
                elem.innerHTML = res.data.message;
                swal({
                    title: "Success",
                    content: elem,
                    icon: "success",
                    button: "Close",
                }).then(function () {
                    API.get('dataset/smartsetup/get/' + storeState.user.userDetails.organisationUnits[0].id).then(res => {
                        userTemplate.appname = res.data.programdetails.appname
                        userTemplate.countries = res.data.programdetails.countries
                        userTemplate.description = res.data.programdetails.description
                        userTemplate.disclaimer = res.data.programdetails.disclaimer
                        userTemplate.logo = res.data.programdetails.logo
                        userTemplate.name = res.data.programdetails.name
                        userTemplate.selectedlanguage = res.data.programdetails.selectedlanguage
                        userTemplate.programstages = res.data.data
                        dispatch(setUserTemplate(userTemplate))
                    })
                    setSelectedFile(null)
                    setFileName('Select File')
                });
            } else {
                let elem = document.createElement("div");
                elem.innerHTML = res.data.httpStatus
                swal({
                    title: "Error",
                    content: elem,
                    icon: "error",
                    button: "Close",
                })
            }
        }).catch(error => {
            dispatch(setLoader(false))
            console.log(error)
        })
    }
    const uploadOdkXls = () => {
        var formdata = new FormData();
        formdata.append("file", selectedFile);
        dispatch(setLoader(true))
        API.post('odk/dhis/driver/save/' + storeState.user.userDetails.organisationUnits[0].id, formdata, { multipart: true })
            .then((res) => {
                dispatch(setLoader(false))
                if (res.status == 200) {
                    let elem = document.createElement("div");
                    elem.innerHTML = res.data.message;
                    swal({
                        title: "Success",
                        content: elem,
                        icon: "success",
                        button: "Close",
                    }).then(function () {
                        API.get('dataset/smartsetup/get/' + storeState.user.userDetails.organisationUnits[0].id).then(res => {
                            userTemplate.appname = res.data.programdetails.appname
                            userTemplate.countries = res.data.programdetails.countries
                            userTemplate.description = res.data.programdetails.description
                            userTemplate.disclaimer = res.data.programdetails.disclaimer
                            userTemplate.logo = res.data.programdetails.logo
                            userTemplate.name = res.data.programdetails.name
                            userTemplate.selectedlanguage = res.data.programdetails.selectedlanguage
                            userTemplate.datasets = res.data.data
                            dispatch(setUserTemplate(userTemplate))
                        })
                        setSelectedFile(null)
                        setFileName('Select File')
                    });
                } else {
                    dispatch(setLoader(false))
                    let elem = document.createElement("div");
                    elem.innerHTML = res.data.httpStatus
                    swal({
                        title: "Error",
                        content: elem,
                        icon: "error",
                        button: "Close",
                    })
                }
            }).catch(err =>{
                dispatch(setLoader(false))
                console.log(err)
            })
    }
    return (
        <>
            <Sibebar open={true} />
            <div className="contentapp">
                <Navbar expand="lg">
                    <button type="button" id="sidebarCollapse" className="btn btn-info hammenu"><i data-v-c3854e32="" className="fas fa-bars"></i></button>
                    <Navbar.Brand className="navTitle" href="#home"></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <img className="avatar mr-2" src={imgurl.avatar.default} />
                            <div>
                                <span className="name">{userStoreState.userDetails.name}</span><br></br>
                                <span>{userStoreState.userDetails.email}</span>
                            </div>
                            <button className="btn btn-sign" onClick={logoutClickHandler}><i className="fas fa-sign-out-alt fa-2x pull-right"></i></button>

                        </Nav>

                    </Navbar.Collapse>
                </Navbar>
                <div className="smart-setup-wrapper" style={{ height: "calc(100vh - 60px)" }}>
                    <div className="row">
                        <div className="col-12">
                            <div className="form-wizard ">
                                <Card>
                                    <Card.Header className="cardBlueHeader" as="h5">ODK Upload</Card.Header>
                                    {storeState.user.isEdit ?
                                        <Card.Body className="odkDiv" >
                                            <Form.Group controlId="formFileSm" className="mb-3">
                                                <Form.Control 
                                                data-title={fileName} 
                                                onChange={(e) => changeHandler(e)}
                                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                type="file" size="sm" />
                                                <Button onClick={() => uploadOdkXls()} className="nextbtn ml-2">Upload</Button>
                                            </Form.Group>
                                        </Card.Body> : <p>Program not published</p>}
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="row">
                    <div className="col-6">
                        <p className="footext">Powered by  <img className="fooimg" src={imgurl.durelogo.default} /></p>  </div>
                    <div className="col-6">
                        <div className="widthMaxContent ml-auto pt-2">
                            <p className="footextcopy">Copyright © 2020. All rights reserved</p></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Odk;