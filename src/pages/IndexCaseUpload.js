
import React, { useState, useEffect } from 'react';
import { Card, Nav, Navbar, Button, Form ,Tooltip,Row,Col} from 'react-bootstrap';
import { useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from 'react-redux';
import imgurl from '../assets/images/imgUrl';
import API from "../util";
import { apiUrl } from "../util/urls";
import {multipartPostCall} from "../util"

import Sibebar from '../component/Sidebar';
import swal from "sweetalert";
import axios from "axios";

import { setLoader, setUserTemplate } from '../redux/actions/userAction'

const IndexCaseUpload = () => {
    const [fileName, setFileName] = useState("Select File");
    const [selectedFile, setSelectedFile] = useState(null);
    const history = useHistory();
    const storeState = useSelector((state) => state)
    const userTemplate = useSelector((state) => state.programDetails.userTemplate)
    const dispatch = useDispatch();
    const userStoreState = useSelector((state) => state.user)
    const logoutClickHandler = () => {
        sessionStorage.clear()
        history.push('/')
    }
    console.log(storeState)
    const changeHandler = (e) => {
        setFileName(e.target.files[0].name);
        var file = e.target.files[0];
    
        setSelectedFile(file);
    
        return;
    }
    const uploadXML = () => {
        var frmData = new FormData();
        frmData.append("file", selectedFile)
        var reqObj = {
            "programid":storeState.programDetails.details.programuid
        }
        frmData.append("inputJsonString",JSON.stringify(reqObj))
        multipartPostCall('program/instance/patient/bulk/register',frmData).then(res =>{
            console.log(res)
        })
    }
    const downloadTemplate = () => {
        API.post('program/instance/download/index/template',{"programid":storeState.programDetails.details.programuid}).then(res => {
            console.log(res)
                let a = document.createElement('a');
                a.href = res.data.fileurl
                a.target = '_blank'
                a.click()
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
                                    <Card.Header className="cardBlueHeader" as="h5">Index Case Upload</Card.Header>
                                    {storeState.user.isEdit ?
                                        <Card.Body className="odkDiv" >
                                            <Row>
                                  <Col>
                                    <Form.Group
                                      controlId="formFileSm"
                                      className="mb-3"
                                    >
                                      <Form.Control
                                        data-title={fileName}
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        onChange={(e) => changeHandler(e)}
                                        type="file"
                                        size="sm"
                                      />
                                      <Button
                                        onClick={() => downloadTemplate()}
                                        className="nextbtn ml-2"
                                      >
                                        Download Template
                                      </Button>
                                      <Button
                                        onClick={() => uploadXML()}
                                        className="nextbtn ml-2"
                                      >
                                        Upload
                                      </Button>
                                    </Form.Group>
                                  </Col>
                                </Row>
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

export default IndexCaseUpload;