
import React, { useState, useEffect } from 'react';
import { Card, Nav, Navbar, Button, Form, Tooltip } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from 'react-redux';
import imgurl from '../assets/images/imgUrl';
import API from "../util";
import { apiUrl } from "../util/urls";

import Sibebar from '../component/Sidebar';
import swal from "sweetalert";
import axios from "axios";

import { setLoader, setUserTemplate } from '../redux/actions/userAction'

const MyProfile = () => {
    const history = useHistory();
    const storeState = useSelector((state) => state)
    const userTemplate = useSelector((state) => state.programDetails.userTemplate)
    const dispatch = useDispatch();
    const userStoreState = useSelector((state) => state.user)
    const logoutClickHandler = () => {
        sessionStorage.clear()
        history.push('/')
    }
    console.log(userStoreState.userDetails)
    const [count, setCount] = useState();;
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
                                    {/* <Card.Header className="cardBlueHeader" as="h5">My Clients</Card.Header> */}
                                    <Card.Body className="odkDiv" >
                                        <div className="card choose-template-top-form">

                                            <div className="card-body">

                                                <h4 className="text-center mb-2"> User Profile</h4>
                                                <div className="container">
                                                    <div className="row mt-5">
                                                        <div className="col">
                                                            <div className="card-content text-center">
                                                                <i className="fas fa-user" style={{"font-size": "135px"}}></i>
                                                                <h5 className="mt-2">Username: {userStoreState.userDetails.username}</h5>
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="card-content">
                                                                <form className="">
                                                                    <div id="input-group-2" role="group" className="form-group">
                                                                        <label id="input-group-2__BV_label_" for="input-2" className="d-flex">First Name</label>
                                                                        <div className="bv-no-focus-ring">
                                                                            <input type="text" disabled="disabled" value={userStoreState.userDetails.firstName} className="form-control" id="__BVID__156"/>
                                                                        </div>
                                                                    </div>
                                                                    <div id="input-group-2" role="group" className="form-group">
                                                                        <label id="input-group-2__BV_label_" for="input-2" className="d-flex">Last Name</label>
                                                                        <div className="bv-no-focus-ring">
                                                                            <input type="text" disabled="disabled" value={userStoreState.userDetails.surname} className="form-control" id="__BVID__158" />
                                                                        </div>
                                                                    </div>
                                                                    <div id="input-group-2" role="group" className="form-group">
                                                                        <label id="input-group-2__BV_label_" for="input-2" className="d-flex">Email</label>
                                                                        <div className="bv-no-focus-ring">
                                                                        <input type="text" disabled="disabled" value={userStoreState.userDetails.email} className="form-control" id="__BVID__160" />
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </Card.Body>
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

export default MyProfile;