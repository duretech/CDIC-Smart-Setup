
import React, { useState, useEffect } from 'react';
import { Card, Nav, Navbar, Tab, Modal, Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';

import { useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from 'react-redux';
import { setCountryList, setActiveTab, setLanguagesList, setUserTemplate, setLoader } from '../redux/actions/userAction'
import swal from "sweetalert";
import { baseUrl, baseName, adminModuleName } from "../util/urls";

import Sibebar from '../component/Sidebar';
import ProgramDetails from './smartsetuptracker/ProgramDetails';
import RegistrationStep from './smartsetuptracker/RegistrationStep';
import ServicesStep from './smartsetuptracker/ServicesStep';
import AlertsStep from './smartsetuptracker/AlertsStep';
import WorkflowStep from './smartsetuptracker/WorkflowStep';
import imgurl from '../assets/images/imgUrl';
import API from "../util";
import RoleManagement from './smartsetuptracker/RoleManagement';

const Dashboard2 = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [validSteps, setValidSteps] = useState({ "step1": false, "step2": false, "step3": false, "step4": false, "step5": false })
    const userStoreState = useSelector((state) => state.user)
    const storeState = useSelector((state) => state)
    const registryUrl = baseUrl && baseName ? baseUrl + baseName : "https://example.com/registry"; // Replace with your actual link
    const adminModuleUrl = baseUrl && adminModuleName ? baseUrl + adminModuleName : "https://example.com/admin"; // Replace with your actual link

    function handleCopy() {
        navigator.clipboard.writeText(registryUrl);
        // Optionally, show copied feedback
    }

    function handleOpen() {
        window.open(registryUrl, '_blank');
    }
    function handleAdminModuleOpen() {
        window.open(adminModuleUrl, '_blank');
    }
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);

    const [showFeedModal, setShowFeedModal] = useState(false);

    const handleFeedClose = () => setShowFeedModal(false);

    const [showFAQModal, setShowFAQModal] = useState(false);

    const handleFAQClose = () => setShowFAQModal(false);

    const [userArray, setUserArray] = useState([])

    const [showVideoModal, setShowVideoModal] = useState(false);

    const handleVideoClose = () => setShowVideoModal(false);

    const [showTutorialModal, setShowTutorialModal] = useState(false);

    const handleTutorialClose = () => setShowTutorialModal(false);

    const [feedbackObject, setFeedbackObject] = useState({
        name: "",
        feedback: "",
        rating: "",
        email: ""
    });

    const submitFeedback = () => {
        console.log(feedbackObject)
        API.post('common/savefeedback', feedbackObject).then(res => {
            console.log(res)
        })
        handleFeedClose()
    }
    const getCountryList = () => {
        API.get(`common/get/countries/list`).then((res) => {
            if (res.status === 200 && res.data.data.length > 0) {
                dispatch(setCountryList(res.data.data))
            }
        })
        // API.get(`33/system/flags`).then((res) => {
        //     if (res.status === 200 && res.data.length > 0) {
        //         dispatch(setCountryList(res.data))
        //     }
        // })
    }

    const getLanguagesList = () => {
        API.get(`33/locales/db`).then((res) => {
            if (res.status === 200 && res.data.length > 0) {
                dispatch(setLanguagesList(res.data))
            }
        })
    }

    useEffect(() => {
        validSteps[userStoreState.activeTab] = true;
        setValidSteps(validSteps)
    }, [userStoreState.activeTab])

    useEffect(() => {
        console.log(userStoreState, "userStoreState")
        if (userStoreState.isEdit) {
            setUserArray(storeState.programDetails.userTemplate.users)
        }
        getCountryList()
        getLanguagesList()
        dispatch(setActiveTab('step1'))
        // dispatch(setLoader(true))
        // loginApi(Authorization)
        //     .then((res) => {
        //         console.log(res)
        //         dispatch(setLoader(false))
        //         if (res.status === 200) {
        //             if (true) {
        //                 console.log("res.data.introduction:>>",res.data.introduction, storeState.user.inProgressPublish)
        //                 if (res.data.introduction && res.data.introduction === 'Publish') {
        //                     API.get('tracker/smartsetup/get/' + res.data.organisationUnits[0].id).then(res => {
        //                         dispatch(setEditFlag(true))
        //                         getProgramTemplate(res.data)
        //                     })
        //                 }
        //                 if(res.data.introduction && res.data.introduction ==  'InProgress'){
        //                     setInProgress(true)
        //                 }
        //                 else {
        //                     getProgramTemplate()
        //                     dispatch(setEditFlag(false))
        //                 }
        //                 dispatch(setUser(res.data))
        //             } else {
        //                 swal({
        //                     title: "Not Authorized",
        //                     //text: error.response.data.message,
        //                     text: "You are not authorized to access this app",
        //                     icon: "error",
        //                     button: "Close",
        //                 });
        //             }

        //         }
        //         dispatch(setLoader(false))

        //     })
        //     .catch((error) => {
        //         if (error.response) {
        //             swal({
        //                 title: "Login Failed",
        //                 //text: error.response.data.message,
        //                 text: "Please check the credentials.",
        //                 icon: "error",
        //                 button: "Close",
        //             });
        //         } else {
        //             swal({
        //                 title: "Login Failed",
        //                 text: "Please check the credentials.",
        //                 icon: "error",
        //                 button: "Close",
        //             });
        //         }
        //         dispatch(setLoader(false))
        //     });
        // getProgramTemplate()
    }, [])

    const logoutClickHandler = () => {
        sessionStorage.clear()
        history.push('/')
    }

    return (
        <>
            <Sibebar open={true} />
            <div className="contentapp">
                <Navbar expand="lg">
                    {/* <button type="button" id="sidebarCollapse" className="btn btn-info hammenu"><i data-v-c3854e32="" className="fas fa-bars"></i></button> */}
                    <Navbar.Brand className="navTitle" href="#home"></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            {/* <img alt='avtar' className="avatar mr-2" src={imgurl.avatar.default} /> */}
                            <div>
                                <span className="name">{userStoreState.userDetails.name}</span><br></br>
                                <span>{userStoreState.userDetails.email}</span>
                            </div>
                            <button className="btn btn-sign" onClick={logoutClickHandler}><i className="fas fa-sign-out-alt fa-2x pull-right"></i></button>

                        </Nav>

                    </Navbar.Collapse>
                </Navbar>

                <div className="smart-setup-wrapper">
                    <div className="row">
                        <div className="col-12">
                            <div className='detailsRow d-flex justify-content-end'>
                                {/* <a href="javascript:void(0)" target="_blank">
                                    <div className="p-1" variant="light" >
                                        <i className="fab fa-android pr-2"></i>
                                        PlayStore
                                    </div>
                                </a>
                                <a href="javascript:void(0)" target='_blank'>
                                    <div className=" ml-2 p-1" variant="light" >
                                        <i className="fab fa-apple pr-2"></i>
                                        AppStore
                                    </div>
                                </a>
                                <a href='https://tpttest.imonitorplus.com/caredashboard/' target='_blank'>
                                    <div className="ml-2 p-1" variant="light" >
                                        <i className="fa fa-area-chart pr-2"></i>
                                        Dashboard
                                    </div>
                                </a>
                                <a href='https://tpttest.imonitorplus.com/productuatv1/' target='_blank'>
                                    <div className="ml-2 p-1" variant="light" >
                                        <i className="fab fa-chrome pr-2"></i>
                                        Webapp
                                    </div>
                                </a> */}
                                {userStoreState.isEdit ?
                                    <a href='javascript:void(0)'>
                                        <div onClick={() => {
                                            console.log(userStoreState, storeState, "userStoreState")
                                            setUserArray(storeState.programDetails.userTemplate.users)
                                            setShowModal(true)
                                        }
                                        } className="ml-2 p-1" variant="light" >
                                            <i className="fa fa-users pr-2"></i>
                                            Registry & Admin Module URL
                                        </div>
                                    </a>
                                    : <></>
                                }
                                {/* <a href='javascript:void(0)'>
                                    <div onClick={() => setShowVideoModal(true)} className="p-1  ml-2" variant="light" >
                                        <i className="fab fa-youtube pr-2"></i>
                                        Training Video
                                    </div>
                                </a>
                                <a href='javascript:void(0)'>
                                    <div onClick={() => setShowTutorialModal(true)} className=" ml-2 p-1" variant="light">
                                        <i className="fas fa-book pr-2"></i>
                                        Training Manual
                                    </div>
                                </a>
                                <a href='javascript:void(0)'>
                                    <div onClick={() => setShowFAQModal(true)} className=" ml-2 p-1" variant="light">
                                        <i className="fas fa-question-circle pr-2"></i>
                                        FAQ
                                    </div>
                                </a> */}
                                <a href='javascript:void(0)'>
                                    <div className=" ml-2 p-1" variant="light">
                                        {/* <i className="fas fa-question-circle pr-2"></i> */}
                                        {/* FAQ */}
                                    </div>
                                </a>
                            </div>
                            <div className="form-wizard mt-3">
                                <Card>
                                    <Card.Header className="programHeader" as="h5">SMART SETUP</Card.Header>
                                    <Card.Body className="programMainBody">
                                        <Tab.Container
                                            activeKey={userStoreState.activeTab}
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
                                                        Stages
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item className={`nav-item step ${userStoreState.activeTab === 'step4' ? 'current' : ''}`}>
                                                    <Nav.Link eventKey='step4'>
                                                        Role Management
                                                    </Nav.Link>
                                                </Nav.Item>
                                                {/* <Nav.Item className={`nav-item step ${userStoreState.activeTab === 'step4' ? 'current' : ''}`}>
                                                    <Nav.Link eventKey='step4'>
                                                        Alerts
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item className={`nav-item step ${userStoreState.activeTab === 'step5' ? 'current' : ''}`}>
                                                    <Nav.Link eventKey='step5'>
                                                        Workflow
                                                    </Nav.Link>
                                                </Nav.Item> */}
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
                                                    <RoleManagement />
                                                </Tab.Pane>
                                                {/* <Tab.Pane eventKey='step4'>
                                                    <AlertsStep />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='step5'>
                                                    <WorkflowStep />
                                                </Tab.Pane> */}

                                            </Tab.Content>
                                        </Tab.Container>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div onClick={() => setShowFeedModal(true)} className='style1'>
                <div className='style2'>
                    <i class="fa fa-comments-o" aria-hidden="true"></i>
                </div>

            </div> */}
            <div className="footer">
                <div className="row">
                    <div className="col-6">
                        <p className="footext">Powered by  <img alt='durelogo' className="fooimg" src={imgurl.durelogo.default} /></p>  </div>
                    <div className="col-6">
                        <div className="widthMaxContent ml-auto pt-2">
                            <p className="footextcopy">Copyright © 2020. All rights reserved</p></div>
                    </div>
                </div>
            </div>


            <Modal data-backdrop="static" size="md" data-keyboard="false" show={showFeedModal} onHide={handleFeedClose}>
                <Modal.Header className="p-2" closeButton>
                    <Modal.Title >Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <Form.Label className="label">Name</Form.Label>
                                <input
                                    onChange={(e) => {
                                        let temp = feedbackObject;
                                        temp.name = e.target.value
                                        setFeedbackObject(temp)
                                    }}
                                    // value={feedbackObject.name}
                                    type='text'
                                    className='form-control'
                                    placeholder="Name"
                                />
                            </Col>
                            <Col lg={12}>
                                <Form.Label className="label">Feedback</Form.Label>
                                <textarea
                                    onChange={(e) => {
                                        let temp = feedbackObject;
                                        temp.feedback = e.target.value
                                        setFeedbackObject(temp)
                                    }}
                                    // value={feedbackObject.feedback}
                                    type='textarea'
                                    className='form-control'
                                    placeholder="Feedback"
                                />
                            </Col>
                            <Col lg={12}>
                                <Form.Label className="label  mb-0">Rate Us</Form.Label>
                            </Col>
                            <Col lg={12}>
                                <div class="rate">
                                    <input
                                        onClick={(e) => {
                                            let temp = feedbackObject;
                                            temp.rating = e.target.value
                                            setFeedbackObject(temp)
                                        }}
                                        type="radio" id="star5" name="rate" value="5" />
                                    <label for="star5" >5 stars</label>
                                    <input
                                        onClick={(e) => {
                                            let temp = feedbackObject;
                                            temp.rating = e.target.value
                                            setFeedbackObject(temp)
                                        }}
                                        type="radio" id="star4" name="rate" value="4" />
                                    <label for="star4" >4 stars</label>
                                    <input
                                        onClick={(e) => {
                                            let temp = feedbackObject;
                                            temp.rating = e.target.value
                                            setFeedbackObject(temp)
                                        }}
                                        type="radio" id="star3" name="rate" value="3" />
                                    <label for="star3" >3 stars</label>
                                    <input
                                        onClick={(e) => {
                                            let temp = feedbackObject;
                                            temp.rating = e.target.value
                                            setFeedbackObject(temp)
                                        }}
                                        type="radio" id="star2" name="rate" value="2" />
                                    <label for="star2" >2 stars</label>
                                    <input
                                        onClick={(e) => {
                                            let temp = feedbackObject;
                                            temp.rating = e.target.value
                                            setFeedbackObject(temp)
                                        }}
                                        type="radio" id="star1" name="rate" value="1" />
                                    <label for="star1" >1 star</label>
                                </div>
                            </Col>
                            <Col lg={12}>
                                <Form.Label className="label">Email</Form.Label>
                                <input
                                    // value={feedbackObject.email}
                                    onChange={(e) => {
                                        let temp = feedbackObject;
                                        temp.email = e.target.value
                                        setFeedbackObject(temp)
                                    }}
                                    type='text'
                                    className='form-control'
                                    placeholder="Email"
                                />
                            </Col>
                        </Row>

                    </Container >
                </Modal.Body >
                <Modal.Footer className="p-2">
                    <Button className="btn wizard-btnn btn-sm mr-4" variant="primary" onClick={submitFeedback}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal >
            <Modal data-backdrop="static" size="lg" data-keyboard="false" show={showFAQModal} onHide={handleFAQClose}>
                <Modal.Header className="p-2" closeButton>
                    <Modal.Title >FAQ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <ul>
                            <li>
                                Always ensure that the phone is charged before you start your process for the day.
                            </li>
                            <li>
                                Please make sure that the images taken are not of any the patient / individual
                            </li>
                            <li>
                                DO NOT share your credentials with anyone
                            </li>
                            <li>
                                Please provide all necessary information as required in the application – ensure all mandatory columns are duly filled
                            </li>
                            <li>
                                DO NOT use this application for any unlawful activity
                            </li>
                            <li>
                                Please ensure that all the necessary access is provided to the app from the device after successful installation of the app.
                            </li>
                            <li>
                                GPS of the device needs to be enabled
                            </li>
                            <li>
                                In case of slowness in the app, kindly restart the mobile device.
                            </li>
                            <li>
                                In case of a freezing issue/loader/long waiting time, kindly kill/close the app and re-open it again.
                            </li>
                            There should always be some space/memory available in the mobile device for the smooth functioning of the app. Space/memory can be created by going to settings option on your device and free up space by clicking on My Apps, delete any App that is not required or delete images/videos/audios etc from gallery to create space.
                            <li>
                                Kindly check if the device on which the app is installed has version 6.0.0 and above for Android and 9.0.0 and above for the iOS (Apple) users. If you have a version below the mentioned version the App will not work smoothly on your device
                            </li>
                            <li>
                                Ensure if there is no duplicate UNDP app present in the device. If present, please delete it as it may interfere with the current version
                            </li>
                            <li>
                                Ensure to sync all offline data before logging out or uninstalling the app from your mobile device.
                            </li>
                        </ul>
                        FAQ’s
                        <p>
                            Q) I do not have data connectivity, can I record the data ?<br></br>
                            A) Yes , if the connectivity is not available the entry will be saved in the offline mode and you can sync when there is network available on the click of the Sync menu option which is on the main top menu. This symbol helps Sync the offline data “   “
                        </p>
                        <p>
                            Q) Can I share the details of the patient with my friends on social media ?<br></br>
                            A) No , the data collected for this app is not for public sharing , please refer the terms of reference policy for further details.
                        </p>

                        <p>
                            Q)  Can I delete the images from my phone after I submit the survey ?<br></br>
                            A) Yes , the images attached with the entry are saved online along with the other information. The images are not required to be saved on the phone post the entry is submitted.
                        </p>


                    </Container>
                </Modal.Body>
            </Modal>
            <Modal data-backdrop="static" size="lg" data-keyboard="false" show={showModal} onHide={handleClose}>
                <Modal.Header className="p-2" closeButton>
                    <Modal.Title>Registry & Admin Module URL</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Input group with copy and open buttons */}
                    <Form.Group className="mb-3">
                        <Form.Label><strong>Registry/WebApp Link:</strong></Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                readOnly
                                value={registryUrl}
                                onClick={e => e.target.select()}
                            />
                            <Button variant="outline-secondary" onClick={handleOpen}>
                                Open
                            </Button>
                        </InputGroup>
                    </Form.Group>
                    <hr />
                    <Form.Group className="mb-3">
                        <Form.Label><strong>Admin Module Link:</strong></Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                readOnly
                                value={adminModuleUrl}
                                onClick={e => e.target.select()}
                            />
                            <Button variant="outline-secondary" onClick={handleAdminModuleOpen}>
                                Open
                            </Button>
                        </InputGroup>
                    </Form.Group>
                    <hr />
                    {/* <div style={{ overflowX: 'auto', width: '100%' }}>
                        <Form.Label><strong>Demo Users:</strong></Form.Label>
                        <div style={{ minWidth: 500, overflowX: 'auto', width: '100%' }}>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Password</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userArray.map((user, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2 text-left">{user.username}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-left">{user.password}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-left">healthworker</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div> */}
                </Modal.Body>

                <Modal.Footer className="p-2">
                    <Button className="btn wizard-btnn btn-sm mr-4" variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal size="lg" show={showVideoModal} onHide={handleVideoClose} centered>
                <Modal.Header closeButton className='p-2'>
                    <Modal.Title className='h5'>Training Video</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <video width="100%" controls="controls">
                            <source src="https://ltbigen.duredemos.com/training_resources/PreventTBGenericVideo.mp4" type="video/mp4" /> Your browser does not support HTML5 video.
                        </video>
                    </Container>
                </Modal.Body>
            </Modal>

            <Modal size="xl" show={showTutorialModal} onHide={handleTutorialClose} centered>
                <Modal.Header closeButton className='p-2'>
                    <Modal.Title className='h5'>Demo Credentials</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <h6>Smartsetup</h6>
                        <Row>
                            <Col xs={6} md={6} className="mb-3">
                                <p className='mb-0'>Username : demouser@ltbigen.com</p>
                                <p className='mb-0'>Password : Test@123</p>
                            </Col>
                        </Row>
                        <hr></hr>
                        <h6>Dashboard</h6>
                        <Row>
                            <Col xs={6} md={6} className="mb-3">
                                <p className='mb-0'>Username : demouser@ltbigen.com</p>
                                <p className='mb-0'>Password : Test@123</p>
                            </Col>
                        </Row>
                        <hr></hr>
                        <h6>App/Webapp</h6>
                        <Row>
                            <Col xs={4} md={4} className="mb-3">
                                <p className='mb-0'>Username : 31745_orw1@uatpreventtb.org</p>
                                <p className='mb-0'>Password : Test@123</p>
                                <p className='mb-0'>Token : 123456</p>
                                <p className='mb-0'>Pin : 1234</p>
                            </Col>
                            <Col xs={4} md={4} className="mb-3">
                                <p className='mb-0'>Username : 31745_facilitytb1@uatpreventtb.org</p>
                                <p className='mb-0'>Password : Test@123</p>
                                <p className='mb-0'>Token : 123456</p>
                                <p className='mb-0'>Pin : 1234</p>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Dashboard2;