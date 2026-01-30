
import React,{useState,useEffect} from 'react';
import { Card, Nav, Navbar, Button, Form, Table, Tabs, Tab, Accordion } from 'react-bootstrap';

//redux
import { useSelector,useDispatch } from 'react-redux';
import {setCountryList,setActiveTab,setLanguagesList} from '../redux/actions/userAction'

import ProgramDetails from './smartsetup/ProgramDetails';
import RegistrationStep from './smartsetup/RegistrationStep'
import ServicesStep from './smartsetup/ServicesStep';
import AlertsStep from './smartsetup/AlertsStep';
import WorkflowStep from './smartsetup/WorkflowStep';
import imgurl from '../assets/images/imgUrl';
import API from "../util";

const Dashboard = () => {
    const [validSteps,setValidSteps] = useState({"step1":false,"step2":false,"step3":false,"step4":false,"step5":false})
    const [inProgress,setInProgress] = useState(false)
    const userStoreState = useSelector((state)=> state.user)
    //const storeState = useSelector((state)=> state)
    //console.log("storeState",storeState)
    const dispatch = useDispatch();
    
    const getCountryList = () => {
        API.get(`common/get/countries/list`).then((res) => {
            if (res.status === 200 && res.data.length > 0) {
                dispatch(setCountryList(res.data))
            }
        })
        // API.get(`33/system/flags`).then((res) => {
        //     if (res.status === 200 && res.data.length > 0) {
        //         dispatch(setCountryList(res.data))
        //     }
        // })
    }
    
    const getLanguagesList =()=>{
        API.get(`33/locales/db`).then((res) => {
            if (res.status === 200 && res.data.length > 0) {
                dispatch(setLanguagesList(res.data))
            }
        })
    }
    useEffect(()=>{
        validSteps[userStoreState.activeTab] = true;
        setValidSteps(validSteps)
    },[userStoreState.activeTab])
    
    useEffect(()=>{
        getCountryList()
        getLanguagesList()
    },[])
    
    const handleTabChange = (step)=>{
        dispatch(setActiveTab(step))
    }
    
    return (
        <>
            <nav id="sidebar" className="active">
                <ul className="list-unstyled components">
                    <a href="/smartsetup/#/userhome" className="dashboard">
                        <li className="active"><a href="#"><i className="far fa-file-alt">
                        </i> My Application </a>
                        </li>
                    </a>
                    <a href="/smartsetup/#/userprofile" className="dashboard">
                        <li><a href="#"><i className="fas fa-user"></i> My Profile </a>
                        </li>
                    </a>
                    <a href="/smartsetup/#/upload" className="">
                        <li><a href="javascript:void(0)"><i className="fas fa-file-upload"></i> Index Cases Upload
                        </a>
                        </li>
                    </a>
                    <a href="/smartsetup/#/generateqrcode" className="">
                        <li><a href="javascript:void(0)"><i className="fas fa-qrcode">
                        </i> Generate QR Code </a>
                        </li>
                    </a>
                    <a href="/smartsetup/#/dashboardconfig" className="">
                        <li><a href="javascript:void(0)"><i className="fas fa-chart-pie">
                        </i> Configure Dashboard
                        </a>
                        </li>
                    </a>
                    <a href="/smartsetup/#/usermanagement" className="">
                        <li><a href="javascript:void(0)"><i className="fas fa-users-cog">
                        </i> User Mangement
                        </a>
                        </li>
                    </a>
                    <a href="/smartsetup/#/facilitymanagement" className="">
                        <li><a href="javascript:void(0)"><i className="fas fa-building">
                        </i> Facility Mangement
                        </a>
                        </li>
                    </a>
                    <a href="/smartsetup/#/translations" className="">
                        <li><a href="javascript:void(0)"><i className="fas fa-language">
                        </i> Translations
                        </a>
                        </li>
                    </a>
                    <li><a href="javascript:void(0)">
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </a>
                    </li>
                </ul>
            </nav>
            <div className="contentapp">
                <Navbar expand="lg">
                    <button type="button" id="sidebarCollapse" className="btn btn-info hammenu"><i data-v-c3854e32="" className="fas fa-bars"></i></button>
                    <Navbar.Brand className="navTitle" href="#home">Prevent TB</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                           {/* <img className="avatar mr-2" src={imgurl.avatar.default} /> */}
                            <div>
                                <span className="name">Joy Joyce</span><br></br>
                                <span>joyce@mailinator.com</span>
                            </div>
                            <button className="btn btn-sign"><i className="fas fa-sign-out-alt fa-2x pull-right"></i></button>

                        </Nav>

                    </Navbar.Collapse>
                </Navbar>

                <div className="smart-setup-wrapper">
                    <div className="row">
                        <div className="col-12">
                            <div className="form-wizard">
                                <Card>
                                    <Card.Header className="programHeader" as="h5">SMART SETUP</Card.Header>
                                    <Card.Body className="programMainBody">
                                        <Tab.Container
                                            activeKey={userStoreState.activeTab}
                                            onSelect={k => handleTabChange(k)}
                                            id='controlled-tab-example'
                                        >
                                            <Nav variant='tabs' className='nav nav-pills mb-3 arrow-steps clearfix mt-3 mb-30 mx-0'>
                                                <Nav.Item className={`nav-item step ${userStoreState.activeTab === 'step1' ? 'current' : ''}`}>
                                                    <Nav.Link eventKey='step1'>
                                                        Program
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item className={`nav-item step ${userStoreState.activeTab === 'step2' ? 'current' : ''}`}>
                                                    <Nav.Link eventKey='step2'>
                                                        Registration
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item className={`nav-item step ${userStoreState.activeTab === 'step3' ? 'current' : ''}`}>
                                                    <Nav.Link eventKey='step3'>
                                                        Forms
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item className={`nav-item step ${userStoreState.activeTab === 'step4' ? 'current' : ''}`}>
                                                    <Nav.Link eventKey='step4'>
                                                        Alerts
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item className={`nav-item step ${userStoreState.activeTab === 'step5' ? 'current' : ''}`}>
                                                    <Nav.Link eventKey='step5'>
                                                        Workflow
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                            <Tab.Content className="tab-content">
                                                
                                                <Tab.Pane eventKey='step1'>
                                                    <ProgramDetails />                                                    
                                                </Tab.Pane>

                                                <Tab.Pane eventKey='step2'>
                                                    <RegistrationStep />
                                                </Tab.Pane>

                                                <Tab.Pane eventKey='step3'>
                                                    <ServicesStep />
                                                </Tab.Pane>

                                                <Tab.Pane eventKey='step4'>
                                                    <AlertsStep />
                                                </Tab.Pane>

                                                <Tab.Pane eventKey='step5'>
                                                    <WorkflowStep />
                                                </Tab.Pane>
                                                
                                            </Tab.Content>
                                        </Tab.Container>
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

export default Dashboard;